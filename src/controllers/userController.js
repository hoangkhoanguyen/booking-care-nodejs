import applicationDB from '../models/index'
import userService from '../services/userService'
import Validate from '../services/Validate'

const handleLogin = async (req, res) => {
    let token = req.headers["x-access-token"];
    console.log(token)
    const { email, password } = await req.body
    if (!email || !password) {
        return res.status(500).json({
            errorCode: 1,
            message: 'Missing inputs parameter!'
        })
    }
    let userData = await userService.handleUserLogin(email, password)
    return res.json(userData)
}

const handleGetAllUsers = async (req, res) => {
    try {
        const users = await applicationDB.User.findAll({
            attributes: {
                exclude: ['password']
            }
        })
        return res.status(200).json({
            errCode: 0,
            data: users
        })
    } catch (error) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Something wrong!'
        })
    }
}

let handleAddNewUser = async (req, res) => {
    try {
        const data = await req.body
        let user = await applicationDB.User.findOne({ where: { email: data.email } })
        if (user) {
            return res.status(500).json({
                errCode: 2,
                errMessage: 'Email is already used!'
            })
        }
        //validate
        for (const key in data) {
            if (!Validate.ValidateMustNotEmpty(data[key])) {
                return res.status(200).json({
                    errCode: 1,
                    errMessage: `Please check your information!`
                })
            }
        }
        if (!Validate.ValidateEmail(data.email)) {
            return res.status(200).json({
                errCode: 1,
                errMessage: `Please check your email!`
            })
        }
        //create
        const result = await userService.createNewUser(data)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errMessage: 'Something wrong!'
        })
    }
}

const handleEditUser = async (req, res) => {
    try {
        let data = await req.body
        let user = await applicationDB.User.findOne({ where: { email: data.email } })
        if (!user) {
            return res.status(200).json({
                errCode: 1,
                errMessage: `User does not exist!`
            })
        }
        let infoUpdate = {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            role: data.role,
            position: data.position,
            image: data.image
        }
        await applicationDB.User.update(infoUpdate, { where: { email: data.email } })
        return res.status(200).json({
            errCode: 0,
            message: `OK!`
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: `Error Server!`
        })
    }
}

const handleDeleteUser = async (req, res) => {
    try {
        let data = await req.body
        await applicationDB.User.destroy({
            where: { email: data.email }
        })
        return res.status(200).json({
            errCode: 0,
            message: `OK!`
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: `Error Server!`
        })
    }
}

const handleGetHash = async (req, res) => {
    try {
        let pass = req.query.pass
        let result = await userService.getHash(pass)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: `Error Server!`
        })
    }
}

const handleTestJWT = async (req, res) => {
    try {
        let result = await userService.testJWT()
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: `Error Server!`
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleAddNewUser: handleAddNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    handleGetHash, handleTestJWT
}