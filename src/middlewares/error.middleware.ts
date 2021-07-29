import { Request, Response } from "express";
import Logger from "jet-logger";
import HttpException from "../exceptions/http.exception";


export function ErrorMiddleware(err: HttpException ,req: Request, res: Response){
    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    Logger.Err(message);
    res.status(status).send({message: message});
}