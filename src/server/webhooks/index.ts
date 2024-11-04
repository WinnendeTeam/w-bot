import express from "express";
import { handleOrderCreate } from "../controllers/handleOrderCreate";

const webhookRouter = express.Router();

webhookRouter.post("/orders/create", handleOrderCreate);

export default webhookRouter;
