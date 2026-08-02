import { Request, Response, Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure temp upload directory exists
const UPLOAD_DIR = path.join('/tmp', 'flowscribe-uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer configuration — stores files on disk in /tmp/flowscribe-uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 }, // 10 MB per file, max 5
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

export const uploadRoutes: Router = Router();

/**
 * POST /api/v1/uploads
 * Accepts up to 5 images, stores them in /tmp, and returns their IDs
 * so the frontend can show previews immediately while the AI pipeline runs.
 */
uploadRoutes.post('/', upload.array('images', 5), (req: Request, res: Response) => {
  try {
    const uploadedFiles = req.files as Express.Multer.File[];
    if (!uploadedFiles || uploadedFiles.length === 0) {
      res.status(400).json({ success: false, message: 'No files uploaded.' });
      return;
    }

    const results = uploadedFiles.map(file => ({
      id: path.basename(file.filename, path.extname(file.filename)),
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      path: file.path,
    }));

    console.log(`[UploadController] Received ${uploadedFiles.length} file(s):`, results.map(r => r.originalName));

    res.status(200).json({ success: true, files: results });
  } catch (err: any) {
    console.error('[UploadController] Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/v1/uploads/:filename
 * Serve a stored image by filename (for previews)
 */
uploadRoutes.get('/:filename', (req: Request, res: Response) => {
  const filePath = path.join(UPLOAD_DIR, req.params.filename as string);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ success: false, message: 'File not found.' });
    return;
  }
  res.sendFile(filePath);
});
