import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import ToastEventBus from 'primevue/toasteventbus';
import type { Result } from '@/types/core/result';
import { ACCESS_TOKEN_KEY } from '@/constants/auth';

// Create Axios instance with Base URL
const apiClient = axios.create({
    baseURL: 'http://localhost:5001',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Helper function to handle and display failures
const handleApiFailure = (errorData: { code: string; message: string }, config?: any) => {
    // Log error to console
    console.error(`[API Error] Code: ${errorData.code} | Message: ${errorData.message}`);

    let detailMessage = errorData.message || 'Something went wrong';
    if (config?.url?.endsWith('/Authentication/Login') && (errorData.code === '500' || errorData.code === 'HTTP_500')) {
        detailMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
    }

    // Trigger Toast notification using PrimeVue Event Bus
    ToastEventBus.emit('add', {
        severity: 'error',
        summary: errorData.code || 'API Error',
        detail: detailMessage,
        life: 5000
    });
};

// Response Interceptor: Parse Result<T> and handle errors
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        const result: Result<any> = response.data;

        // Check if the response body contains a Result wrap and it is a failure
        if (result && typeof result === 'object' && result.isFailure) {
            handleApiFailure(result.error, response.config);
        }

        return response;
    },
    (error) => {
        let errorResult: Result<any> = {
            isSuccess: false,
            isFailure: true,
            error: {
                code: 'UNKNOWN_ERROR',
                message: 'An unexpected error occurred'
            }
        };

        if (error.response && error.response.data) {
            const data = error.response.data;
            // If the backend returned a structured Result<T> error wrapper
            if (data.isFailure && data.error) {
                errorResult = data;
            } else {
                errorResult.error = {
                    code: `HTTP_${error.response.status}`,
                    message: data.message || error.message || 'HTTP error occurred'
                };
            }
        } else if (error.request) {
            // Network error
            errorResult.error = {
                code: 'NETWORK_ERROR',
                message: 'Unable to connect to the server'
            };
        } else {
            errorResult.error.message = error.message;
        }

        // Handle Unauthorize error (401)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            ToastEventBus.emit('add', {
                severity: 'warn',
                summary: 'Yêu cầu đăng nhập',
                detail: 'Phiên làm việc hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.',
                life: 5000
            });
            import('@/router').then((r) => {
                r.default.push('/auth/login');
            });
        } else {
            handleApiFailure(errorResult.error, error.config);
        }

        // Reject with the structured Result wrapper so the caller can handle it
        return Promise.reject(errorResult);
    }
);

export default apiClient;
