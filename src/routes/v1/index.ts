import { Router } from "express";
import converseRouter from "./converse/index.route";

const v1Router = Router();

v1Router.use("/converse", converseRouter);

export default v1Router;