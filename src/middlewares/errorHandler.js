function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";

    switch (true) {
        case err.name === "ApiError":
            break;

        case err.name === "ValidationError":
            statusCode = 400;
            break;

        case err.name === "CastError":
            statusCode = 400;
            message = "Invalid ID format";
            break;

        case err.code === 11000:
            statusCode = 409;
            message = "Duplicate entry";
            break;

        default:
            break;
    }

    console.log(req.method, req.originalUrl, "-", statusCode, "-", message);
    console.log("Stack: ", err.stack);

    if (process.env.NODE_ENV === "production") {
        return res.status(statusCode).json({
            success: false,
            message: message
        });
    }

    return res.status(statusCode).json({
        success: false,
        message: message
    });
}

export default errorHandler;
