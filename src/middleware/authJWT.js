import jwt from 'jsonwebtoken'
import aplicationDB from '../models/index'
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
        return res.status(401).send({
            errCode: 1,
            errMessage: "Unauthorized! Access Token was expired!"
        });
    }
    return res.sendStatus(401).send({
        errCode: 1,
        errMessage: "Unauthorized!"
    });
}
const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            errCode: 3,
            errMessage: "No token provided!"
        });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return catchError(err, res);
        }
        req.email = decoded.email;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    let { email } = req
    try {
        let user = await aplicationDB.User.findOne({
            where: { email }
        })
        if (user) {
            if (user.role == 'R1') {
                next()
                return
            }
            return res.status(401).send({
                errCode: 2,
                errMessage: "Only admin can do this!"
            });
        }
        return res.status(403).send({
            errCode: 2,
            errMessage: 'User not found!'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            errCode: -1,
            errMessage: 'Error server!'
        })
    }
}

export default {
    verifyToken, isAdmin
}