import HttpException from "../exceptions/http.exception";
import Address, { TransactionType } from "../models/address.model";
import { ITransaction } from "../models/transaction.model";

export async function getAddresses(limit:number, offset: number){
    return await Address.find({}, "-_id")
        .sort({current_balance:-1})
        .select("address current_balance")
        .skip(offset)
        .limit(limit)
        .catch(err => {throw new HttpException(500, err.message)});
}

export async function getAddress(address:string){
    const res = await Address.findOne({address:address})
        .populate('transactions.transaction')
        .catch(err => {throw new HttpException(500, err.message)})
    
    if(!res){
        throw new HttpException(404, "Address not found");
    }

    res.transactions.sort(function(a,b){return b.transaction.created_at - a.transaction.created_at});

    return res;    
}
export async function removeTransactionFromAddress(transaction:ITransaction, isSend: boolean){
    await Address.findOneAndUpdate(
        {address: (isSend)? transaction.sender : transaction.receiver},
        {
            $inc:{
                total_sent: (isSend)? -1*transaction.amount : 0,
                total_received: (!isSend)? -1*transaction.amount : 0,
                current_balance: (isSend)? transaction.amount : -1*transaction.amount,
                number_of_transactions: -1
            },
            $pull:{
                transactions:{
                    transaction: transaction._id,
                    transaction_type:(isSend)? TransactionType.send: TransactionType.receive
                }
            }
        }
    )
}
export async function addTransactionToAddress(transaction: ITransaction, isSend:boolean){
    await Address.findOneAndUpdate(
        {address:(isSend)?transaction.sender: transaction.receiver},
        {$inc:{
                total_sent: (isSend)?transaction.amount:0,
                total_received: (!isSend)?transaction.amount:0,
                current_balance: (isSend)? -1*transaction.amount: transaction.amount,
                number_of_transactions: 1
            },
            $push:{
                transactions:{
                    transaction:transaction._id,
                    transaction_type:(isSend)? TransactionType.send: TransactionType.receive
                }
            }
        
        })
        .catch(err => {throw new HttpException(500, err.message)});
}

export async function addAddress(address:string){
    if(!await Address.exists({address:address})){
        const new_address ={
            address:address,
            current_balance:0,
            total_sent:0,
            total_received:0,
            number_of_transactions:0,
        }
        await new Address(new_address).save()
            .catch(err => {throw new HttpException(500, err.message)});
    }
}

export async function getUniqueAddressCount(){
    return await Address.countDocuments()
        .catch(err => {throw new HttpException(500, err.message)});
}

export async function getCirculatingSupply(){
    return await Address.aggregate([{$group:{_id:null, circulating_supply:{$sum:"$current_balance"}}}])
        .catch(err => {throw new HttpException(500, err.message)});
}