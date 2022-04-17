import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import aplicationDB from '../models/index'

const createJWT = (email) => {

    let payload = {
        email
    }

    let key = process.env.JWT_SECRET_KEY
    let token
    try {
        token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRATION })
        // token = jwt.sign(payload, key)
    } catch (error) {
        console.log(error)
        return null
    }
    return token
}

const isExpiredRefreshToken = (expireDate) => {
    let date = new Date()
    return expireDate > date.getTime()
}

const getNewTokenByRefreshToken = async (data) => {
    try {
        let { refreshToken, userId } = data
        let refreshInfo = await aplicationDB.RefreshToken.findOne({
            where: {
                userId,
                token: refreshToken
            }
        })

        if (!refreshInfo) {
            return {
                errCode: 1,
                errMessage: 'Refresh Token is invalid!'
            }
        }
        let isValid = isExpiredRefreshToken(refreshInfo.expiryDate)
        console.log(isValid)
        if (!isValid) {
            await aplicationDB.RefreshToken.destroy({
                where: { userId, token: refreshToken }
            })
            return {
                errCode: 2,
                errMessage: 'Refresh token was expired. Please make a new signin request!'
            }
        }
        let user = await aplicationDB.User.findOne({
            where: { id: userId }
        })

        if (!user) {
            return {
                errCode: 3,
                errMessage: "User does not exist anymore!"
            }
        }
        let newToken = createJWT(user.email)
        return {
            errCode: 0,
            newToken
        }
    } catch (error) {
        console.log(error)
    }
}

const createNewRefreshToken = async (id) => {
    try {
        let refreshToken = uuidv4()
        let expiredAt = new Date()
        expiredAt = expiredAt.setSeconds(expiredAt.getSeconds() +
            typeof process.env.JWT_REFRESH_EXPIRATION == 'number' ? process.env.JWT_REFRESH_EXPIRATION : parseInt(process.env.JWT_REFRESH_EXPIRATION))
        let refreshTokenInfo = await aplicationDB.RefreshToken.findOne({
            where: { userId: id }
        })
        if (refreshTokenInfo) {
            await aplicationDB.RefreshToken.update({
                token: refreshToken,
                expiryDate: expiredAt
            }, { where: { userId: id } })
        } else {
            await aplicationDB.RefreshToken.create({
                token: refreshToken,
                expiryDate: expiredAt,
                userId: id
            })
        }
        let newinfo = await aplicationDB.RefreshToken.findOne({
            where: { token: refreshToken }
        })
        console.log(newinfo.expiryDate)
        return refreshToken
    } catch (error) {
        console.log(error)
        return null
    }
}

export default {
    createJWT,
    createNewRefreshToken,
    getNewTokenByRefreshToken
}