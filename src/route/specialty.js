import express, { Router } from "express";
import specialtyController from '../controllers/specialtyController'

let router = express.Router();

let specialtyRoutes = (app) => {

    router.post('/save-specialty-info', specialtyController.handleSaveSpecialtyInformation)
    router.get('/get-specialty-info', specialtyController.handleGetSpecialtyInformation)
    router.get('/get-doctor-list-by-specialty-id', specialtyController.handleGetDoctorListBySpecialtyId)

    return app.use("/api/specialty", router)
}

module.exports = specialtyRoutes;