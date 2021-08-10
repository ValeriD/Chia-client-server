import { Request, Response, NextFunction } from "express";
import Logger from "jet-logger";
import HttpException from "../exceptions/http.exception";
import * as fullNodeService from "../services/full.node.service"

export async function getBlockchainState(req:Request, res:Response, next:NextFunction)  {
    await fullNodeService.getBlockchainState()
        .then((data) => {res.json(data)})
        .catch(err => {Logger.Err(err); next()});
}

export async function getBlock(req: Request, res:Response, next:NextFunction){
    if(!req.query.hash){
        next(new HttpException(400, "No hash provided"));
    }
    const hash:string = req.query.hash?.toString() || "";
    await fullNodeService.getBlockByHash(hash)
        .then((data) => {res.json(data)})
        .catch(err => {
            next(err)
        });
}

export async function getBlocks(req: Request, res:Response, next:NextFunction){
    if(!req.query.startHeight || !req.query.endHeight){
        next(new HttpException(400, "Start height or end height not provided"));
    }
    const startHeight:number = parseInt(req.query.startHeight?.toString() || "");
    
    const endHeight:number = parseInt(req.query.endHeight?.toString() || "");

    await fullNodeService.getBlocks(startHeight, endHeight)
        .then(data => {res.json(data)})
        .catch(err => {
            next(err)
        });
}

export async function getBlockRecord(req: Request, res:Response, next:NextFunction){
    try{
        if(req.query.hash){
            const hash:string = req.query.hash?.toString() || "";
            await fullNodeService.getBlockRecordByHash(hash)
                .then(data => {res.json(data)});

        }else if(req.query.height){

            const height:number = parseInt(req.query.height?.toString() || "");

            await fullNodeService.getBlockRecordByHeight(height)
                .then((data) => {res.json(data)});
        }else{
            throw new HttpException(400, "Neither hash, nor height provided");
        }
    }catch(exception){
        next(exception);
    }
}

export async function getUnfinishedBlockHeaders(req: Request, res:Response, next:NextFunction) {
    if(!req.query.height){
        next(new HttpException(400, "No height provided"));
    }

    const height:number = parseInt(req.query.height?.toString() || "");
    await fullNodeService.getUnfinishedBlockHeaders(height)
        .then(data => {res.json(data)})
        .catch(err => {
            next(err)
        });
}

export async function getUnspentCoins(req: Request, res:Response, next:NextFunction) {
    if(!req.query.puzzle_hash){
        next(new HttpException(400, "No puzzle hash provided"));
    }

    const puzzleHash:string = req.query.puzzle_hash?.toString() || "";
    await fullNodeService.getUnspentCoins(puzzleHash)
        .then(data => {res.json(data)})
        .catch(err => {
            next(err)
        });
}

export async function getCoinRecord(req: Request, res:Response, next:NextFunction){
    if(!req.query.coin_info){
        next(new HttpException(400, "No name provided"));
    }

    const coinInfo: string = req.query.coin_info?.toString() || "";

    await fullNodeService.getCoinRecord(coinInfo)
        .then(data => {res.json(data)})
        .catch(err => {
            next(err)
        });
}

export async function getAdditionsAndRemovals(req: Request, res:Response, next:NextFunction){

    if(!req.query.hash){
        next(new HttpException(400, "No hash provided"));
    }

    const hash: string = req.query.hash?.toString() || "";
    await fullNodeService.getAdditionsAndRemovals(hash)
        .then(data => {res.json(data)})
        .catch(err => {
            next(err)
        });
}

export async function puzzleHashToAddress(req: Request, res:Response, next:NextFunction){
    
    if(!req.query.puzzle_hash){
        next(new HttpException(400, "No hash provided"));
    }

    const puzzleHash = req.query.puzzle_hash?.toString() || "";

    await fullNodeService.convertPuzzleHashToAddress(puzzleHash)
        .then(data => {res.send({"address":data})})
        .catch(err => {next(new HttpException(500, err))});
}

export async function addressToPuzzleHash(req: Request, res:Response, next:NextFunction){
    if(!req.query.address){
        next(new HttpException(400, "No address provided"));
    }
    const address:string = req.query.address?.toString() || "";

    await fullNodeService.convertAddressToPuzzleHash(address)
        .then(data => {res.status(200).send({"puzzleHash":data})})
        .catch(err => { 
            next(err)
        });
}

export async function getCoinInfo(req: Request, res:Response, next:NextFunction){
    if(!req.query.parent_coin_info || !req.query.puzzle_hash || !req.query.amount){
        next(new HttpException(400, "Not provided parent coin info, puzzle hash or amount!"));
    }

    const parentCoinInfo:string = req.query.parent_coin_info?.toString() || "";
    const puzzleHash: string = req.query.puzzle_hash?.toString() || "";
    const amount: number = parseInt(req.query.amount?.toString() || "");

    await fullNodeService.getCoinInfo(parentCoinInfo, puzzleHash, amount)
        .then(data => {res.send({"coin_info":data})})
        .catch(err => {
            next(err)
        });
}
