import prisma from '../../../database/prisma';

export interface ContactMessageDTO {
  name: string;
  email: string;
  message: string;
}

export const insertContactMessage = async (data: ContactMessageDTO) => {
  return prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      message: data.message,
    }
  });
};
