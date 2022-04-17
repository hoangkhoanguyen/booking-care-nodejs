import express, { Router } from "express";
import searchController from '../controllers/searchController'

let router = express.Router();

let searchRoutes = (app) => {

    router.get('/search-for', searchController.handleSearch)

    return app.use("/api/search", router)
}

module.exports = searchRoutes;