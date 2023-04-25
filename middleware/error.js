import ErrorHandler from "../utils/ErrorHandler";

function errorHandlerMiddleware(err, req, res, next) {
    if (err instanceof ErrorHandler) {
      res.status(err.statusCode).json({
        message: err.message,
      });
    } else {
      console.error(err);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  export default errorHandlerMiddleware