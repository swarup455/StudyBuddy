// utils/errorHandler.js
export const extractErrorMessage = (error) => {
    // API error message (your backend)
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    // Alternative error field
    if (error?.response?.data?.error) {
        return error.response.data.error;
    }

    // Validation errors array
    if (error?.response?.data?.errors?.length > 0) {
        return error.response.data.errors[0].message;
    }

    // Network/Axios error
    if (error?.message) {
        return error.message;
    }

    // Ultimate fallback
    return "Something went wrong. Please try again.";
};