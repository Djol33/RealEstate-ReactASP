import { useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config';

/**
 * Tracks a listing view (after a 3s dwell) and reports total time spent
 * on the page, including on tab close via `beforeunload`.
 */
export function useViewTracking(id: string | undefined) {
  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(() => {
      axios.post(`${API_URL}/api/RealEstateMain/${id}/view`).catch(() => {});
    }, 3000);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const startedAt = Date.now();

    function sendDuration() {
      const seconds = Math.round((Date.now() - startedAt) / 1000);
      if (seconds < 3) return;
      axios.post(
        `${API_URL}/api/RealEstateMain/${id}/view-duration`,
        { durationSeconds: seconds },
        { timeout: 2000 }
      ).catch(() => {});
    }

    window.addEventListener('beforeunload', sendDuration);
    return () => {
      window.removeEventListener('beforeunload', sendDuration);
      sendDuration();
    };
  }, [id]);
}
