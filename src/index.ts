import Logger from "jet-logger"
import { Server } from "./config/config";
import app from "./server"
import { connectToDatabase } from "./connections/db_connection"
import { startCronJobs } from "./cron-jobs";
import { initFullNodeConnection } from "./services/full.node.service";

app.listen(Server.port, ()=>{
    Logger.Info(`Server started on ${Server.host}:${Server.port}`);
});

(async() => {
    await initFullNodeConnection()
        .then(() => {
        Logger.Info("Full Node Connection established");
        startCronJobs();
        });
})();

connectToDatabase();

