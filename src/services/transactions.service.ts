import HttpException from "../exceptions/http.exception";
import Transaction from "../models/transaction.model"

export async function getAllTransactions(){
    const transactions = await Transaction.find({}, '-_id   -__v', {sort:'-creation_height'})
        .catch(err => {throw new HttpException(500, err.messafe)});
    return transactions;
}

export async function getTransaction(coinInfo: string){
    const transaction = await Transaction.findOne({coin_info: coinInfo}, '-_id -__v')
        .catch(err => {throw new HttpException(500, err.message)});
    if(!transaction){
        throw new HttpException(404, "Transaction does not exist!");
    }

    return transaction;
}