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
    // ✅ Request Interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
            config.headers['Content-Type'] = 'application/json';
            config.headers['Accept'] = 'application/json';
            config.headers['X-Requested-With'] = 'X';

            // 1. Check if the URL is an auth-related setup call (login/refresh)
            // Adjust this list to match exactly which endpoints need Basic Auth
            const isAuthEndpoint = config.url?.startsWith('/auth/login') || config.url?.startsWith('/auth/refresh-token');

            if (isAuthEndpoint) {
                // Use Basic Auth for login or refreshing the token
                config.headers['authorization'] = basicAuthHeader;
            } else {
                // 2. FOR EVERYTHING ELSE (like /blog), use the Bearer Token
                const accessToken = store.getState().auth.user?.token; 
                if (accessToken) {
                    config.headers['authorization'] = `Bearer ${accessToken}`;
                } else {
                    // Optional: Fallback to Basic if no token exists yet
                    config.headers['authorization'] = basicAuthHeader;
                }
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    // ✅ Response Interceptor (auto-refresh)
    axiosInstance.interceptors.response.use(
        res => res,
        async (error) => {
            const originalRequest = error.config;

            if (originalRequest.url?.includes('/auth/refresh-token')) {
                return Promise.reject(error);
            }

            const excludedEndpoints = ['/auth/login', '/auth/register'];
            const isExcluded = excludedEndpoints.some(path => originalRequest.url?.includes(path));

            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                !isExcluded
            ) {
                originalRequest._retry = true;

                try {
                    const res = await axiosInstance.post('/auth/refresh-token');
                    const newToken = res.data;

                    // 🔹 Update Redux store only
                    store.dispatch({ type: 'auth/setAccessToken', payload: newToken });

                    // Retry original request with new token
                    originalRequest.headers['authorization'] = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshErr) {
                    store.dispatch({ type: 'auth/logout' });
                    return Promise.reject(refreshErr);
                }
            }

            return Promise.reject(error);
        }
    );
};

export default axiosInstance;
