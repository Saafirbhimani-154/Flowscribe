import type { UsageData } from './profile.types';
import { API_URL } from '../../config/api';
import { parseJsonSafe, errorMessage } from '../../lib/http';

export const profileService = {
  getUsage: async (slugId: string): Promise<UsageData> => {
    const res = await fetch(`${API_URL}/user-profile/${slugId}/usage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    const data = await parseJsonSafe(res);
    if (!res.ok) {
      throw new Error(errorMessage(data, 'Failed to fetch usage'));
    }

    return data.usage as UsageData;
  }
};
