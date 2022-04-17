import { hash } from 'bcryptjs'
import bcrypt from 'bcryptjs/dist/bcrypt'
import applicationDB from '../models/index'
import tokenService from '../services/tokenService'

const salt = bcrypt.genSaltSync(10)

let createNewUser = async (data) => {
    try {
        let hash = await bcrypt.hashSync(data.password, salt)
        await applicationDB.User.create({
            email: data.email,
            password: hash,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            role: data.role,
            position: data.position,
            image: data.image
        })
        return {
            errCode: 0,
            message: 'ok create a new user succeed'
        }
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: 'Something wrong!'
        }
    }
}

const handleUserLogin = async (email, password) => {
    try {
        let isExist = await checkUserEmail(email)
        if (isExist) {
            let user = await applicationDB.User.findOne({
                where: { email: email },
                raw: true,
            })
            let isValid = await bcrypt.compareSync(password, user.password)
            if (isValid) {
                let token = tokenService.createJWT(email)
                let refreshToken = await tokenService.createNewRefreshToken(user.id)
                if (!token || !refreshToken) {
                    return {
                        errCode: -1,
                        errMessage: 'Error server!'
                    }
                }
                delete user.password
                return {
                    errCode: 0,
                    data: {
                        ...user,
                        accessToken: token,
                        refreshToken
                    },
                }
            }
            return {
                errCode: 3,
                errMessage: 'Wrong password!'
            }
        }
        return {
            errCode: 1,
            errMessage: `Your email doesn't exist!`
        }
    } catch (error) {
        console.log(error)
        return {
            errCode: -1,
            errMessage: `Error server!`
        }
    }
}


const checkUserEmail = async (email) => {
    try {
        let user = await applicationDB.User.findOne({
            where: { email: email }
        })
        return user ? true : false
    } catch (error) {
        return null
    }
}

const deleteUser = (email) => {

}

const getHash = async (pass) => {
    try {
        let hash = await bcrypt.hashSync(pass, salt)
        return {
            errCode: 0,
            data: hash
        }
    } catch (error) {
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

const testJWT = async () => {
    try {

    } catch (error) {
        return {
            errCode: -1,
            errMessage: 'Error Server!'
        }
    }
}

module.exports = {
    handleUserLogin: handleUserLogin,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    getHash, testJWT
}