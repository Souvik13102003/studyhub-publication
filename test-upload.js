// test-upload.js
// Usage: node test-upload.js
// Make sure .env.local exists in project root with Cloudinary vars (or set env vars).

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { v2: cloudinary } = require("cloudinary");

// load .env.local (you said your file is .env.local)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Print a small env-check (won't print secrets)
console.log("Cloudinary env:", {
  cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
  api_key: !!process.env.CLOUDINARY_API_KEY,
  api_secret: !!process.env.CLOUDINARY_API_SECRET,
});

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET,
});

// Put your file path here (you provided):
const filePath = path.resolve("D:\\Projects\\studyhub-publication\\public\\samples\\bangla-back.jpg");

async function run() {
  try {
    // check file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found at:", filePath);
      process.exitCode = 2;
      return;
    }

    console.log("Uploading file:", filePath);

    // upload (promise)
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "studyhub_publication/test_upload",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      resource_type: "image",
    });

    console.log("Upload successful!");
    console.log("secure_url:", result.secure_url);
    console.log("full result object:");
    console.dir(result, { depth: 4, colors: true });
  } catch (err) {
    console.error("Upload failed:");
    // print helpful error info
    if (err && err.name) console.error("name:", err.name);
    if (err && err.message) console.error("message:", err.message);
    console.error("full error:");
    console.error(err);
    process.exitCode = 1;
  }
}

run();
