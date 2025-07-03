<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
const currentPage = ref('one')
const currentPage2 = ref('one-1')
const selectedDate = ref('')
const recordList = ref([])
const editingId = ref(null)

// 初始就有 5 列可輸入
const rows = ref([
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' }
])
const itemOptions = ['滑鼠滑鼠滑鼠', '滑鼠滑鼠滑', '螢幕', '鍵盤', '耳機']

// 最後送出全部列
const submitAll = async () => {
  // 日期沒填不能送
  if (!selectedDate.value) {
    alert('❌ 請選擇日期')
    return
  }

  // 篩選出「每格都填寫」的有效列
  const validRows = rows.value.filter(row =>
    row.item && row.quantity !== '' && row.price !== '' && row.note !== ''
  )

  if (validRows.length === 0) {
    alert('❌ 請至少填寫一列完整資料（品項、數量、價格、備註）')
    return
  }

  try {
    // 加入日期欄
    const dataWithDate = validRows.map(row => ({
      ...row,
      date: selectedDate.value
    }))

    const res = await axios.post('http://localhost:3000/api/records', dataWithDate)
    alert(`✅ 共送出 ${res.data.inserted} 筆資料`)

    // 重設 5 列空白
    rows.value = Array.from({ length: 5 }, () => ({ item: '', quantity: '', price: '', note: '' }))
  } catch (err) {
    alert('❌ 發送失敗：' + err.message)
  }
}


const deleteRow = (index) => {
  if (rows.value.length <= 1) {
    alert("⚠️ 至少要保留一列，無法刪除最後一列。")
    return
  }
  rows.value.splice(index, 1)
}
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/records')
    recordList.value = res.data
  } catch (err) {
    alert('❌ 無法取得入庫紀錄：' + err.message)
  }
})
const startEdit = (id) => {
  editingId.value = id
}
const fetchRecords = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/records')
    recordList.value = res.data
  } catch (err) {
    alert('❌ 無法取得資料：' + err.message)
  }
}
const confirmEdit = async () => {
  const editingRecord = recordList.value.find(r => r._id === editingId.value)
  try {
    await axios.put(`http://localhost:3000/api/records/${editingId.value}`, editingRecord)
    editingId.value = null
    await fetchRecords() // 送出後重新載入
    alert('✅ 更新成功')
  } catch (err) {
    alert('❌ 更新失敗：' + err.message)
  }
}
const startEditRecord = (id) => startEdit(id)

</script>

