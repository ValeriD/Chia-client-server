
import mongoose from "mongoose"

export interface ITransaction extends mongoose.Document {
    coin_info:string;
    amount:number,
    creation_height:number, 
    owner_puzzle_hash:string,
    owner_address:string,
    creation_time:Date,
    parent_coin:string,
    source:string
}

const transactionSchema = new mongoose.Schema({
    coin_info:{         
        type:String,
        required:true
    },
    amount:{            
        type:Number,
        required:true
    },
    creation_height:{   
        type:Number,
        required: true
    },
    owner_puzzle_hash:{  
        type:String,
        required:true
    },
    owner_address:{     
        type:String,
        required:true
    },
    parent_coin:{        
        type:String,
        required:true
    },
    source:{           
        type:String,
        required:true
    },
    creation_time:{    
        type:Date,
        required:true
    }
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;