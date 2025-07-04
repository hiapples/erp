import mongoose from 'mongoose'

const inrecord = new mongoose.Schema({
  item: String,
  quantity: Number,
  price: Number,
  note: String,
  date: String
})

const In = mongoose.model('inrecord', inrecord)
export default In
