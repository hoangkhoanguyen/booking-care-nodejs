import db from '../models/index'
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10)

let createNewUser = async (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            let hashPassWordFromBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPassWordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            resolve('ok create a new user succeed')
        } catch (error) {
            reject(error)
        }
    })

}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassWord = await bcrypt.hashSync(password, salt)
            resolve(hashPassWord)
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
}