import Logger from "jet-logger"
import { Server } from "./config/config";
import app from "./server"
import { connectToDatabase } from "./db_connection"
import { startCronJobs } from "./cron-jobs";

//connectToDatabase();

//startCronJobs();

app.listen(Server.port, ()=>{
    Logger.Info(`Server started on ${Server.host}:${Server.port}`);
})