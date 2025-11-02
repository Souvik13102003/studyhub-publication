// pages/api/admin/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import os from "os";
import path from "path";
import { verifyTokenFromHeader } from "@/lib/verifyAdmin";

// try to require busboy/formidable at runtime (may be undefined under some bundlers)
let BusboyPkg: any = null;
let FormidablePkg: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  BusboyPkg = require("busboy");
} catch (err) {
  BusboyPkg = null;
}
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  FormidablePkg = require("formidable");
} catch (err) {
  FormidablePkg = null;
}

export const config = { api: { bodyParser: false } };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Promisified stream upload to Cloudinary */
function streamUploadToCloudinary(
  fileStream: NodeJS.ReadableStream,
  opts: any = {}
) {
  return new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "studyhub_publication",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        ...opts,
      },
      (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    fileStream.pipe(uploadStream);
    fileStream.on("error", (err) => reject(err));
  });
}

/** Formidable disk-upload fallback: returns array of uploaded results */
async function formidableDiskUploadHandler(req: NextApiRequest) {
  if (!FormidablePkg) throw new Error("formidable package not installed");

  const uploadDir = path.join(os.tmpdir(), "studyhub_uploads");
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    /* ignore */
  }

  const formidable = (FormidablePkg as any).default || FormidablePkg;
  const form = formidable({
    multiples: false,
    keepExtensions: true,
    uploadDir,
    filename: (name: string, ext: string, part: any) => {
      return `${Date.now()}_${part?.originalFilename || "upload"}`;
    },
  });

  return new Promise<any[]>((resolve, reject) => {
    form.parse(req as any, async (err: any, fields: any, files: any) => {
      if (err) return reject(err);
      try {
        const file = (files.file as any) || (files.image as any);
        if (!file) return reject(new Error("file required"));

        const filepath = file.filepath || file.path;
        if (!filepath || !fs.existsSync(filepath)) {
          return reject(new Error("temp file missing"));
        }

        // upload from disk
        const result = await cloudinary.uploader.upload(filepath, {
          folder: "studyhub_publication",
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        });

        try {
          fs.unlinkSync(filepath);
        } catch (e) {
          /* ignore */
        }
        resolve([result]);
      } catch (e) {
        reject(e);
      }
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "method not allowed" });

  // verify token
  try {
    const admin = verifyTokenFromHeader(req.headers.authorization);
    if (!admin) {
      console.warn("unauthorized attempt to upload", {
        authHeader: req.headers.authorization,
      });
      return res.status(401).json({ error: "unauthorized" });
    }
  } catch (err) {
    console.error("verifyToken error:", String(err));
    return res.status(401).json({ error: "unauthorized" });
  }

  // Try to obtain a usable Busboy constructor. It might be BusboyPkg, BusboyPkg.default or BusboyPkg.Busboy
  const potentialCtor = BusboyPkg
    ? BusboyPkg.default || BusboyPkg.Busboy || BusboyPkg
    : null;

  try {
    if (potentialCtor) {
      // try to instantiate; if it throws we will fall back to formidable
      try {
        const busboy = new potentialCtor({ headers: req.headers });
        // streaming path with busboy
        const uploadPromises: Promise<any>[] = [];
        let fileFieldCount = 0;

        busboy.on(
          "file",
          (
            _fieldname: string,
            fileStream: NodeJS.ReadableStream,
            fileInfo: any
          ) => {
            fileFieldCount += 1;
            uploadPromises.push(streamUploadToCloudinary(fileStream, {}));
          }
        );

        busboy.on("field", (_name: string, _val: string) => {
          // collect fields if needed
        });

        busboy.on("error", (err: any) => {
          console.error("busboy error:", String(err));
          if (!res.headersSent)
            res
              .status(500)
              .json({ error: "upload failed", detail: String(err) });
        });

        busboy.on("finish", async () => {
          try {
            if (fileFieldCount === 0) {
              console.warn("no file field received");
              return res.status(400).json({ error: "file required" });
            }

            const results = await Promise.all(uploadPromises);
            if (!results || results.length === 0) {
              console.error("upload did not produce url");
              return res.status(500).json({ error: "upload failed" });
            }

            const urls = results.map((r) => r.secure_url).filter(Boolean);
            return res.status(200).json({ url: urls[0], urls });
          } catch (err) {
            console.error("error waiting for upload promises:", String(err));
            if (!res.headersSent)
              res
                .status(500)
                .json({ error: "upload failed", detail: String(err) });
          }
        });

        // pipe the request
        (req as any).pipe(busboy);
        return;
      } catch (instErr: any) {
        // constructor threw — log and fall through to fallback
        console.warn(
          "Busboy constructor attempt failed, falling back to formidable. err:",
          instErr && instErr.message ? instErr.message : String(instErr)
        );
      }
    }

    // Busboy missing or couldn't instantiate -> use Formidable fallback
    if (FormidablePkg) {
      try {
        const results = await formidableDiskUploadHandler(req);
        const urls = results.map((r) => r.secure_url).filter(Boolean);
        return res.status(200).json({ url: urls[0], urls });
      } catch (err: any) {
        console.error(
          "formidable fallback error:",
          err && err.message ? err.message : String(err)
        );
        return res
          .status(500)
          .json({
            error: "upload failed",
            detail: err && err.message ? err.message : String(err),
          });
      }
    }

    console.error(
      "No multipart parser available (busboy/formidable not installed or failed to instantiate)"
    );
    return res
      .status(500)
      .json({ error: "server misconfigured: missing multipart parser" });
  } catch (e: any) {
    console.error(
      "upload handler catch:",
      e && e.message ? e.message : String(e)
    );
    if (!res.headersSent)
      res
        .status(500)
        .json({
          error: "upload failed",
          detail: e && e.message ? e.message : String(e),
        });
    return;
  }
}
