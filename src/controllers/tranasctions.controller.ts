import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/http.exception";
import * as transactionService from "../services/transactions.service"

export async function getTransactions(req: Request, res: Response, next: NextFunction){
    await transactionService.getAllTransactions()
        .then(data => res.json(data))
        .catch(err => next(err));
}

export async function getTransaction(req: Request, res:Response, next:NextFunction){
    const coinInfo = req.query.coin_info?.toString() || "";
    if(!coinInfo || coinInfo === ""){
        next(new HttpException(400, "Coin info not profided"));
    }
    const creationHeight = +(req.query.creation_height?.toString() || "");
    
    await transactionService.getTransaction(coinInfo, creationHeight)
        .then(data => res.json(data))
        .catch(err => next(err));

}