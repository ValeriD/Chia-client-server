import { Request, Response, NextFunction } from "express";
import  { getNetspaceRecords }  from "../services/netspace.service"

export async function netspaceRecords(req: Request, res:Response, next:NextFunction){
    await getNetspaceRecords()
        .then(data => {res.json(data)})
        .catch(err => next(err));
}