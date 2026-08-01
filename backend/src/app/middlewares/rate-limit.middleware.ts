import { Request, Response, NextFunction } from 'express';
import prisma from '../../database/prisma';


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // authMiddleware must run before this to populate req.user
    const user = (req as any).user;
    
    if (!user || !user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized access to AI endpoint.' });
    }

    // Get current date (UTC start of day)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Upsert prompt usage for today
    const usage = await prisma.promptUsage.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      },
      update: {}, // We don't increment here, we just get or create
      create: {
        userId: user.id,
        date: today,
        count: 0
      }
    });

    const MAX_PROMPTS_PER_DAY = 5;
    if (usage.count >= MAX_PROMPTS_PER_DAY) {
      return res.status(429).json({ 
        success: false, 
        message: `You have reached your limit of ${MAX_PROMPTS_PER_DAY} AI generations per day.` 
      });
    }

    // Increment usage count
    await prisma.promptUsage.update({
      where: { id: usage.id },
      data: { count: { increment: 1 } }
    });

    next();
  } catch (error) {
    next(error);
  }
};
