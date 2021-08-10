import mongoose from "mongoose";

export interface IAddress extends mongoose.Document {
    address:string,
    current_balance: number,
    total_sent:number,
    total_received:number,
    number_of_transactions: number,
    transactions: any[]
}
export enum TransactionType{
    send="send",
    receive="receive"
}

const addressSchema = new mongoose.Schema({
    address:{
        type:String,
        required:true,
        unique:true
    },
    current_balance:{
        type:Number,
        required:true
    },
    total_sent:{
        type:Number,
        required:true,
    },
    total_received:{
        type:Number,
        required:true
    },
    number_of_transactions:{
        type:Number,
        required:true
    },
    transactions:[{
        transaction:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Transaction'
        },
        transaction_type:{
            type:TransactionType,
            required:true
        }
    }]
});

const Address = mongoose.model<IAddress>('Address', addressSchema);

export default Address;