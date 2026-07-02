import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth } from "../middleware/auth.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Keep file in memory — no disk writes, works on Vercel serverless.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype) || file.mimetype === "application/pdf")
      cb(null, true);
    else cb(new Error("Only image or PDF files are allowed"));
  },
});

// Wraps Cloudinary's callback-based upload_stream in a Promise.
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      // resource_type "auto" lets Cloudinary accept PDFs (resume) as well as images.
      { folder: "portfolio", resource_type: "auto" },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

const router = Router();

// POST /api/upload — admin only; returns a Cloudinary CDN URL.
router.post("/", requireAuth, upload.single("image"), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  try {
    const result = await uploadToCloudinary(req.file.buffer);
    res.json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
});

export default router;
