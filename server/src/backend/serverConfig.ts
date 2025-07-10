import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router.js";
import { fileURLToPath } from "url";
import path from "path";
import { errorHandler } from "./errors/errors.js";


//https://medium.com/@xiaominghu19922/proper-error-handling-in-express-server-with-typescript-8cd4ffb67188 Good practice setting helper Doc
const server = express();

/* Setting CORS */

    if (!process.env.CLIENT_URL)
        throw new Error('CLIENT_URL is missing from .env file');

    if (!process.env.REVERSE_PROXY_URL)
        throw new Error('REVERSE_PROXY_URL is missing from .env file');
        
    server.use(cors({
        origin: [process.env.CLIENT_URL as string, process.env.REVERSE_PROXY_URL as string], // Define origins allowed to listen requests
        methods: 'GET,POST,PUT,DELETE', // These  Define http methods allowed
        //allowedHeaders: ['Content-Type', 'Authorization'] // Allow only certain request headers
        credentials: true
    }));

/* Setting middleware accepted format by server */

    server.use(cookieParser()); // read cookie | add new instance to req like req.cookies.jwt
    server.use(express.json()); //json format data
    //server.use(express.urlencoded()); //url data encoded like in body POST http method
    //server.use(express.text()); //text data
    //server.use(express.raw()); //binary data

/* Serve file or app from client */

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const pathApp = path.join(__dirname, "../../../client/dist/"); //Define which dist/app or file to serve from client
    const pathAssets = path.join(pathApp, "assets");
    console.info("Serving file from pathApp :", pathApp);
    server.use("/Electrip/assets", express.static(pathAssets));
    server.use("/Electrip", express.static(pathApp, { index: "index.html" }));

/* Rooting */

    server.use("/Electrip",router);

/* Fallback route for React Router */
    server.get("/Electrip/*", (req, res ) =>{
        res.sendFile(path.join(pathApp, "index.html"));
    });

/* Error handling */

    server.use(errorHandler);

export default server;