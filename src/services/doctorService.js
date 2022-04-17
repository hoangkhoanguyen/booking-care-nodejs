import aplicationDB from '../models/index'
import _ from 'lodash'
import emailService from '../services/emailService'

const getDoctorHome = async (limitInput) => {
    try {
        let users = await aplicationDB.User.findAll({
            limit: limitInput,
            where: { role: 'R2' },
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['password']
            },
            include: [
                { model: aplicationDB.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                { model: aplicationDB.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] }
            ],
            raw: true,
            nest: true
        })
        return {
            errCode: 0,
            data: users
        }
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            message: 'Error Server'
        }
    }
}

const getAllDoctor = async () => {
    try {
        let doctors = await aplicationDB.User.findAll({
            where: { role: 'R2' },
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['password']
            },
            include: [
                { model: aplicationDB.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                { model: aplicationDB.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] }
            ],
            raw: true,
            nest: true
        })
        return {
            errCode: 0,
            data: doctors
        }
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            message: 'Error Server'
        }
    }
}

const saveDoctorDetail = async (info) => {
    try {
        let user = await aplicationDB.Markdown.findOne({
            where: { doctorId: info.doctorId }
        })
        if (user) {
            await aplicationDB.Markdown.update({
                contentHTML: info.contentHTML,
                contentMarkdown: info.contentMarkdown,
                description: info.description,
                specialtyId: info.specialtyId,
                clinicId: info.clinicId,
            }, { where: { doctorId: info.doctorId } })
        } else {
            await aplicationDB.Markdown.create({
                contentHTML: info.contentHTML,
                contentMarkdown: info.contentMarkdown,
                description: info.description,
                doctorId: info.doctorId,
                specialtyId: info.specialtyId,
                clinicId: info.clinicId,
            })
        }
        let doctor = await aplicationDB.Doctor_Info.findOne({
            where: { doctorId: info.doctorId }
        })
        if (doctor) {
            await aplicationDB.Doctor_Info.update({
                priceId: info.priceId,
                provinceId: info.provinceId,
                paymentId: info.paymentId,
                addressClinic: info.addressClinic,
                nameClinic: info.nameClinic,
                note: info.note,
            }, { where: { doctorId: info.doctorId } })
        } else {
            await aplicationDB.Doctor_Info.create({
                priceId: info.priceId,
                provinceId: info.provinceId,
                paymentId: info.paymentId,
                addressClinic: info.addressClinic,
                nameClinic: info.nameClinic,
                note: info.note,
                doctorId: info.doctorId
            })
        }
        return {
            errCode: 0,
            data: `Save doctor's details successfully!`
        }
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

const getDetailDoctorById = async (id) => {
    try {
        if (!id) {
            return {
                errCode: 1,
                errMessage: 'Missing parameters'
            }
        }
        let data = await aplicationDB.User.findOne({
            where: {
                id: id
            },
            attributes: {
                exclude: ['password']
            },
            include: [
                { model: aplicationDB.Markdown, as: 'details', attributes: ['contentHTML', 'contentMarkdown', 'description', 'specialtyId', 'clinicId'] },
                { model: aplicationDB.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
            ],
            raw: true,
            nest: true
        })
        if (!data) {
            return {
                errCode: 1,
                errMessage: 'User does not exist!'
            }
        }
        let doctorInfo = await aplicationDB.Doctor_Info.findOne({
            where: { doctorId: id },
            attributes: {
                exclude: ['doctorId']
            },
            include: [
                { model: aplicationDB.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                { model: aplicationDB.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                { model: aplicationDB.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
            ],
            raw: true,
            nest: true
        })

        return {
            errCode: 0,
            data: {
                ...data,
                ...doctorInfo
            }
        }
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

const saveBulkScheduleDoctor = async (data) => {
    try {
        if (!data) {
            return {
                errCode: 3,
                errMessage: 'Missing parameters!'
            }
        }
        let oldSchedule = await aplicationDB.Schedule.findAll({
            where: {
                doctorId: data[0].doctorId,
                date: '' + data[0].date
            }
        })
        let differenceAdd = _.differenceWith(data, oldSchedule, (a, b) => {
            return a.timeType === b.timeType && +a.date === +b.date
        })
        if (differenceAdd && differenceAdd.length > 0) {
            await aplicationDB.Schedule.bulkCreate(differenceAdd.map(item => {
                return {
                    ...item,
                    date: '' + item.date,
                    currentNumber: 1,
                    maxNumber: process.env.MAX_NUMBER_SCHEDULE
                }
            }))
        }
        return {
            errCode: 0,
            message: 'OK!'
        }
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

const getScheduleByDate = async (doctorId, date) => {
    try {
        if (!doctorId || !date) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameters!'
            }
        }
        let schedule = await aplicationDB.Schedule.findAll({
            where: {
                doctorId,
                date
            },
            include: [
                { model: aplicationDB.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                { model: aplicationDB.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
            ],
            raw: false,
            nest: true
        })
        schedule = schedule || []
        return {
            errCode: 0,
            data: schedule
        }
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

const getDoctorProfileById = async (id) => {
    try {
        // console.log(id)
        let doctor = await aplicationDB.User.findOne({
            where: { id },
            attributes: {
                exclude: ['password']
            },
            include: [
                { model: aplicationDB.Markdown, as: 'details', attributes: ['description'] },
                { model: aplicationDB.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
            ],
            raw: true,
            nest: true
        })
        // console.log(doctor)
        let doctorInfo = await aplicationDB.Doctor_Info.findOne({
            where: { doctorId: id },
            attributes: {
                exclude: ['doctorId']
            },
            include: [
                { model: aplicationDB.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
            ],
            raw: true,
            nest: true
        })

        // console.log(doctorInfo)
        let result = {
            ...doctor, ...doctorInfo
        }
        // console.log(result)
        return {
            errCode: 0,
            data: result
        }
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

const confirmStatusDone = async (data) => {
    try {
        if (!data.id || !data.email || !data.language || !data.patientName || !data.imgBase64) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameters!'
            }
        }
        let patient = await aplicationDB.Booking.findOne({
            where: { id: data.id },
            // raw : false
        })
        if (!patient) return {
            errCode: 0,
            errMessage: 'This booking does not exist longer!'
        }
        await aplicationDB.Booking.update({ statusId: 'S3' }, { where: { id: data.id } })
        await emailService.sendAttachment(data)
        return {
            errCode: 0,
            errMessage: 'Successfully!'
        }
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

module.exports = {
    getDoctorHome,
    getAllDoctor,
    saveDoctorDetail,
    getDetailDoctorById,
    saveBulkScheduleDoctor, getScheduleByDate,
    getDoctorProfileById, confirmStatusDone
}