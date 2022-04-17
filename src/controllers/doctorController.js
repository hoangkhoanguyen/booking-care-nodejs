import { query } from 'express'
import applicationDB from '../models/index'
import doctorService from '../services/doctorService'
import Validate from '../services/Validate'

const handleGetTopDoctor = async (req, res) => {
    try {
        let limitInput = parseToInt(req.query.limit) || 6
        let result = await doctorService.getDoctorHome(limitInput)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error server!"
        })
    }
}

const parseToInt = (string) => {
    const parsed = parseInt(string);
    if (isNaN(parsed)) {
        return null
    }
    return parsed;
}

const handleGetAllDoctor = async (req, res) => {
    try {
        let data = await doctorService.getAllDoctor()
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server!'
        })
    }
}

const handleSaveDoctorDetail = async (req, res) => {
    try {
        let result = await doctorService.saveDoctorDetail(req.body)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server!'
        })
    }
}

const handleGetDetailDoctorById = async (req, res) => {
    try {
        let id = req.query.id && parseToInt(req.query.id)

        let result = await doctorService.getDetailDoctorById(id)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server!'
        })
    }
}

const handleBulkCreateSchedule = async (req, res) => {
    try {
        let data = req.body
        let result = await doctorService.saveBulkScheduleDoctor(data)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server!'
        })
    }
}

const handleGetScheduleByDate = async (req, res) => {
    try {
        let result = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server!'
        })
    }
}

const handleGetDoctorProfileById = async (req, res) => {
    try {
        let id = req.query.id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing input parameters!'
            })
        }
        let result = await doctorService.getDoctorProfileById(id)
        // console.log(result)
        return res.status(200).json(result)
        // return res.send(result)
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

const handleConfirmStatusDone = async (req, res) => {
    try {
        let data = req.body
        let result = await doctorService.confirmStatusDone(data)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

module.exports = {
    handleGetTopDoctor: handleGetTopDoctor,
    handleGetAllDoctor: handleGetAllDoctor,
    handleGetDetailDoctorById: handleGetDetailDoctorById,
    handleSaveDoctorDetail: handleSaveDoctorDetail,
    handleBulkCreateSchedule, handleGetScheduleByDate,
    handleGetDoctorProfileById, handleConfirmStatusDone
}