<script setup>
import { ref, onMounted, watch,computed } from 'vue'
import axios from 'axios'
const currentPage = ref('one')
const currentPage2 = ref('one-1')
const currentPage3 = ref('one-1')
const selectedDate = ref('')
const selectedDate2 = ref('')
const selectedDate3 = ref('')
const selectedDate4 = ref('')
const recordList = ref([])
const recordList2 = ref([])
const editingId = ref(null)
const selectedItem = ref('')
const selectedItem2 = ref('')


// 初始就有 5 列可輸入
const rows = ref([
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' }
])
const itemOptions = ['雞蛋', '砂糖', '低筋麵粉', '牛奶', '水',"泡打粉","奶油"]

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
const submitAll2 = async () => {
  if (!selectedDate3.value) {
    alert('❌ 請選擇日期')
    return
  }

  const validRows = rows.value.filter(row =>
    row.item && row.quantity !== '' && row.price !== '' && row.note !== ''
  )

  if (validRows.length === 0) {
    alert('❌ 請至少填寫一列完整資料（品項、數量、價格、備註）')
    return
  }

  try {
    const dataWithDate = validRows.map(row => ({
      ...row,
      date: selectedDate3.value
    }))

    const res = await axios.post('http://localhost:3000/api/outrecords', dataWithDate)
    alert(`✅ 共送出 ${res.data.inserted} 筆資料`)
    rows.value = Array.from({ length: 5 }, () => ({ item: '', quantity: '', price: '', note: '' }))
  } catch (err) {
    alert('❌ 發送失敗：' + err.message)
  }
}




const fetchRecords = async () => {
  try {
    let url = 'http://localhost:3000/api/records'

    const queryParams = []

    if (selectedDate2.value) {
      queryParams.push(`date=${selectedDate2.value}`)
    }

    if (selectedItem.value) {
      queryParams.push(`item=${encodeURIComponent(selectedItem.value)}`)
    }

    if (queryParams.length > 0) {
      url += '?' + queryParams.join('&')
    }

    const res = await axios.get(url)
    recordList.value = res.data
  } catch (err) {
    alert('❌ 無法取得資料：' + err.message)
  }
}
const fetchRecords2 = async () => {
  try {
    let url = 'http://localhost:3000/api/outrecords'
    const queryParams = []

    if (selectedDate4.value) queryParams.push(`date=${selectedDate4.value}`)
    if (selectedItem2.value) queryParams.push(`item=${encodeURIComponent(selectedItem2.value)}`)
    if (queryParams.length > 0) url += '?' + queryParams.join('&')

    const res = await axios.get(url)
    recordList2.value = res.data
  } catch (err) {
    alert('❌ 無法取得出庫資料：' + err.message)
  }
}
const fetchRecords3 = async () => {
  try {
    // 先抓入庫資料
    const inRes = await axios.get('http://localhost:3000/api/records')
    recordList.value = inRes.data

    // 再抓出庫資料
    const outRes = await axios.get('http://localhost:3000/api/outrecords')
    recordList2.value = outRes.data
  } catch (err) {
    alert('❌ 取得庫存資料失敗：' + err.message)
  }
}




const confirmEdit = async () => {
  const editingRecord = recordList.value.find(r => r._id === editingId.value)
  try {
    await axios.put(`http://localhost:3000/api/records/${editingId.value}`, editingRecord)
    editingId.value = null
    await fetchRecords() // 送出後重新載入
  } catch (err) {
    alert('❌ 更新失敗：' + err.message)
  }
}
const confirmEdit2 = async () => {
  const editingRecord = recordList2.value.find(r => r._id === editingId.value)
  try {
    const api = currentPage.value === 'three' ? 'outrecords' : 'records'
    await axios.put(`http://localhost:3000/api/${api}/${editingId.value}`, editingRecord)
    editingId.value = null
    currentPage.value === 'three' ? await fetchRecords2() : await fetchRecords()
  } catch (err) {
    alert('❌ 更新失敗：' + err.message)
  }
}

const startEditRecord = (id) => {
  editingId.value = id
}
const startEditRecord2 = (id) => {
  editingId.value = id
}

