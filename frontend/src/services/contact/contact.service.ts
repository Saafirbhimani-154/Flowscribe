import type { ContactData, ContactResponse } from './contact.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const ContactService = {
  async sendMessage(data: ContactData): Promise<ContactResponse> {
    const res = await fetch(`${API_URL}/contact/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const error = await res.json();
      throw error;
    }

    return res.json();
  }
};
