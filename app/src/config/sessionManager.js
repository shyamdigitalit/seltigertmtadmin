// sessionManager.js

let refreshTimer = null;

export const startSessionTimer = (store, axiosInstance) => {
  stopSessionTimer();

  const scheduleRefresh = () => {
    refreshTimer = setTimeout(async () => {
      try {
        const res = await axiosInstance.post('/auth/refresh-token');
        const newToken = res.data.data;

        store.dispatch({
          type: 'auth/setAccessToken',
          payload: newToken,
        });

        // 🔁 schedule next cycle
        scheduleRefresh();

      } catch (err) {
        // ❌ refresh failed → logout
        store.dispatch({ type: 'auth/logout' });
        stopSessionTimer();
      }
    }, 50 * 1000); // refresh at 50s (token = 60s)
  };

  scheduleRefresh();
};

export const stopSessionTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};