import express, { Router } from "express";
import userController from '../controllers/userController'
import authJWT from "../middleware/authJWT";

let router = express.Router();

let userRoutes = (app) => {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.post('/login', userController.handleLogin)
    router.get('/getAll', [authJWT.verifyToken], userController.handleGetAllUsers)
    router.post('/addNew', [authJWT.verifyToken, authJWT.isAdmin], userController.handleAddNewUser)
    router.post('/edit', [authJWT.verifyToken, authJWT.isAdmin], userController.handleEditUser)
    router.post('/delete', [authJWT.verifyToken, authJWT.isAdmin], userController.handleDeleteUser)

    return app.use("/api/user", router)
}

module.exports = userRoutes;