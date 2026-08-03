import type { ContactData, ContactResponse } from './contact.types';
import { API_URL } from '../../config/api';
import { parseJsonSafe, errorMessage } from '../../lib/http';

export const ContactService = {
  async sendMessage(data: ContactData): Promise<ContactResponse> {
    const res = await fetch(`${API_URL}/contact/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    const parsed = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(errorMessage(parsed, 'Failed to send message'));
    }

    return parsed as ContactResponse;
  }
};
