import { NextFunction, Request, Response } from "express";

const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Methods", "GET, POST");
	res.header("Access-Control-Allow-Origin", "*");
	next();
};

export default corsMiddleware;
