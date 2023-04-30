import ErrorHandler from "../utils/ErrorHandler";

export default function errorHandlerMiddleware(err, req, res, next){
    const statusCode = err.statusCode || 500;
    const message = err.message || "ttttttttttt Server Error";
    res.status(statusCode).json({ message });
  }
  
  
  
  
  
  
  

