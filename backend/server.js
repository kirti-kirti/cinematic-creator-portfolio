// Updated: video upload fix - 200MB limit, multer error handling
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import rateLimit from 'express-rate-limit';
import { db } from './database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123';

await db.init();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('CORS: origin not allowed'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Cloudinary
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary initialized.');
} else {
  console.log('Cloudinary not configured. Using local storage.');
}

// Multer — safe filename, type + size validation
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.webm']);

const getSafeExt = (originalname) => path.extname(path.basename(originalname)).toLowerCase();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = getSafeExt(file.originalname);
    if (!ALLOWED_EXTENSIONS.has(ext)) return cb(new Error('File type not allowed'));
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB for large videos
  fileFilter: (req, file, cb) => {
    const ext = getSafeExt(file.originalname);
    ALLOWED_EXTENSIONS.has(ext) ? cb(null, true) : cb(new Error('File type not allowed. Allowed: jpg, png, gif, webp, mp4, mov, webm'));
  }
});

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many submissions. Please try again after 15 minutes.' }
});

// Auth middleware
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSCODE}`) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing passcode.' });
  }
  next();
};

// --- PUBLIC ROUTES ---

app.get('/api/services', async (req, res, next) => {
  try {
    res.json(await db.getServices());
  } catch (err) { next(err); }
});

app.get('/api/testimonials', async (req, res, next) => {
  try {
    res.json(await db.getTestimonials());
  } catch (err) { next(err); }
});

app.get('/api/portfolio', async (req, res, next) => {
  try {
    res.json(await db.getPortfolio());
  } catch (err) { next(err); }
});

app.post('/api/inquiries', inquiryLimiter, async (req, res, next) => {
  try {
    const { name, phone, email, projectType, budget, message } = req.body;
    if (!name || !phone || !email || !projectType || !message) {
      return res.status(400).json({ error: 'Missing required fields: name, phone, email, projectType, message' });
    }
    const inquiry = await db.saveInquiry({ name, phone, email, projectType, budget, message });
    res.status(201).json({ success: true, inquiry });
  } catch (err) { next(err); }
});

app.post('/api/auth/login', (req, res) => {
  const { passcode } = req.body;
  if (passcode === ADMIN_PASSCODE) {
    res.json({ success: true, token: ADMIN_PASSCODE });
  } else {
    res.status(401).json({ success: false, error: 'Invalid admin passcode.' });
  }
});

// --- ADMIN ROUTES ---

// Upload (admin-only, path-traversal safe)
app.post('/api/upload', requireAdmin, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer upload error:', err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large. Maximum size is 500MB.' });
      }
      return res.status(400).json({ error: err.message || 'File upload error.' });
    }
    next();
  });
}, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const localPath = path.resolve(uploadsDir, req.file.filename);
    if (!localPath.startsWith(uploadsDir)) {
      fs.unlinkSync(localPath);
      return res.status(400).json({ error: 'Invalid file path.' });
    }

    if (isCloudinaryConfigured) {
      const result = await cloudinary.uploader.upload(localPath, {
        folder: 'portfolio_creations',
        resource_type: 'auto'
      });
      fs.unlink(localPath, (err) => { if (err) console.error('Temp file cleanup failed:', err); });
      return res.json({ success: true, url: result.secure_url, provider: 'cloudinary' });
    }

    res.json({ success: true, url: `/uploads/${req.file.filename}`, provider: 'local' });
  } catch (err) { next(err); }
});

app.get('/api/inquiries', requireAdmin, async (req, res, next) => {
  try {
    res.json(await db.getInquiries());
  } catch (err) { next(err); }
});

app.put('/api/inquiries/:id', requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['read', 'unread'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "read" or "unread"' });
    }
    const updated = await db.updateInquiryStatus(req.params.id, status);
    updated ? res.json({ success: true }) : res.status(404).json({ error: 'Inquiry not found' });
  } catch (err) { next(err); }
});

app.delete('/api/inquiries/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await db.deleteInquiry(req.params.id);
    deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Inquiry not found' });
  } catch (err) { next(err); }
});

app.post('/api/portfolio', requireAdmin, async (req, res, next) => {
  try {
    const item = req.body;
    if (!item.title || !item.category || !item.mediaType || !item.url) {
      return res.status(400).json({ error: 'Missing required fields: title, category, mediaType, url' });
    }
    const saved = await db.savePortfolioItem(item);
    res.status(201).json({ success: true, item: saved });
  } catch (err) { next(err); }
});

app.put('/api/portfolio/:id', requireAdmin, async (req, res, next) => {
  try {
    const item = { ...req.body, id: req.params.id };
    if (!item.title || !item.category || !item.mediaType || !item.url) {
      return res.status(400).json({ error: 'Missing required fields: title, category, mediaType, url' });
    }
    const saved = await db.savePortfolioItem(item);
    res.json({ success: true, item: saved });
  } catch (err) { next(err); }
});

app.delete('/api/portfolio/:id', requireAdmin, async (req, res, next) => {
  try {
    const deleted = await db.deletePortfolioItem(req.params.id);
    deleted ? res.json({ success: true }) : res.status(404).json({ error: 'Portfolio item not found' });
  } catch (err) { next(err); }
});

app.get('/api/stats', requireAdmin, async (req, res, next) => {
  try {
    res.json(await db.getStats());
  } catch (err) { next(err); }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
