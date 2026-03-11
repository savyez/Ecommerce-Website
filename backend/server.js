import app from "./app.js";
import dotenv from "dotenv";
import {connectMongoDatabase} from "./config/db.js";

dotenv.config({
    path: "backend/config/config.env"
})
connectMongoDatabase();

// handle uncaught exception errors
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down due to unhandled errors`);
    process.exit(1);
})


const port = process.env.PORT || 3000;


// Listen to server
const server = app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}/`)
})


// handle unhandled rejection error
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down, due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1)
    });
})