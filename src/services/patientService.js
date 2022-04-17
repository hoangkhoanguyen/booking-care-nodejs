import applicationDB from '../models/index'
import emailService from '../services/emailService'
import { v4 as uuidv4 } from 'uuid'

const buildUrlEmail = (id, token) => {
    return `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${id}`
}

const bookingAppointment = async (data) => {
    try {
        const { email, doctorId, timeString, fullName, language, date, doctorName } = data

        if (!email || !doctorId || !timeString || !date || !fullName) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameters!'
            }
        }

        let token = uuidv4()

        // let [user, isCreated] = await applicationDB.User.findOrCreate({
        //     where: { email },
        //     default: {
        //         email,
        //         roleId: 'R3',
        //         gender: data.gender,
        //         firstName: fullName,
        //         address: data.address,
        //         phoneNumber: data.phoneNumber,
        //     }
        // })
        // console.log(fullName)

        let user = await applicationDB.User.findOne({
            where: { email }
        })

        if (user) {
            await applicationDB.User.update(
                {
                    roleId: 'R3',
                    gender: data.gender,
                    firstName: fullName,
                    address: data.address,
                    phoneNumber: data.phoneNumber
                }
                , {
                    where: { email }
                }
            )
        } else {
            await applicationDB.User.create({
                email,
                firstName: data.fullName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender,
                role: 'R3',
            })
        }

        let user1 = await applicationDB.User.findOne({
            where: { email }
        })

        await applicationDB.Booking.create({
            statusId: 'S1',
            doctorId,
            date: date,
            timeType: timeString,
            token,
            patientId: user1.id
        })
        await emailService.sendSimpleEmail({
            language,
            receiveEmail: email,
            patientName: fullName,
            time: timeString,
            doctorName,
            redirectLink: buildUrlEmail(doctorId, token)
        })

        return {
            errCode: 0,
            errMessage: 'Save patient info successfully!'

        }

    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

const verifyBookingLink = async (doctorId, token) => {
    try {
        let booking = await applicationDB.Booking.findOne({
            where: {
                doctorId, token,
                statusId: 'S1'
            }
        })
        if (!booking) {
            return {
                errCode: 1,
                errMessage: 'Appointment has been activated or does not exist!'
            }
        }
        await applicationDB.Booking.update({
            statusId: 'S2'
        }, {
            where: {
                doctorId, token,
                statusId: 'S1'
            }
        })
        return {
            errCode: 0,
            errMessage: "Appointment is activated successfully!"
        }

    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

const getPatientListByDoctorId = async (id, day) => {
    try {
        if (!id || !day) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameters!'
            }
        }
        let patientList = await applicationDB.Booking.findAll({
            where: { doctorId: id, date: day, statusId: 'S2' },
            include: [
                {
                    model: applicationDB.User, as: 'patientInfo',
                    attributes: ['firstName', 'address', 'gender', 'email'],
                    include: [
                        { model: applicationDB.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: true,
                    nest: true
                },
                {
                    model: applicationDB.Allcode, as: 'timeData',
                    attributes: ['valueEn', 'valueVi'],
                }
            ],
            raw: true,
            nest: true
        })
        return {
            errCode: 0,
            data: patientList
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
    bookingAppointment, verifyBookingLink,
    getPatientListByDoctorId,
}