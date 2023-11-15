<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useBrandProductArticleStore } from '../../../store/brandProductArticle'
import useBrands from '@/composables/brands'
import useProductGroups from '@/composables/productGroups'

const router = useRouter()
interface Brand {
  SUP_ID: number
  SUP_BRAND: string
  SUP_MATCH_CODE: string
  SUP_LOGO_NAME: string
}
const storeBrandProductArticle = useBrandProductArticleStore()
const { brands, brandsError, brandsLoading, getBrands } = useBrands()
const { productGroups, productGroupsErr, productGroupsLoading, getProductGroups } = useProductGroups()

const brand: Ref<string> = ref('')
const productGroup: Ref<string> = ref('')
const brandErr: Ref<string> = ref('')
const groupErr: Ref<string> = ref('')
const brandOptions: Ref<Brand[]> = ref([])

const productGroupOptions: Ref<any[]> = ref([])

const handleSearchByBrand = () => {
  groupErr.value = ''
  if (brand.value === '') {
    brandErr.value = 'Brand is required'

    return
  }

  if (productGroup.value === '')
    groupErr.value = 'Product group is required'

  // pinia store
  storeBrandProductArticle.listBrands = brandOptions.value
  storeBrandProductArticle.listProducts = productGroupOptions.value
  storeBrandProductArticle.selectedBrandId = brand.value
  storeBrandProductArticle.selectedProductId = productGroup.value

  // end pinia store

  router.push({
    name: 'resultByBrandProduct',
    params: { brandid: brand.value, productid: productGroup.value },

  })

  // router.push({
  //   name: 'Product List By Brand',
  //   params: { brandid: brand.value, productid: productGroup.value },
  // })

  // setTimeout(() => {
  //   router.push({
  //     name: 'Categoriesbybrand',
  //     params: { brandid: brand.value, productid: productGroup.value },
  //   })
  // }, 600)
}

/**
 * TO BE TESTED AND THEN REFACTORED
 */

onMounted(async () => {
  await getBrands()
  brandOptions.value = brands.value
})

watch(brand, async () => {
  await getProductGroups(brand.value)
  productGroupOptions.value = productGroups.value
  console.log(brand.value)
  console.log(productGroups.value)
})
</script>

<template>
  <div class="brand-search">
    <h3 class="blue-text" />

    <!-- <p>{{ productGroupOptions }}</p> -->
    <!--  <p>{{ storeBrandProductArticle.listBrands }}</p> -->
    <div class="w-full flex flex-col md:flex-row gap-4">
      <div class="w-full md:w-1/3">
        <label> Select Brand </label>
        <ElSelect
          v-model="brand"
          v-loading="brandsLoading"
          filterable
          placeholder="Select"
          class="select"
        >
          <ElOption
            v-for="item in brandOptions"
            :key="item.SUP_ID ? item.SUP_ID : item.MFA_ID"
            :label="item.SUP_ID ? item.SUP_BRAND : item.MFA_BRAND"
            :value="item.SUP_ID ? item.SUP_ID : item.MFA_ID"
          />
        </ElSelect>
        <p
          v-if="brand === ''"
          class="text-red-500 text-sm"
        >
          {{ brandErr }}
        </p>
      </div>
      <div class="w-full md:w-1/3">
        <label> Select Product Group</label>
        <ElSelect
          v-model="productGroup"
          v-loading="productGroupsLoading"
          filterable
          placeholder="Select"
          class="select"
        >
          <ElOption
            v-for="item in productGroupOptions"
            :key="item.PT_ID"
            :label="item.PT_DES_ID"
            :value="item.PT_ID"
          >
            {{ item.PT_DES_ID }} ({{ item.COUNT_ART }} )
          </ElOption>
        </ElSelect>
        <p
          v-if="productGroup === ''"
          class="text-red-500 text-sm"
        >
          {{ groupErr }}
        </p>
      </div>
      <div class="w-full md:w-1/3">
        <ElButton
          style="margin-top: 23px;"
          class="btn"
          icon="search"
          @click="handleSearchByBrand"
        >
          Search
        </ElButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.brand-search {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
