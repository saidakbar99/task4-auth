const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors');
const authRouter = require('./authRouter')

const app = express()
dotenv.config()

const PORT = 5000

app.use(express.json())
app.use(cors());
app.use('/', authRouter)

const start = async () => {
   try {
      await mongoose.connect(process.env.MONGOOSE_CONNECT)
      app.listen(PORT, () => console.log(`>>> Server is working now on PORT:${PORT}`))
   } catch (e) {
      console.error(e)
   }
}

start()
