import express, { Request, Response } from "express";
import cors from "cors";
import v1Router from "./routes/v1";

const app = express();
const port = process.env.PORT || 8000;

const allowedOrigins = ["http://localhost:3000", "https://vansiriso.uk"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};

app.use(cors(options));
app.use(express.json());
app.use("/v1", v1Router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello, TypeScript Express!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
