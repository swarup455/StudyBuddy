// Make sure you have this error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);
    
    // Handle ApiError
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            statusCode: err.statusCode
        });
    }
    
    // Handle JWT errors specifically  
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: "Token expired",
            statusCode: 401
        });
    }
    
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
            statusCode: 401
        });
    }
    
    // Generic error
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        statusCode: 500
    });
};

// Make sure this is registered AFTER all your routes:
// app.use(errorHandler);