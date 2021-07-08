import { Request, Response, NextFunction } from "express";
import Logger from "jet-logger";
import * as fullNodeService from "../services/full.node.service"

export async function getBlockchainState(req:Request, res:Response, next:NextFunction)  {
    await fullNodeService.getBlockchainState()
        .then((data) => {res.json(data)})
        .catch(err => {Logger.Err(err); next()});
}

export async function getBlock(req: Request, res:Response, next:NextFunction){
    if(!req.body.hash){
        //TODO throw 400
    }
    await fullNodeService.getBlockByHash(req.body.hash)
        .then((data) => {res.json(data)})
        .catch(err => {Logger.Err(err); next});
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
            //TODO throw 400
        }
    }catch(exception){
        //TODO next error 
    }
}

export async function getUnfinishedBlockHeaders(req: Request, res:Response, next:NextFunction) {
    if(!req.body.height){
        //TODO throw 400
    }

    await fullNodeService.getUnfinishedBlockHeaders(req.body.height)
        .then(data => {res.json(data)})
        .catch(err => {res.json(err)});
}

export async function getUnspentCoins(req: Request, res:Response, next:NextFunction) {
    if(!req.body.puzzleHash){
        //TODO throw 400
    }

    await fullNodeService.getUnspentCoins(req.body.puzzleHash)
        .then(data => {res.json(data)})
        .catch(err => {res.json(err)});
}

export async function getCoinRecord(req: Request, res:Response, next:NextFunction){
    if(!req.body.name){
        //TODO throw 400
    }
    await fullNodeService.getCoinRecordByName(req.body.name)
        .then(data => {res.json(data)})
        .catch(err => {res.json(err)});
}

export async function getAdditionsAndRemovals(req: Request, res:Response, next:NextFunction){

    if(!req.body.hash){
        //TODO throw 400
    }

    await fullNodeService.getAdditionsAndRemovals(req.body.hash)
        .then(data => {res.json(data)});
}




