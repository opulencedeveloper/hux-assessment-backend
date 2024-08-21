import express, { NextFunction, Request, Response, Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server as HttpServer } from "http";

import Logging from "./src/utils/loggin";
import { MessageResponse } from "./src/utils/enum";
import { AuthRouter } from "./src/auth/router";
import { ContactRouter } from "./src/contact/router";

const app: Express = express();

let server: HttpServer;

dotenv.config();

const port = process.env.PORT || 8080;

const StartServer = () => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    Logging.info(
      `Incoming ==> Method : [${req.method}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {

      Logging.info(
        `Incomming ==> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - status: [${res.statusCode}]`
      );
    });

    next();
  });

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  app.use(
    "/api/v1",
    AuthRouter,
    ContactRouter
  );

  app.get("/api/v1/healthcheck", (_req: Request, res: Response) => {
    res.status(200).json({ status: "UP 🔥🔧🎂" });
  });

  app.use((_req: Request, res: Response) => {
    const _error = new Error("Url not found 😟");

    Logging.error(_error);

    return res.status(404).json({ message: _error.message });
  });

  //error-middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err) {
      Logging.error(err);

      res.status(500).json({
        status: MessageResponse.Error,
        message: "Internal Server Error",
        data: null,
      });
    }
  });

  server = app.listen(port, () =>
    Logging.info(`Server is running on port ${port} 🔥🔧`)
  );
};

const MONGODB_URI = process.env.MONGODB_URI || "";

console.log("checkkkkkkk", process.env.NODE_ENV);

if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      Logging.info(`Database connected 🎂`);
      StartServer();
    })
    .catch((_error) => {
      Logging.error("Error while connecting to Database ===> ");
      Logging.error(_error);
      process.exit(1);
    });
} else {
  StartServer();
}


  export { app, server };

