import { Request, Response ,NextFunction } from "express";
import * as addressService from "../services/address.service"

export async function getAddresses(req: Request, res: Response, next: NextFunction){
    const offset = +(req.query?.offset || "");

    await addressService.getAddresses(offset)
        .then(data => res.json(data))
        .catch(err => next(err));
}

export async function getAddress(req: Request, res: Response, next: NextFunction){
    const address = req.query?.address?.toString() || "";

    await addressService.getAddress(address)
        .then(data => res.json(data))
        .catch(err => next(err));
}