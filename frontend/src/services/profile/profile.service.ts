import type { UsageData } from './profile.types';

const API_URL = import.meta.env.VITE_API_URL || '';

export const profileService = {
  getUsage: async (slugId: string): Promise<UsageData> => {
    const res = await fetch(`${API_URL}/user-profile/${slugId}/usage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Failed to fetch usage');
    }

    const data = await res.json();
    return data.usage as UsageData;
  }
};
