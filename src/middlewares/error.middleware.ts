import { Request, Response } from "express";
import HttpException from "../exceptions/http.exception";


export function ErrorMiddleware(err: HttpException ,req: Request, res: Response){
    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    res.status(status).send({message: message});
}