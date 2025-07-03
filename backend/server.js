import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import recordRoutes from './routes/record.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/records', recordRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running at http://localhost:${process.env.PORT}`)
    })
  })
  .catch(err => console.error('❌ DB 連線錯誤', err))
