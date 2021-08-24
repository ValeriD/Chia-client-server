import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/http.exception";
import * as transactionService from "../services/transactions.service"

export async function getTransactions(req: Request, res: Response, next: NextFunction){
    if(!req.query.limit || !req.query.offset){
        next(new HttpException(400, "Offset or limit not provided!"));
    }
    const limit = +(req.query.limit?.toString() || "");
    const offset = +(req.query.offset?.toString() || "");

    await transactionService.getTransactions(limit, offset)
        .then(data => res.json(data))
        .catch(err => {next(err);});
}

export async function getTransaction(req: Request, res:Response, next:NextFunction){
    const coinInfo = req.query.coin_info?.toString() || "";
    if(!coinInfo || coinInfo === ""){
        next(new HttpException(400, "Coin info not provided"));
    }
    
    await transactionService.getTransaction(coinInfo)
        .then(data => res.json(data))
        .catch(err => next(err));

}

export async function getTransactionsPerDay(req: Request, res: Response, next: NextFunction){
    await transactionService.getTransactionsPerDay()
        .then(data => res.json(data))
        .catch(err => next(err));
}