import HttpException from "../exceptions/http.exception";
import Transaction from "../models/transaction.model"

export async function getAllTransactions(){
}
export async function getTransactions(limit: number, offset: number){
    return await Transaction.find({},'-_id')
        .sort({confirmation_block:-1})
        .skip(offset)
        .limit(limit)
        .select('created_at sender receiver amount')
        .catch(err => {throw new HttpException(500, err)});
}

export async function getTransaction(coinInfo: string){
    const transaction = await Transaction.findOne({new_coin_info: coinInfo}, '-_id -__v')
        .catch(err => {throw new HttpException(500, err.message)});
    if(!transaction){
        throw new HttpException(404, "Transaction does not exist!");
    }

    return transaction;
}

export async function getTransactionsPerDay(){
    return await Transaction.aggregate([
        {
            $group:{
                _id:{
                     $dateToString: { format: "%Y-%m-%d", date: "$created_at" } ,
                },
                transactions_count:{ $sum:1 }

            }
        },
        {
            $sort:{
                _id:1
            }
        }
    ])
    .catch(err => {throw new HttpException(500, err.message)});
}