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
    if(!req.body.hash){
        next(new HttpException(400, "No hash provided"));
    }
    await fullNodeService.getBlockByHash(req.body.hash)
        .then((data) => {res.json(data)})
        .catch(err => {
            Logger.Err(err.message); 
            next(new HttpException(500, err.message))
        });
}

export async function getBlocks(req: Request, res:Response, next:NextFunction){
    if(!req.body.startHeight || !req.body.endHeight){
        next(new HttpException(400, "Start height or end height not provided"));
    }

    await fullNodeService.getBlocks(req.body.startHeight, req.body.endHeight)
        .then(data => {res.json(data)})
        .catch(err => {
            Logger.Err(err.message); 
            next(new HttpException(500, err.message))
        });
}

export async function getBlockRecord(req: Request, res:Response, next:NextFunction){
    try{
        if(req.body.hash){
            await fullNodeService.getBlockRecordByHash(req.body.hash)
                .then(data => {res.json(data)});
        }else if(req.body.height){
            await fullNodeService.getBlockRecordByHeight(req.body.height)
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
    if(!req.body.height){
        next(new HttpException(400, "No height provided"));
    }

    await fullNodeService.getUnfinishedBlockHeaders(req.body.height)
        .then(data => {res.json(data)})
        .catch(err => {
            Logger.Err(err); 
            next(new HttpException(500, err.message))
        });
}

export async function getUnspentCoins(req: Request, res:Response, next:NextFunction) {
    if(!req.body.puzzleHash){
        next(new HttpException(400, "No puzzle hash provided"));
    }

    await fullNodeService.getUnspentCoins(req.body.puzzleHash)
        .then(data => {res.json(data)})
        .catch(err => {
            Logger.Err(err); 
            next(new HttpException(500, err.message))
        });
}

export async function getCoinRecord(req: Request, res:Response, next:NextFunction){
    if(!req.body.name){
        next(new HttpException(400, "No name provided"));
    }
    await fullNodeService.getCoinRecordByName(req.body.name)
        .then(data => {res.json(data)})
        .catch(err => {
            Logger.Err(err); 
            next(new HttpException(500, err.message))
        });
}

export async function getAdditionsAndRemovals(req: Request, res:Response, next:NextFunction){

    if(!req.body.hash){
        next(new HttpException(400, "No hash provided"));
    }

    await fullNodeService.getAdditionsAndRemovals(req.body.hash)
        .then(data => {res.json(data)})
        .catch(err => {
            Logger.Err(err); 
            next(new HttpException(500, err.message))
        });
}




