import applicationDB from '../models/index'

const handleGetAllcodes = async (type) => {
    try {
        let data
        if (!type) {
            data = await applicationDB.Allcode.findAll()
        } else {
            data = await applicationDB.Allcode.findAll({
                where: { type: type }
            })
        }
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = {
    handleGetAllcodes: handleGetAllcodes,
}