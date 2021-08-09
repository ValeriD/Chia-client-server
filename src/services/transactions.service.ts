import HttpException from "../exceptions/http.exception";
import Transaction from "../models/transaction.model"

export async function getAllTransactions(){
}
export async function getTransactions(limit: number, offset: number){
    return await Transaction.find({}, {sort:'-confirmation_block'})
        .skip(offset)
        .limit(limit)
        .select('created_at sender receiver amount')
        .catch(err => {throw new HttpException(500, err)});
}

export async function getTransaction(coinInfo: string, creation_height:number){
    const transaction = await Transaction.findOne({coin_info: coinInfo, creation_height: creation_height}, '-_id -__v')
        .catch(err => {throw new HttpException(500, err.message)});
    if(!transaction){
        throw new HttpException(404, "Transaction does not exist!");
    }

    return transaction;
}