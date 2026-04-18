import axios from 'axios';

const env = import.meta.env.VITE_ENV || 'dev';
const appenv = import.meta.env.VITE_APP_ENV || 'quality';

const baseUrl = {
  dev: {
    quality: import.meta.env.VITE_API_URL_DEVQ,
    production: import.meta.env.VITE_API_URL_DEVP,
  },
  live: {
    quality: import.meta.env.VITE_API_URL_QAS,
    production: import.meta.env.VITE_API_URL_PRD,
  }
};

const basicAuthHeader = 'Basic ' + btoa(`${import.meta.env.VITE_API_USR}:${import.meta.env.VITE_API_PSS}`);

const axiosInstance = axios.create({
  baseURL: baseUrl[env][appenv],
  withCredentials: true, // ✅ crucial for cookies
});

export const setupInterceptors = (store) => {

  axiosInstance.interceptors.request.use(
    (config) => {
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';

      const isAuthEndpoint =
        config.url?.startsWith('/auth/login') ||
        config.url?.startsWith('/auth/refresh-token') ||
        config.url?.startsWith('/auth/session');

      if (isAuthEndpoint) {
        config.headers['authorization'] = basicAuthHeader;
        return config;
      }

      const accessToken = store.getState().auth.user?.token;

      if (accessToken) {
        config.headers['authorization'] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    res => res,
    async (error) => {
      const originalRequest = error.config;

      // ❌ If refresh itself fails → logout immediately
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        store.dispatch({ type: 'auth/logout' });
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const res = await axiosInstance.post('/auth/refresh-token');
          const newToken = res.data.data;

          store.dispatch({
            type: 'auth/setAccessToken',
            payload: newToken
          });

          originalRequest.headers['authorization'] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);

        } catch (refreshErr) {
          // ❌ NO REFRESH TOKEN → LOGOUT
          store.dispatch({ type: 'auth/logout' });
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance