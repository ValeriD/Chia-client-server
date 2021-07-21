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
            Logger.Err(err.message); 
            next(new HttpException(500, err.message))
        });
}

export async function getBlocks(req: Request, res:Response, next:NextFunction){
    if(!req.query.startHeight || !req.query.endHeight){
        next(new HttpException(400, "Start height or end height not provided"));
    }
    const startHeight:number = parseInt(req.query.startHeight?.toString() || "");
    const endHeight:number = parseInt(req.query.startHeight?.toString() || "");
    await fullNodeService.getBlocks(startHeight, endHeight)
        .then(data => {res.json(data)})
        .catch(err => {
            Logger.Err(err.message); 
            next(new HttpException(500, err.message))
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
        Logger.Err(exception.message);
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
            Logger.Err(err); 
            next(new HttpException(500, err.message))
        });
}

export async function getUnspentCoins(req: Request, res:Response, next:NextFunction) {
    if(!req.query.puzzleHash){
        next(new HttpException(400, "No puzzle hash provided"));
    }

    const puzzleHash:string = req.query.puzzleHash?.toString() || "";
    await fullNodeService.getUnspentCoins(puzzleHash)
        .then(data => {res.json(data)})
        .catch(err => {
            Logger.Err(err); 
            next(new HttpException(500, err.message))
        });
}

export async function getCoinRecord(req: Request, res:Response, next:NextFunction){
    if(!req.query.name){
        next(new HttpException(400, "No name provided"));
    }

    const name: string = req.query.name?.toString() || "";

    await fullNodeService.getCoinRecordByName(name)
        .then(data => {res.json(data)})
        .catch(err => {
            Logger.Err(err); 
            next(new HttpException(500, err.message))
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
            Logger.Err(err); 
            next(new HttpException(500, err.message))
        });
}

