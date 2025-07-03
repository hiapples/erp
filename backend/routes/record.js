import { Router } from 'express'
import inventory from '../models/record.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const data = req.body
    const result = await inventory.insertMany(data)
    res.json({ success: true, inserted: result.length })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
router.get('/', async (req, res) => {
  try {
    const records = await inventory.find().sort({ date: -1 }) // 依日期排序
    res.json(records)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
// PUT 更新一筆資料
router.put('/:id', async (req, res) => {
  try {
    const updated = await inventory.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, updated })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})
export default router
