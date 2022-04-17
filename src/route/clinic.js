import express, { Router } from "express";
import clinicController from '../controllers/clinicController'

let router = express.Router();

let clinicRoutes = (app) => {

    router.post('/save-clinic-info', clinicController.handleSaveClinicInfo)
    router.get('/get-clinic-info', clinicController.handleGetClinicInformation)
    router.get('/get-doctor-list-by-clinic-id', clinicController.handleGetDoctorListByClinicId)

    return app.use("/api/clinic", router)
}

module.exports = clinicRoutes;