const deleteRecord = async (id) => {
  if (confirm('❌ 確定要刪除這筆資料嗎？')) {
    try {
      await axios.delete(`http://localhost:3000/api/records/${id}`)
      await fetchRecords() // 刪完重新讀取
    } catch (err) {
      alert('❌ 刪除失敗：' + err.message)
    }
  }
}
const deleteRecord2 = async (id) => {
  if (confirm('❌ 確定要刪除這筆資料嗎？')) {
    try {
      const api = currentPage.value === 'three' ? 'outrecords' : 'records'
      await axios.delete(`http://localhost:3000/api/${api}/${id}`)
      currentPage.value === 'three' ? await fetchRecords2() : await fetchRecords()
    } catch (err) {
      alert('❌ 刪除失敗：' + err.message)
    }
  }
}
const itemSummary = computed(() => {
  const summary = {}

  for (const item of itemOptions) {
    // 計算入庫總量（recordList 是入庫資料）
    const inQty = recordList.value
      .filter(r => r.item === item)
      .reduce((sum, r) => sum + Number(r.quantity), 0)

    // 計算出庫總量（recordList2 是出庫資料）
    const outQty = recordList2.value
      .filter(r => r.item === item)
      .reduce((sum, r) => sum + Number(r.quantity), 0)

    // 庫存 = 入庫 - 出庫
    summary[item] = inQty - outQty
  }

  return summary
})



onMounted(() => {
  if (currentPage.value === 'two') fetchRecords3()
  else if (currentPage.value === 'three') fetchRecords2()
  else fetchRecords()
})

watch([selectedDate3, selectedDate4, selectedItem, selectedItem2], () => {
  if (currentPage.value === 'two') fetchRecords3()
  else if (currentPage.value === 'three') fetchRecords2()
  else fetchRecords()
})

watch(currentPage, (newPage) => {
  if (newPage === 'two') fetchRecords3()
  else if (newPage === 'three') fetchRecords2()
  else fetchRecords()
})

</script>

