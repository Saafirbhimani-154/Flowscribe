import { Request, Response, NextFunction } from 'express';
import prisma from '../../database/prisma';


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // authMiddleware must run before this to populate req.user
    const user = req.user;
    
    if (!user || !user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized access to AI endpoint.' });
    }

    // Get current date (UTC start of day)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const MAX_PROMPTS_PER_DAY = 5;

    // Atomic increment
    const usage = await prisma.promptUsage.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today
        }
      },
      update: {
        count: { increment: 1 }
      },
      create: {
        userId: user.id,
        date: today,
        count: 1
      }
    });

    if (usage.count > MAX_PROMPTS_PER_DAY) {
      // Revert the increment since it exceeded the limit
      await prisma.promptUsage.update({
        where: { id: usage.id },
        data: { count: { decrement: 1 } }
      });
      return res.status(429).json({ 
        success: false, 
        message: `You have reached your limit of ${MAX_PROMPTS_PER_DAY} AI generations per day.` 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
