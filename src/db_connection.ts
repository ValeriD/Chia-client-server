import Logger from "jet-logger";
import mongoose from "mongoose";
import { DB } from "./config/config"

const connectToDatabase = () =>{
    mongoose.connect(
        'mongodb://'+ DB.host+"/"+DB.name,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        },
        () => {
            Logger.Info("Connected to database");
        }
    )
    const db = mongoose.connection;

    db.on("error", () =>  Logger.Err("Error connecting the databse"));
}

export { connectToDatabase };