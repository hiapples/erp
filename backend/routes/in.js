import { Router } from 'express'
import Inmodel from '../models/in.js'  // 你的 MongoDB Mongoose model

const router = Router()

// 新增多筆資料
router.post('/', async (req, res) => {
  try {
    const data = req.body
    const result = await Inmodel.insertMany(data)
    res.json({ success: true, inserted: result.length })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// 取得所有資料（可選日期查詢）
router.get('/', async (req, res) => {
  try {
    const { date, item } = req.query
    const query = {}

    if (date) query.date = date
    if (item) query.item = item

    const records = await Inmodel.find(query).sort({ date: -1 })
    res.json(records)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})


// 根據日期取得資料（用 URL param）
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params
    const records = await Inmodel.find({ date }).sort({ date: -1 })
    res.json(records)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// 使用 POST 搜尋資料（適合前端用 POST 傳參數）
router.post('/search', async (req, res) => {
  try {
    const { date } = req.body
    const query = date ? { date } : {}
    const records = await Inmodel.find(query).sort({ date: -1 })
    res.json(records)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// 更新指定 id 的資料
router.put('/:id', async (req, res) => {
  try {
    const updated = await Inmodel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, updated })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// 刪除指定 id 的資料
router.delete('/:id', async (req, res) => {
  try {
    await Inmodel.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
