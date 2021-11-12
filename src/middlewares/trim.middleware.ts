import { Request, Response, NextFunction } from "express";

export function trim(req: Request, res:Response, next:NextFunction){
    for(let p in req.query){
        req.query[p] = (req.query[p] as String).trim();
    }
    next();
}