import app from "./app.js";
import dotenv from "dotenv";
import {connectMongoDatabase} from "./config/db.js";

dotenv.config({
    path: "backend/config/config.env"
})
connectMongoDatabase();

const port = process.env.PORT || 3000;


// Listen to server
app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}/`)
})