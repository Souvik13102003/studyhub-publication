// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  console.warn("⚠️ MONGODB_URI not set. DB calls will fail until configured.");
}

type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // allow global var across module reloads in dev
  // eslint-disable-next-line no-var
  var _mongoCache: Cache | undefined;
}

const cache: Cache = global._mongoCache || { conn: null, promise: null };
if (!global._mongoCache) global._mongoCache = cache;

export default async function dbConnect() {
  if (!MONGODB_URI) return null;
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
