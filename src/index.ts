import Logger from "jet-logger"
import { Server } from "./config/config";
import app from "./server"
import { connectToDatabase } from "./db_connection"


connectToDatabase();

app.listen(Server.port, ()=>{
    Logger.Info(`Server started on port: ` + Server.port)
})