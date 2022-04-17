import express, { Router } from "express";
import doctorController from '../controllers/doctorController'

let router = express.Router();

let doctorRoutes = (app) => {
    router.post('/get-top-doctor-home', doctorController.handleGetTopDoctor)
    router.get('/getAll', doctorController.handleGetAllDoctor)
    router.get('/get-detail-doctor-by-id', doctorController.handleGetDetailDoctorById)
    router.post('/save-doctor-detail', doctorController.handleSaveDoctorDetail)
    router.post('/bulk-create-schedule', doctorController.handleBulkCreateSchedule)
    router.get('/get-doctor-schedule-by-date', doctorController.handleGetScheduleByDate)
    router.get('/get-doctor-profile-by-id', doctorController.handleGetDoctorProfileById)
    router.post('/confirm-status-done', doctorController.handleConfirmStatusDone)

    return app.use("/api/doctor", router)
}

module.exports = doctorRoutes;