<template>
  <!-- 上方選單 -->
  <div class="d-flex justify-content-around">
    <div class="item p-3 text-center":class="{ active: currentPage === 'one' }"@click="currentPage = 'one'">入庫</div>
    <div class="item p-3 text-center":class="{ active: currentPage === 'two' }"@click="currentPage = 'two'">庫存</div>
    <div class="item p-3 text-center":class="{ active: currentPage === 'three' }"@click="currentPage = 'three'">出庫</div>
    <div class="item p-3 text-center":class="{ active: currentPage === 'four' }"@click="currentPage = 'four'">報表</div>
  </div>

  <!-- 內容區塊 -->
  <div class="page-content mt-4">
    <!-- 入庫 -->
    <div v-if="currentPage === 'one'">
      <div v-if="currentPage2 === 'one-1'">
        <div class="d-flex justify-content-center align-items-center " >
          <button style="min-width: 330px;" class="btn mb-3" :class="{ active: currentPage2 === 'two-2' }"@click="() => { currentPage2 = 'two-2'; fetchRecords() }">入庫總覽</button>
        </div>
        <div class="form-wrapper">
          <h5 class="title">商品入庫</h5>
          <div class="d-flex justify-content-center mt-3">
            <div class="d-flex align-items-center gap-3 mb-3" style="width: 100%; max-width: 330px;">
              <div style="font-size:14px; white-space: nowrap;">日期&ensp;:</div>
              <input type="date"v-model="selectedDate"class="form-control"style="min-height: 42px;  min-width: 0; flex: 1;"/>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>品項</th>
                <th>數量</th>
                <th>價格</th>
                <th>備註</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rows" :key="index">
                <td class="items">
                  <select v-model="row.item" >
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
            <button class="btn text-center ms-2" @click="submitAll">送出全部</button>
          </div>
        </div>
      </div>
      <div v-else-if="currentPage2 === 'two-2'">
        <div class="d-flex justify-content-center align-items-center " >
          <button style="min-width: 330px;" class="btn mb-3" :class="{ active: currentPage2 === 'one-1' }"@click="currentPage2 = 'one-1'">新增入庫</button>
        </div>
        <div class="form-wrapper">
          <h5 class="title">總覽查詢</h5>
          <div class="d-flex justify-content-center mt-3">
            <div class="d-flex align-items-center gap-3 " style="width: 100%; max-width: 330px;">
              <div style="font-size:14px; white-space: nowrap;">日期&ensp;:</div>
              <input type="date"v-model="selectedDate2"class="form-control"style="min-height: 42px;  min-width: 0; flex: 1;"/>
            </div>
          </div>
          <div class="d-flex justify-content-center mt-3 mb-3">
            <div class="d-flex align-items-center gap-3" style="width: 100%; max-width: 330px;">
              <div style="font-size:14px; white-space: nowrap;">品項&ensp;:</div>
              <select v-model="selectedItem"style="min-height: 42px; font-size: 14px; min-width: 0; flex: 1;">
                <option value=""></option>
                <option v-for="option in itemOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th></th>        
                <th>品項</th>
                <th>數量</th>
                <th>價格</th>
                <th>備註</th>
                <th v-if="!editingId">日期</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in recordList" :key="record._id">
                <td class="button">
                  <template v-if="editingId === record._id">
                    <button class="delete-btn"  @click="deleteRecord(record._id)">刪</button>
                  </template>
                  <template v-else>
                    <button class="update-btn" @click="startEditRecord(record._id)">改</button>
                  </template>
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
                <td >
                  <div style="display: flex; align-items: center; gap: 6px;justify-content: center;">
                    <template v-if="editingId === record._id">
                      <button class="update-btn" style="padding: 6px 10px;" @click="confirmEdit">確認</button>
                    </template>
                    <template v-else>
                        {{ record.date }}
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 庫存 -->
    <div v-else-if="currentPage === 'two'">
      <div class="form-wrapper">
        <h5 class="title">庫存總覽</h5>
        <div v-if="Object.keys(itemSummary).length > 0" style="font-size: 14px;">
          <ul class="list-group">
            <li
              class="list-group-item d-flex justify-content-between align-items-center"
              v-for="(qty, item) in itemSummary"
              :key="item"
            >
              {{ item }}
              <span class="rounded-pill">{{ qty }}</span>
            </li>
          </ul>
        </div>
        <div v-else>目前無資料</div>
      </div>
    </div>
    <!-- 出庫 -->
    <div v-if="currentPage === 'three'">
      <div v-if="currentPage3 === 'one-1'">
        <div class="d-flex justify-content-center align-items-center " >
          <button style="min-width: 330px;" class="btn mb-3" :class="{ active: currentPage3 === 'two-2' }"@click="() => { currentPage3 = 'two-2'; fetchRecords2() }">出庫總覽</button>
        </div>
        <div class="form-wrapper">
          <h5 class="title">商品出庫</h5>
          <div class="d-flex justify-content-center mt-3">
            <div class="d-flex align-items-center gap-3 mb-3" style="width: 100%; max-width: 330px;">
              <div style="font-size:14px; white-space: nowrap;">日期&ensp;:</div>
              <input type="date"v-model="selectedDate3"class="form-control"style="min-height: 42px;  min-width: 0; flex: 1;"/>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>品項</th>
                <th>數量</th>
                <th>價格</th>
                <th>備註</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in rows" :key="index">
                <td class="items">
                  <select v-model="row.item" >
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
            <button class="btn text-center ms-2" @click="submitAll2">送出全部</button>
          </div>
        </div>
      </div>
      <div v-else-if="currentPage3 === 'two-2'">
        <div class="d-flex justify-content-center align-items-center " >
          <button style="min-width: 330px;" class="btn mb-3" :class="{ active: currentPage3 === 'one-1' }"@click="currentPage3 = 'one-1'">新增出庫</button>
        </div>
        <div class="form-wrapper">
          <h5 class="title">總覽查詢</h5>
          <div class="d-flex justify-content-center mt-3">
            <div class="d-flex align-items-center gap-3" style="width: 100%; max-width: 330px;">
              <div style="font-size:14px; white-space: nowrap;">日期&ensp;:</div>
              <input type="date" v-model="selectedDate4" class="form-control" style="min-height: 42px;  min-width: 0; flex: 1;"/>
            </div>
          </div>
          <div class="d-flex justify-content-center mt-3">
            <div class="d-flex align-items-center gap-3 mb-3" style="width: 100%; max-width: 330px;">
              <div style="font-size:14px; white-space: nowrap;">品項&ensp;:</div>
              <select v-model="selectedItem2"style="min-height: 42px; font-size: 14px; min-width: 0; flex: 1;">
                <option value=""></option>
                <option v-for="option in itemOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th></th>        
                <th>品項</th>
                <th>數量</th>
                <th>價格</th>
                <th>備註</th>
                <th v-if="!editingId">日期</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in recordList2" :key="record._id">
                <td class="button">
                  <template v-if="editingId === record._id">
                    <button class="delete-btn"  @click="deleteRecord2(record._id)">刪</button>
                  </template>
                  <template v-else>
                    <button class="update-btn" @click="startEditRecord2(record._id)">改</button>
                  </template>
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
                <td >
                  <div style="display: flex; align-items: center; gap: 6px;justify-content: center;">
                    <template v-if="editingId === record._id">
                      <button class="update-btn" style="padding: 6px 10px;" @click="confirmEdit2">確認</button>
                    </template>
                    <template v-else>
                        {{ record.date }}
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 報表 -->
    <div v-else-if="currentPage === 'four'">報表 </div>
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
  border: none;
  font-size: 8px;
  cursor: pointer;
  border-radius: 15px;
  background-color: #8d0205;
  color:#ffffff;
  padding: 6px;
}

.update-btn{
  border: none;
  font-size: 8px;
  cursor: pointer;
  border-radius: 15px;
  background-color: #1d35d0;
  color:#ffffff;
  padding: 6px;
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
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.title{
  color: #ff0000;
  margin-bottom: 1rem;
}

</style>
