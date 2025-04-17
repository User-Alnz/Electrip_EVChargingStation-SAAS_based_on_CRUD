import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./router.js";
import { fileURLToPath } from "url";
import path from "path";
import { errorHandler } from "./errors/errors.js";


//https://medium.com/@xiaominghu19922/proper-error-handling-in-express-server-with-typescript-8cd4ffb67188 Good practice setting helper Doc
const server = express();

/* Setting CORS */

    if (!process.env.CLIENT_URL)
        throw new Error('CLIENT_URL is missing from .env file');
        
    server.use(cors({
        origin: [process.env.CLIENT_URL as string], // Define origins allowed to listen requests
        methods: 'GET,POST', // These  Define http methods allowed
        //allowedHeaders: ['Content-Type', 'Authorization'] // Allow only certain request headers
    }));

/* Setting middleware accepted format by server */

    server.use(express.json()); //json format data
    //server.use(express.urlencoded()); //url data encoded like in body POST http method
    //server.use(express.text()); //text data
    //server.use(express.raw()); //binary data

/* Serve file or app from client */

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const pathApp1 = path.join(__dirname, "../../../client/app1"); //Define which dist/app or file to serve from client
    console.info("Serving file from pathApp1 :", pathApp1);
    server.use("/app1", express.static(pathApp1, { index: "index.html" }));

/* Rooting */

    server.use(router);

/* Error handling */

    server.use(errorHandler);

export default server;