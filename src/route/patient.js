import express, { Router } from "express";
import patientController from '../controllers/patientController'

let router = express.Router();

let patientRoutes = (app) => {

    router.post('/booking-appointment', patientController.handleBookingAppointment)
    router.post('/verify-booking-appointment', patientController.handleVerifyBookingAppointment)
    router.get('/get-patient-list-by-doctor-id', patientController.handleGetPatientListByDoctorId)

    return app.use("/api/patient", router)
}

module.exports = patientRoutes;