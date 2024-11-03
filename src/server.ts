import express, { NextFunction, Request, Response } from "express";
import http from "http";

// Server Setup

const app = express();
const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
	res.header('Access-Control-Allow-Methods', 'GET');
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.get('/', (req: Request, res: Response) => {
	const data = {
		uptime: process.uptime(),
		message: 'Ok',
		date: new Date()
	};

	res.status(200).send(data);
});

const server = http.createServer(app);
server.listen(process.env.PORT);