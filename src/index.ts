import Logger from "jet-logger"
import { Server } from "./config/config";
import app from "./server"
import { connectToDatabase } from "./db_connection"
import { startCronJobs } from "./cron-jobs";
import { FullNodeConnection } from "./connections/full-node.connection";
import { initFullNodeConnection } from "./services/full.node.service";

(async() => {
    await initFullNodeConnection()
        .then(() => {
        console.log("Full Node Connection established");
        startCronJobs();
});
    }
)();

connectToDatabase();

app.listen(Server.port, ()=>{
    Logger.Info(`Server started on ${Server.host}:${Server.port}`);
})