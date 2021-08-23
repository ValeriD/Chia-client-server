import mongoose from "mongoose";

export interface INetspace extends mongoose.Document{
    timestamp: Date,
    current_netspace: number,
    height:number
}

const netspaceSchema = new mongoose.Schema({
    timestamp:{
        type:Date,
        required:true
    },
    current_netspace: {
        type: Number,
        required:true
    },
    height:{
        type:Number,
        required:true
    }
});

const Netspace = mongoose.model<INetspace>('Netspace', netspaceSchema);

export default Netspace;