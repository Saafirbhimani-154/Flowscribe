import { Request, Response } from 'express';
import { insertContactMessage } from './contact.models';

export const createContactMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;
    
    await insertContactMessage({ name, email, message });
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.'
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred while sending your message.'
    });
  }
};
