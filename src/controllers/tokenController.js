import applicationDB from '../models/index'
import tokenService from '../services/tokenService'


const handleGetNewTokenByRefreshToken = async (req, res) => {
    try {
        let data = req.body
        let result = await tokenService.getNewTokenByRefreshToken(data)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server'
        })
    }
}

module.exports = {
    handleGetNewTokenByRefreshToken,
}