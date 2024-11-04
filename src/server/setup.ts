// src/app.ts
import express from "express";
import corsMiddleware from "./middleware/cors";
import webhookRoutes from "./webhooks/index";

const app = express();
app.use(express.json());
app.use(corsMiddleware);

// Health check endpoint
app.get("/", (req, res) => {
	const data = {
		uptime: process.uptime(),
		message: "Ok",
		date: new Date()
	};
	res.status(200).send(data);
});

// Register routes
app.use("/webhooks", webhookRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
