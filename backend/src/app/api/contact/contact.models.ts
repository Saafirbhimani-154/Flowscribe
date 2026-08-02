import prisma from '../../../database/prisma';
import type { ContactMessageDTO } from './contact.interface';


export const insertContactMessage = async (data: ContactMessageDTO) => {
  return prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      message: data.message,
    }
  });
};
