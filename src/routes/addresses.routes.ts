import { Router } from "express";
import { getAddress, getAddresses } from "../controllers/address.controller";


const addressRouter = Router();


addressRouter.get('/get_addresses', getAddresses);

addressRouter.get('/get_address', getAddress);

export default addressRouter;