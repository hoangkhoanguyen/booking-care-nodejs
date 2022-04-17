import aplicationDB from '../models/index'

const saveClinicInfo = async (data) => {
    try {
        let { name, image, descriptionHTML, descriptionMarkdown, address } = data
        if (!name || !image || !address) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameters!'
            }
        }

        let clinic = await aplicationDB.Clinic.findOne({ where: { name } })
        if (!clinic) {
            await aplicationDB.Clinic.create(data)
        } else {
            await aplicationDB.Clinic.update(data, { where: { name } })
        }

        return {
            errCode: 0,
            errMessage: 'Save Clinic Information successfully!'
        }

    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

const getClinicInfo = async (id) => {
    try {
        if (id) {
            let clinic = await aplicationDB.Clinic.findOne({
                where: { id }
            })
            if (!clinic) {
                return {
                    errCode: 2,
                    errMessage: 'Clinic does not exist any more!'
                }
            }
            return {
                errCode: 0,
                data: clinic
            }
        }
        let clinics = await aplicationDB.Clinic.findAll({
            attributes: {
                exclude: ['descriptionHTML', 'descriptionMarkdown', 'address']
            },
        })
        return {
            errCode: 0,
            data: clinics
        }
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

const getDoctorListByClinicId = async (id) => {
    try {
        if (!id) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        }
        let doctorList = await aplicationDB.Markdown.findAll({
            where: { specialtyId: id },
        })
        doctorList = doctorList.map(item => item.doctorId)

        return {
            errCode: 0,
            data: doctorList
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
    saveClinicInfo, getClinicInfo,
    getDoctorListByClinicId
}