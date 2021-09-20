import Logger from "jet-logger";
import mongoose from "mongoose";
import { DB } from "../config/config"

const connectToDatabase = () =>{
    mongoose.connect(
        `mongodb://${DB.user}:${DB.pass}@${DB.host}:${DB.port}/${DB.name}?authSource=admin`,
        {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        }
    )
    .then(() => {Logger.Info("Connected to Database!");})
    .catch((err) => {Logger.Err(err.message)});
}

export { connectToDatabase };