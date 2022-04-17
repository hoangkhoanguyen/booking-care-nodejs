import applicationDB from '../models/index'
import allcodesService from '../services/allcodesService'

const getAllCodes = async (req, res) => {
    try {
        const data = await req.body
        let result = await allcodesService.handleGetAllcodes(data.type)
        if (result) {
            return res.status(200).json({
                errCode: 0,
                data: result
            })
        }
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Type does not exist'
        })
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server'
        })
    }
}

module.exports = {
    getAllCodes: getAllCodes
}