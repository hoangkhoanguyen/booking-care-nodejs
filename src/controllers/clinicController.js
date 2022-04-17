import aplicationDB from '../models/index'
import clinicService from '../services/clinicService'


const handleSaveClinicInfo = async (req, res) => {
    try {
        let data = req.body
        let result = await clinicService.saveClinicInfo(data)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server'
        })
    }
}

const handleGetClinicInformation = async (req, res) => {
    try {
        let id = req.query.id
        let result = await clinicService.getClinicInfo(id)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server'
        })
    }
}

const handleGetDoctorListByClinicId = async (req, res) => {
    try {
        let id = req.query.id
        let result = await clinicService.getDoctorListByClinicId(id)
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
    handleSaveClinicInfo,
    handleGetClinicInformation,
    handleGetDoctorListByClinicId,
}