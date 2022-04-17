import applicationDB from '../models/index'
import specialtyService from '../services/specialtyService'


const handleSaveSpecialtyInformation = async (req, res) => {
    try {
        let data = req.body
        let result = await specialtyService.saveSpecialtyInfo(data)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server'
        })
    }
}

const handleGetSpecialtyInformation = async (req, res) => {
    try {
        let id = req.query.id
        let result = await specialtyService.getSpecialtyInfo(id)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server'
        })
    }
}

const handleGetDoctorListBySpecialtyId = async (req, res) => {
    try {
        let id = req.query.id
        let provinceId = req.query.provinceId
        let result = await specialtyService.getDoctorListBySpecialtyId(id, provinceId)
        return res.status(200).json(result)

    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server'
        })
    }
}

module.exports = {
    handleSaveSpecialtyInformation,
    handleGetSpecialtyInformation,
    handleGetDoctorListBySpecialtyId
}