<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'

import HomeHeader from '../../components/Custom/Headers/HomeHeader.vue'
import HomeSeacrh from './HomeSearch.vue'
import BrandSearch from './BrandSearch.vue'
import useCarStore from '@/store/car'

const router = useRouter()

const isPersonal: Ref<boolean> = ref(true)
const isCommercial: Ref<boolean> = ref(true)
const carStore = useCarStore()
const barcode: Ref<string> = ref('')
const errBarcode: Ref<string> = ref('')

const searchCategoriesVisible: Ref<boolean> = ref(false)

const hanldeShowSeacrhCategories = (): void => {
  searchCategoriesVisible.value = !searchCategoriesVisible.value
}

const handleSaerchCategoryInputFocus = (): void => {
  searchCategoriesVisible.value = false
}

const checkBarcode = async () => {
  errBarcode.value = ''
  if (!barcode.value)
    errBarcode.value = 'Barcode is required'

  if (barcode.value.toString().length !== 12 && barcode.value.toString().length !== 13)
    errBarcode.value = 'Barcode mut be 12 or 13 length'
}

const handleScanBarcode = async () => {
  if (errBarcode.value === '') {
    router.push({
      name: 'Product List By Barcode',
      params: { barcode: barcode.value },
    })
  }
}

onMounted(() => {
  carStore.setCarInfo(null)
  carStore.setAllCategories([])
})
</script>

<template>
  <div class="main">
    <div
      class="layout"
      @click.self="handleSaerchCategoryInputFocus"
    >
      <div>
        <HomeHeader
          :search-categories-visible="searchCategoriesVisible"
          @show-search-categories="hanldeShowSeacrhCategories"
          @search-category-input-focus="handleSaerchCategoryInputFocus"
          @catalogue-click="handleSaerchCategoryInputFocus"
        />
      </div>
      <div @click="handleSaerchCategoryInputFocus">
        <div class="search-section mt-4">
          <div class="search-fields">
            <div
              v-if="errBarcode"
              class="text-center text-red-500 text-sm"
            >
              {{ errBarcode }}
            </div>
            <div class="   grid-content blue-text">
              <div class="smart-search">
                <input
                  v-model="barcode"
                  type="text"
                  class="bg-white el-input mx-1 text-[#000]"
                  placeholder="Start scanning..."
                  @input="checkBarcode"
                >
                <span class="pl-5 pr-5">
                  {{ barcode.toString().length }}
                </span>
                <ElButton
                  class="btn p-1.5"

                  @click="handleScanBarcode"
                >
                  <FontAwesomeIcon icon="fa-solid fa-barcode" />
                  <span class="ml-3">SEARCH</span>
                </ElButton>
              </div>
            </div>

            <div class="search-tabs">
              <HomeSeacrh
                :is-commercial="isCommercial"
                :is-personal="isPersonal"
              />
            </div>
            <div class="search-tabs my-6">
              <BrandSearch />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.main {
  gap: 20px;
}

.home-btn {
  padding-block-start: 10px;
  padding-inline-start: 10px;
}

.btn {
  background-color: #2d4aae;
  color: white;
}

.layout {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #f1f1fc;
  gap: 20px;
  margin-block: 20px;
  margin-inline: 0;
}

.el-row {
  margin-block-end: 20px;

  &:last-child {
    margin-block-end: 0;
  }
}

.el-col {
  border-radius: 0;
}

.grid-content {
  display: flex;
  align-items: center;
  border-radius: 4px;
  inline-size: 100%;
  min-block-size: 50px;
  padding-block: 0;
  padding-inline: 10px;
}

.row-bg {
  background-color: #f9fafc;
  padding-block: 10px;
  padding-inline: 0;
}

.smart-search {
  display: flex;
  align-items: center;
  border: 1px solid #86b7fd;
  border-radius: 4px;
  inline-size: 100%;
  margin-block-end: 20px;
  margin-inline-start: -10px;
}

.el-input {
  border: none;
  border-radius: 0;
  block-size: 40px;
  border-inline-end: 1px solid transparent;
  inline-size: 100%;
  padding-block: 0;
  padding-inline: 10px;

  &:focus {
    border: none;
    outline: none;
  }
}

.account {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
}

.account-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.blue-text {
  color: var(--primary-color);
  font-weight: 600;
}

.tabs-buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  background-color: #fff;
  gap: 10px;
}

.search-section {
  display: block;
  flex-wrap: wrap;
  inline-size: 100%;
}

.search-fields {
  inline-size: 100%;
}

.search-by-brand {
  background-color: #fff;
  box-shadow: 0 8px 6px -6px rgb(226, 224, 224);

  /* padding: 10px; */
  margin-block-start: 20px;
}
</style>
