import { NextFunction, Request, Response } from "express";

// Logger Middleware.
const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method}`);
    next();
};

export default logger;