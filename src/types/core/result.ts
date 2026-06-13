// Define base API error structure
export interface ApiError {
    code: string;
    message: string;
}

// Define generic result wrapper for API responses
export interface Result<T = void> {
    isSuccess: boolean;
    isFailure: boolean;
    error: ApiError;
    value?: T;
}

// Define validation result that extends the base result
export interface ValidationResult<T = void> extends Result<T> {
    errors: ApiError[];
}
