let express = require('express');
let connectToDb = require('./config/database.js')
let app = express();
let authRouter = require('./routes/auth.routes.js')
let cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser())
app.use('/api/auth',authRouter)


connectToDb()
module.exports = app ; 