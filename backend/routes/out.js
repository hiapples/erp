import { Router } from 'express'
import Outmodel from '../models/out.js'  // 你的 MongoDB Mongoose model

const router = Router()

// 新增多筆資料
router.post('/', async (req, res) => {
  try {
    const data = req.body
    const result = await Outmodel.insertMany(data)
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

    const records = await Outmodel.find(query).sort({ date: -1 })
    res.json(records)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})


// 根據日期取得資料（用 URL param）
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params
    const records = await Outmodel.find({ date }).sort({ date: -1 })
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
    const records = await Outmodel.find(query).sort({ date: -1 })
    res.json(records)
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// 更新指定 id 的資料
router.put('/:id', async (req, res) => {
  try {
    const updated = await Outmodel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, updated })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// 刪除指定 id 的資料
router.delete('/:id', async (req, res) => {
  try {
    await Outmodel.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})


// 取得指定日期的出庫成本總和
const group1 = ['雞蛋', '砂糖', '低筋麵粉', '牛奶', '水', '泡打粉', '奶油'];
const group2 = ['金桔', '冰糖', '檸檬汁'];
router.get('/total/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const records = await Outmodel.find({ date });

    let totalGroup1 = 0;
    let totalGroup2 = 0;

    for (const r of records) {
      const amt = r.quantity * r.price;
      if (group1.includes(r.item)) totalGroup1 += amt;
      else if (group2.includes(r.item)) totalGroup2 += amt;
    }

    res.json({
      date,
      totalGroup1,
      totalGroup2
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router
