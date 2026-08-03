import { Request, Response, Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../../middlewares/auth.middleware';

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

/**
 * Verifies a file's actual content matches an allowed image type by
 * checking its magic bytes, rather than trusting the client-supplied
 * MIME type (which is trivial to spoof via the multipart Content-Type
 * header on the upload).
 */
function hasValidImageSignature(filePath: string): boolean {
  const fd = fs.openSync(filePath, 'r');
  try {
    const buffer = Buffer.alloc(12);
    const bytesRead = fs.readSync(fd, buffer, 0, 12, 0);
    if (bytesRead < 4) return false;

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    const pngSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    if (pngSig.every((byte, i) => buffer[i] === byte)) return true;

    // WebP: "RIFF" .... "WEBP"
    if (
      bytesRead >= 12 &&
      buffer.slice(0, 4).toString('ascii') === 'RIFF' &&
      buffer.slice(8, 12).toString('ascii') === 'WEBP'
    ) {
      return true;
    }

    return false;
  } finally {
    fs.closeSync(fd);
  }
}

/** Removes files from UPLOAD_DIR older than the given age (ms). Best-effort. */
function cleanupStaleUploads(maxAgeMs: number) {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      console.warn('[UploadController] Cleanup: could not list upload dir:', err.message);
      return;
    }
    const now = Date.now();
    for (const file of files) {
      const filePath = path.join(UPLOAD_DIR, file);
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) return;
        if (now - stats.mtimeMs > maxAgeMs) {
          fs.unlink(filePath, () => {});
        }
      });
    }
  });
}

// Sweep stale uploads on an interval (default: files older than 1 hour, checked every 15 minutes).
const CLEANUP_MAX_AGE_MS = 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000;
setInterval(() => cleanupStaleUploads(CLEANUP_MAX_AGE_MS), CLEANUP_INTERVAL_MS).unref();

export const uploadRoutes: Router = Router();

// All upload endpoints require an authenticated user — previously this
// route was fully public, letting anyone upload files to the server or
// fetch anyone else's uploaded images by guessing/enumerating filenames.
uploadRoutes.use(authMiddleware);

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

    // Reject files whose content doesn't actually match an allowed image
    // format, even if the declared MIME type passed multer's fileFilter.
    const invalidFiles = uploadedFiles.filter(file => !hasValidImageSignature(file.path));
    if (invalidFiles.length > 0) {
      // Clean up everything from this request, valid or not — partial
      // uploads left behind would just be more stale files to sweep.
      for (const file of uploadedFiles) {
        fs.unlink(file.path, () => {});
      }
      res.status(400).json({
        success: false,
        message: 'One or more files did not match a supported image format (JPEG, PNG, or WebP).',
      });
      return;
    }

    const results = uploadedFiles.map(file => ({
      id: path.basename(file.filename, path.extname(file.filename)),
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      // Note: intentionally NOT returning `file.path` — that's an
      // absolute server filesystem path and has no use to the client;
      // exposing it leaks server directory structure.
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
 * Serve a stored image by filename (for previews). Requires auth (see
 * uploadRoutes.use above) — filenames are only ever handed to the user
 * who uploaded them via the POST response, but this still keeps the
 * endpoint from being an open file server for anonymous requests.
 */
uploadRoutes.get('/:filename', (req: Request, res: Response) => {
  const requestedName = req.params.filename as string;
  // Reject path traversal / anything that isn't a plain filename we generated.
  if (requestedName !== path.basename(requestedName)) {
    res.status(400).json({ success: false, message: 'Invalid filename.' });
    return;
  }

  const filePath = path.join(UPLOAD_DIR, requestedName);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ success: false, message: 'File not found.' });
    return;
  }
  res.sendFile(filePath);
});
