import applicationDB from '../models/index'
import patientService from '../services/patientService'


const handleBookingAppointment = async (req, res) => {
    try {
        let data = req.body
        let result = await patientService.bookingAppointment(data)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server'
        })
    }
}

const handleVerifyBookingAppointment = async (req, res) => {
    try {
        const { doctorId, token } = req.body
        if (!doctorId || !token) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing parameters'
            })
        }
        let result = await patientService.verifyBookingLink(doctorId, token)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server'
        })
    }
}

const handleGetPatientListByDoctorId = async (req, res) => {
    try {
        let id = req.query.id
        let day = req.query.day
        let result = await patientService.getPatientListByDoctorId(id, day)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server'
        })
    }
}

module.exports = {
    handleBookingAppointment,
    handleVerifyBookingAppointment,
    handleGetPatientListByDoctorId
}