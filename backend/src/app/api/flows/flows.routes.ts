import { Router } from 'express';
import multer from 'multer';
import { analyzeFlow, completeFlow } from './flows.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { rateLimitMiddleware } from '../../middlewares/rate-limit.middleware';

const router: Router = Router();

// Multer setup: keep in memory, max 5 images, 10MB each
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WEBP are allowed.'));
    }
  }
});

// Protect all flow routes with Auth; rate-limit only the expensive
// vision extraction call (`/analyze`). `/complete` continues the SAME
// analysis session and previously consumed a second daily credit for
// what is really one logical "analysis" from the user's perspective.
router.use(authMiddleware);

router.post('/analyze', rateLimitMiddleware, upload.array('images', 5), analyzeFlow);
router.post('/complete', completeFlow);

export { router as flowsRoutes };
