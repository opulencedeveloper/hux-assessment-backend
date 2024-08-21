"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const loggin_1 = __importDefault(require("./src/utils/loggin"));
const enum_1 = require("./src/utils/enum");
const router_1 = require("./src/auth/router");
const router_2 = require("./src/contact/router");
const app = (0, express_1.default)();
exports.app = app;
let server;
dotenv_1.default.config();
const port = process.env.PORT || 8080;
//Definition of a function that starts the server
const StartServer = () => {
    app.use((req, res, next) => {
        loggin_1.default.info(`Incoming ==> Method : [${req.method}] - IP: [${req.socket.remoteAddress}]`);
        res.on("finish", () => {
            // Log the Response
            loggin_1.default.info(`Incomming ==> Method : [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - status: [${res.statusCode}]`);
        });
        next();
    });
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Cors
    app.use((0, cors_1.default)({
        origin: "*",
        credentials: true,
    }));
    // Routes
    app.use("/api/v1", router_1.AuthRouter, router_2.ContactRouter);
    //Server Health check
    app.get("/api/v1/healthcheck", (_req, res) => {
        res.status(200).json({ status: "UP 🔥🔧🎂" });
    });
    // Invalid url error handling
    app.use((_req, res) => {
        const _error = new Error("Url not found 😟");
        loggin_1.default.error(_error);
        return res.status(404).json({ message: _error.message });
    });
    //error-middleware
    app.use((err, _req, res, _next) => {
        if (err) {
            loggin_1.default.error(err);
            res.status(500).json({
                status: enum_1.MessageResponse.Error,
                message: "Internal Server Error",
                data: null,
            });
        }
    });
    exports.server = server = app.listen(port, () => loggin_1.default.info(`Server is running on port ${port} 🔥🔧`));
};
const MONGODB_URI = process.env.MONGODB_URI || "";
if (process.env.NODE_ENV !== "test") {
    // DB connection
    mongoose_1.default
        .connect(MONGODB_URI)
        .then(() => {
        loggin_1.default.info(`Database connected 🎂`);
        //Start Server
        StartServer();
    })
        .catch((_error) => {
        loggin_1.default.error("Error while connecting to Database ===> ");
        loggin_1.default.error(_error);
        process.exit(1);
    });
}
else {
    StartServer();
}
