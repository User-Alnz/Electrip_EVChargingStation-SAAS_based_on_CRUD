import "dotenv/config";
import server from "./serverConfig.js";

const initServer = async () => {
    try{

        server.listen(process.env.SERVER_PORT, () => {
            console.info("Server is running on PORT " + process.env.SERVER_PORT);
        });
    }
    catch (err) {
        console.error("Error when deploying server", err);
        process.exit(1); // Stop process 
    }
}

initServer();