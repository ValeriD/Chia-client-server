
import { CoinRecord } from "chia-client/dist/src/types/FullNode/CoinRecord";
import mongoose, { HookNextFunction } from "mongoose"
import { addTransactionToAddress } from "../services/address.service";
import { getCoinInfo } from "../services/full.node.service";


export interface ITransaction extends mongoose.Document {

    new_coin_info:string,
    created_at:Date,
    confirmation_block:number,
    amount:number,
    confirmations_number:number,

    input:CoinRecord,
    outputs:CoinRecord[]

    sender:string,
    receiver:string,
}

const transactionSchema = new mongoose.Schema({
    new_coin_info: { 
        type:String,
        required:true,
        unique:true
    },
    confirmation_block:{
        type: Number,
        required:true
    },
    created_at:{
        type: Date,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    confirmations_number:{
        type:Number,
        required:true
    },
    sender:{
        type:String,
        required:true
    },
    receiver: {
        type:String,
        required:true
    },
    input: {
        type:Object,
    },
    outputs: [
        {
            type:Object,
        }
    ]
});


transactionSchema.post<ITransaction>('save', async function(next:HookNextFunction){
    const self:any = this;
    if(self.input){
        const parent_info = await getCoinInfo(self.input.parent_coin_info, self.input.puzzle_hash, self.input.amount);
        await Transaction.updateOne(
            {new_coin_info:parent_info},
            {$push:
                {
                    outputs:{
                        address:self.receiver,
                        amount: self.amount
                    }
                }
            })
            await addTransactionToAddress(self,true);
    }
    await addTransactionToAddress(self,false);
    
})


const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);



export default Transaction;