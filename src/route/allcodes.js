import express, { Router } from "express";
import allcodesController from '../controllers/allcodesController'

let router = express.Router();

let allCodesRoutes = (app) => {
    router.post('/getAll', allcodesController.getAllCodes)

    return app.use("/api/allcodes", router)
}

module.exports = allCodesRoutes;