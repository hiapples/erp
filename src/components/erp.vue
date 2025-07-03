<script setup>
import { ref } from 'vue'

const currentPage = ref('one')
const currentPage2 = ref('one-1')


// 初始就有 5 列可輸入
const rows = ref([
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' },
  { item: '', quantity: '', price: '', note: '' }
])
const itemOptions = ['筆電筆電筆電筆電筆電滑鼠滑鼠滑鼠滑鼠滑鼠', '滑鼠', '螢幕', '鍵盤', '耳機']

// 最後送出全部列
const submitAll = () => {
  const validRows = rows.value.filter(r => r.item) // 至少要有品項
  if (validRows.length === 0) {
    alert('請輸入至少一筆有效資料（需有品項）')
    return
  }

  console.log('📦 提交資料：', validRows)
  alert(`共提交 ${validRows.length} 筆資料`)
}
const deleteRow = (index) => {
  if (rows.value.length <= 1) {
    alert("⚠️ 至少要保留一列，無法刪除最後一列。")
    return
  }
  rows.value.splice(index, 1)
}
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
          <input type="date" v-model="selectedDate" class="form-control ms-3" />
          <button class="me-3 btn" :class="{ active: currentPage2 === 'two-2' }"@click="currentPage2 = 'two-2'">入庫總覽</button>
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
                <td>
                  <button class="delete-btn" @click="deleteRow(index)">❌</button>
                </td>
                <!-- 其他欄位 -->
                <td >
                  <select v-model="row.item">
                    <option v-for="option in itemOptions" :key="option" :value="option">{{ option }}</option>
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
          <input type="date" v-model="selectedDate2" class="form-control ms-3" />
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
              <tr >
                <!-- 修改按鈕欄 -->
                <td>
                  <button class="update-btn" >♻️</button>
                </td>
                <!-- 其他欄位 -->
                <td ></td>
                <td></td>
                <td></td>
                <td></td>
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
  background-color: #eee;
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
  padding: 16px;
  border-radius: 8px;
  background-color: #f8f8f8;
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
th:nth-child(2),
td:nth-child(2) {
  min-width: 80px;
}
td select,
td input {
  min-height: 30px;
}
.qty {
  min-width: 45px;
}

.price {
  min-width: 45px;
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
.note {
  min-width: 50px;
}
.index{
  min-width: 30px;
}
</style>
