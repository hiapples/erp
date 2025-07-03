import mongoose from 'mongoose'

const recordSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  price: Number,
  note: String,
  date: String
})

const Inventory = mongoose.model('inventory', recordSchema) // 對應 inventories
export default Inventory
