export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiFailureResponse {
  success: false;
  message: string;
  error: string;
}

export function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

export function failureResponse(message: string, error: string): ApiFailureResponse {
  return {
    success: false,
    message,
    error,
  };
}
