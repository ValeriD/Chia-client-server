import { Request, Response ,NextFunction } from "express";
import HttpException from "../exceptions/http.exception";
import * as addressService from "../services/address.service"

export async function getAddresses(req: Request, res: Response, next: NextFunction){
    if(!req.query.offset){
        next(new HttpException(400, "Offset not provided!"))
    }

    const offset = +(req.query?.offset || "");
    const limit = +(req.query.limit?.toString() || "") || 25;

    await addressService.getAddresses(limit, offset)
        .then(data => res.json(data))
        .catch(err => next(err));
}

export async function getAddress(req: Request, res: Response, next: NextFunction){
    if(!req.query.address){
        next(new HttpException(400, "Address not provided!"));
    }
    const address = req.query?.address?.toString() || "";

    await addressService.getAddress(address)
        .then(data => res.json(data))
        .catch(err => next(err));
}