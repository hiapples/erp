import mongoose from 'mongoose'

const outrecord = new mongoose.Schema({
  item: String,
  quantity: Number,
  price: Number,
  note: String,
  date: String
})

const Out = mongoose.model('outrecord', outrecord) // 對應 inventories
export default Out
