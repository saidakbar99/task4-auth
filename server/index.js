require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./router/index')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(cors({
   credentials: true,
   origin: process.env.CLIENT_URL
}))
app.use('/api', router)

const start = async () => {
   try {
      await mongoose.connect(process.env.DB_URL)
      app.listen(PORT, () => console.log(`>>> Server is working now on PORT:${PORT}`))
   } catch (e) {
      console.error(e)
   }
}

start()