<template>
  <!-- 上方選單 -->
  <div class="d-flex justify-content-around">
    <div class="item p-3 text-center":class="{ active: currentPage === 'one' }"@click="currentPage = 'one'">入庫</div>
    <div class="item p-3 text-center":class="{ active: currentPage === 'two' }"@click="currentPage = 'two'">報表</div>
  </div>

  <!-- 內容區塊 -->
  <div class="page-content mt-4">
    <!-- 入庫 -->
    <div v-if="currentPage === 'one'">
      <div v-if="currentPage2 === 'one-1'">
        <div class="d-flex justify-content-center align-items-center gap-3 mt-3">
          <div  style="font-size:14px;white-space: nowrap;">日期&ensp;:</div>
          <input type="date" v-model="selectedDate" class="form-control " />
          <button class="me-3 btn" :class="{ active: currentPage2 === 'two-2' }"@click="() => { currentPage2 = 'two-2'; fetchRecords() }">入庫總覽</button>
        </div>

        <div class="form-wrapper">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>品項</th>
                <th>數量</th>
                <th>價格</th>
                <th>備註</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rows" :key="index">
                <!-- 刪除按鈕欄 -->
                <td class="button">
                  <button class="delete-btn" @click="deleteRow(index)">❌</button>
                </td>
                <!-- 其他欄位 -->
                <td class="items">
                  <select v-model="row.item">
                    <option  v-for="option in itemOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </td>
                <td><input type="number" class="qty" v-model.number="row.quantity" min="1" /></td>
                <td><input type="number" class="price" v-model.number="row.price" min="0" /></td>
                <td><input  class="note"v-model="row.note" /></td>
              </tr>
            </tbody>
          </table>

          <div class="d-flex  justify-content-end">
            <button class="btn text-center" @click="rows.push({ item: '', quantity: '', price: '', note: '' })">新增列</button>
            <button class="btn text-center ms-2" @click="submitAll">送出全部</button>
          </div>
        </div>
      </div>
      <div v-else-if="currentPage2 === 'two-2'">
        <div class="d-flex justify-content-center align-items-center gap-3 mt-3">
          <div  style="font-size:14px;white-space: nowrap;">日期&ensp;:</div>
          <input type="date" v-model="selectedDate2" class="form-control" />
          <button class="me-3 btn" :class="{ active: currentPage2 === 'one-1' }"@click="currentPage2 = 'one-1'">新增入庫</button>
        </div>
        <div class="form-wrapper">
          <table>
            <thead>
              <tr>
                <th></th>        
                <th>品項</th>
                <th>數量</th>
                <th>價格</th>
                <th>備註</th>
                <th>日期</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in recordList" :key="record._id">
                <td class="button">
                  <button class="update-btn" v-if="editingId === record._id" @click="confirmEdit">✅</button>
                  <button class="update-btn" v-else @click="startEditRecord(record._id)">🔄️</button>
                </td>
                <td class="items">
                  <template v-if="editingId === record._id">
                    <select v-model="record.item">
                      <option v-for="option in itemOptions" :key="option" :value="option">{{ option }}</option>
                    </select>
                  </template>
                  <template v-else>
                    {{ record.item }}
                  </template>
                </td>

                <td class="qty">
                  <template v-if="editingId === record._id">
                    <input type="number" v-model.number="record.quantity" min="1" />
                  </template>
                  <template v-else>
                    {{ record.quantity }}
                  </template>
                </td>

                <td class="price">
                  <template v-if="editingId === record._id">
                    <input type="number" v-model.number="record.price" min="0" />
                  </template>
                  <template v-else>
                    {{ record.price }}
                  </template>
                </td>

                <td class="note">
                  <template v-if="editingId === record._id">
                    <input v-model="record.note" />
                  </template>
                  <template v-else>
                    {{ record.note }}
                  </template>
                </td>

                <td class="date">
                  <template v-if="editingId === record._id">
                    <input type="date" v-model="record.date" />
                  </template>
                  <template v-else>
                    {{ record.date }}
                  </template>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 報表 -->
    <div v-else-if="currentPage === 'two'">這是【報表】頁面內容</div>
  </div>
</template>

<style scoped>
.item {
  background-color: #b2afaf;
  width: 50%;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2); /* 陰影效果 */
}

.item.active {
  background-color: #6c6d6e; /* 選中的顏色 */
  color: white;
}

.page-content {
  padding: 20px;
  min-height: 200px;
  text-align: center;
  font-size: 1.2rem;
}
input[type="date"] {
  padding: 8px 24px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 50%;
}
.btn {
  background-color: #b2afaf;
  padding:10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 12px;
  width: 20%;
  white-space: nowrap; /* 禁止換行 */
}
.btn:hover {
  background-color: #6c6d6e;
  color: #ffffff; /* 滑鼠移上去的新顏色 */
}
.form-wrapper {
  max-width: 800px;
  margin: 20px auto;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

th, td {
  border: none;
  padding: 4px;
  text-align: center;
  font-size: 12px;
}

input {
  width: 100%;
  padding: 4px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}


.delete-btn {
  background: transparent;
  border: none;
  color: red;
  font-size: 10px;
  cursor: pointer;
  transition: transform 0.1s ease;
}
.delete-btn:hover {
  transform: scale(1.2);
}
.update-btn{
  background: transparent;
  border: none;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.1s ease;
}
.update-btn:hover {
  transform: scale(1.2);
}
select {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

td select,
td input {
  min-height: 30px;
}

/* 移除上下箭頭 */
.price::-webkit-outer-spin-button,
.price::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.qty::-webkit-outer-spin-button,
.qty::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.items{
  min-width: 80px;
}
.qty {
  min-width: 45px;
}

.price {
  min-width: 45px;
  
}
.note {
  min-width: 50px;
}

.button{
  max-width: 20px;
  padding-left: 0px!important;
  padding-right: 25px!important;
}


</style>
