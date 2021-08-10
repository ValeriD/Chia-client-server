import HttpException from "../exceptions/http.exception";
import Address, { TransactionType } from "../models/address.model";
import { ITransaction } from "../models/transaction.model";

export async function getAddresses(offset: number){
    return await Address.find({}, "-_id")
        .sort({current_balance:-1})
        .select("address current_balance")
        .skip(offset)
        .limit(25)
        .catch(err => {throw new HttpException(500, err.message)});
}

export async function getAddress(address:string){
    const res = await Address.findOne({address:address})
        .populate('transactions.transaction')
        .catch(err => {throw new HttpException(500, err.message)})
    
    if(!res){
        throw new HttpException(404, "Address not found");
    }

    return res;    
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