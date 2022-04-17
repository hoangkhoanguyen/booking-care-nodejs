import express from 'express'
// import cors from 'cors'
import bodyParser from 'body-parser'
import viewEngine from './config/viewEngine'

const cors = require('cors');
import initWebRoutes from './route/web'
import connectDB from './config/connectDB'
require('dotenv').config() // help run process.env

let app = express()

// app.use(bodyParser.json())
const corsOptions = {
    origin: process.env.URL_REACT,
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

viewEngine(app)
initWebRoutes(app)

connectDB()

let port = process.env.PORT || 6969;

app.listen(port, () => {
    console.log('backend nodejs is runing on the port: ', port)
})
