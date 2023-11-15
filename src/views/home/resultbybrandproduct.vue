<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'

import { useRoute } from 'vue-router'
import PartOverViewVue from '../../components/Custom/cards/PartOverView.vue'
import { useBrandProductArticleStore } from '../../store/brandProductArticle'

// import PartOverViewVue from '../cards/PartOverView.vue'
import useBrands from '@/composables/brands'
import useProductGroups from '@/composables/productGroups'
import { S3_STORAGE_IMAGE } from '@/composables/constant'

const router = useRouter()

// const router = useRouter()
interface Brand {
  SUP_ID: number
  SUP_BRAND: string
  SUP_MATCH_CODE: string
  SUP_LOGO_NAME: string
}
interface IArticle {
  ART_ID: number
  ART_SUP_ID: number
  ART_ARTICLE_NR: string
  ACS_STATUS_KV_KV: string
  ART_STATUS_TEXT: string
  DESCRIPTIONS: string
  ART_INFO: string
  ART_DES: string
  ART_SUP_BRAND: string
  LA_ARTICLE_CRITERIA: any
  ART_MEDIA_FILE_NAME: string
}
const search = ref('')
const route = useRoute()
const storeBrandProductArticle = useBrandProductArticleStore()

const searchCategoriesVisible: Ref<boolean> = ref(false)
const { brands, brandsError, brandsLoading, getBrands, getArticlesbyproductandbrand, articles } = useBrands()
const { productGroups, productGroupsErr, productGroupsLoading, getProductGroups } = useProductGroups()

const brand: Ref<string> = ref('')
const productGroup: Ref<string> = ref('')
const brandErr: Ref<string> = ref('')
const groupErr: Ref<string> = ref('')
const brandOptions: Ref<Brand[]> = ref([])
const loading: Ref<boolean> = ref(false)
const firsTime: Ref<boolean> = ref(false)
const responseData: Ref<IArticle[]> = ref([])
const productGroupOptions: Ref<any[]> = ref([])
const searchResults: Ref<IArticle[]> = ref([])

const noDataFound: Ref<boolean> = ref(false)
const itemsPerPage: Ref<number> = ref(10)
const filteredSearchResults: Ref<IArticle[]> = ref([])

const currentPage: Ref<number> = ref(1)

watch(search, async () => {
  console.log('search', search)
  console.log('reponse', responseData.value)
  currentPage.value = 1

  const resSearchNumber = responseData.value.filter(item => item.ART_ARTICLE_NR.toUpperCase().includes(search.value.toUpperCase()))

  searchResults.value = resSearchNumber
  filteredSearchResults.value = resSearchNumber
})

const handleSearchByBrand = async () => {
  currentPage.value = 1
  responseData.value = []

  // console.log('handle brand', brand)
  groupErr.value = ''
  if (brand.value === '') {
    brandErr.value = 'Brand is required'

    return
  }

  if (productGroup.value === '')
    groupErr.value = 'Product group is required'
  loading.value = true

  await getArticlesbyproductandbrand({ suppid: brand.value, ptid: productGroup.value })
  loading.value = false
  console.log('list articles', articles)

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

  // old router method
  // router.push({
  //   name: 'resultSearchByBrandProduct',
  //   params: { brandid: brand.value, productid: productGroup.value },

  // })
}

const handleChange = async () => {
  console.log('handleChange')
}

/**
 * TO BE TESTED AND THEN REFACTORED
 */

onMounted(async () => {
  // storeBrandProductArticle
  if (route.params.brandid !== '' && route.params.productid !== '') {
    console.log('brandid and productid', `${route.params.brandid} ${route.params.productid}`)

    // params ! null
    if (storeBrandProductArticle.selectedBrandId !== '-1' && storeBrandProductArticle.selectedProductId !== '-1') {
      // store ! empty
      console.log('selectedBrandId and selectedProductId  bbb', `${storeBrandProductArticle.selectedBrandId} ${storeBrandProductArticle.selectedProductId}`)
      console.log('selectedBrandId and selectedProductId  bbb', `${storeBrandProductArticle.selectedBrandId} ${storeBrandProductArticle.selectedProductId}`)
      brandOptions.value = storeBrandProductArticle.listBrands
      productGroupOptions.value = storeBrandProductArticle.listProducts

      brand.value = storeBrandProductArticle.selectedBrandId.toString()
      productGroup.value = storeBrandProductArticle.selectedProductId.toString()

      loading.value = true

      await getArticlesbyproductandbrand({ suppid: brand.value, ptid: productGroup.value })
      loading.value = false
      console.log('list articles', articles)

      storeBrandProductArticle.listArticles = articles.value
    }

    else if (storeBrandProductArticle.selectedBrandId === '-1' && storeBrandProductArticle.selectedProductId === '-1') {
      // empty store

      brand.value = route.params.brandid.toString()
      productGroup.value = route.params.productid.toString()

      // get  brands list

      await getBrands()
      brandOptions.value = brands.value

      // get products list
      await getProductGroups(brand.value)
      productGroupOptions.value = productGroups.value

      await getArticlesbyproductandbrand({ suppid: brand.value, ptid: productGroup.value })
      loading.value = false
      console.log('list articles', articles)

      // store brands and products and articles in pinia
      storeBrandProductArticle.listBrands = brandOptions.value
      storeBrandProductArticle.listProducts = productGroupOptions.value
      storeBrandProductArticle.listArticles = articles.value
      storeBrandProductArticle.selectedBrandId = brand.value
      storeBrandProductArticle.selectedProductId = productGroup.value
    }
  }

  else {
    await getBrands()
    brandOptions.value = brands.value
  }
})

watch(brand, async () => {
  searchResults.value = []
  filteredSearchResults.value = []
  if (firsTime.value)
    productGroup.value = ''

  //

  await getProductGroups(brand.value)
  productGroupOptions.value = productGroups.value
  console.log(brand.value)
  console.log(productGroups.value)
  firsTime.value = true
})

// const hanldeShowSeacrhCategories = (): void => {
//   searchCategoriesVisible.value = !searchCategoriesVisible.value
// }

// const handleSaerchCategoryInputFocus = (): void => {
//   searchCategoriesVisible.value = false
// }

// for search articles list by brand and product
// const {  } = useBrands()

// const carSTore = useCarStore()
// const brandStore = useBrandStore()
// const router = useRouter()

const filteredItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value

  return filteredSearchResults.value.slice(startIndex, endIndex)
})

const pagedItems = computed(() => {
  return filteredItems.value
})

watch([articles], async () => {
  if (articles.value.length > 0) {
    try {
      loading.value = true

      // const response = await axios.get(ARTICLES_DOMAIN, {
      //   params: {
      //     carId: props.carId,
      //     ptid: carSuppliersProducts.value[brandStore.selectedBrandIndex].PT_ID,
      //     suppid:
      //       carSuppliersProducts.value[brandStore.selectedBrandIndex].SUP_ID,
      //     typeCar: carSTore.carType,
      //   },
      // });

      responseData.value = articles.value
      if (responseData.value.length > 0) {
        searchResults.value = responseData.value
        filteredSearchResults.value = responseData.value
      }
      else {
        noDataFound.value = true
      }
      loading.value = false
    }
    catch (e) {
      // console.log(e);
      loading.value = false
    }
  }
  else {
    noDataFound.value = true
  }
})

// end search articles list by brand and product
</script>

<template>
  <!--
    <p>
    {{ storeBrandProductArticle }}
    </p>
    <p>{{ route.params.brandid }}</p>
    <p>{{ route.params.productid }}</p>
  -->
  <!--
    <div

    >
  -->
  <VCard
    class="w-full  space-y-4  bg-white"
    style="padding-right: 20px;padding-bottom: 20px;padding-left: 20px;"
  >
    <!--
      <span class=" blue-text flex items-center gap-3">
      <ElIcon :size="18"><Search /></ElIcon>
      <span>Search By Brand</span>
      </span>
      <br>
    -->
    <div>
      <div class="w-full blue-text items-center flex flex-col md:flex-row gap-2">
        <div class="w-full md:w-3/12">
          <VTextField
            id="searchNumber"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search by number"
            style="margin-top: 8px;"
          />
        </div>
        <div class="w-full md:w-4/12">
          <label for="brandSelect"> Select Brand </label>
          <ElSelect
            id="brandSelect"
            v-model="brand"
            v-loading="brandsLoading"
            filterable
            placeholder="Select"
            class="w-full select"
          >
            <ElOption
              v-for="item in brandOptions"
              :key="item.SUP_ID.toString()"
              :label="item.SUP_BRAND"
              :value="item.SUP_ID.toString()"
            />
          </ElSelect>
          <p
            v-if="brand === ''"
            class="text-red-500 text-sm"
          >
            {{ brandErr }}
          </p>
        </div>
        <div class="w-full md:w-4/12">
          <label for="productSelect"> Select Product Group</label>
          <ElSelect
            id="productSelect"
            v-model="productGroup"
            v-loading="productGroupsLoading"
            filterable
            placeholder="Select"
            class="w-full select"
            @change="handleChange"
          >
            <ElOption
              v-for="item in productGroupOptions"
              :key="item.PT_ID.toString()"
              :label="item.PT_DES_ID"
              :value="item.PT_ID.toString()"
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

        <div class="w-full md:w-1/12 flex  items-center">
          <ElButton
            style="margin-top: 23px !important;"
            class="w-full  btn"
            icon="search"
            @click="handleSearchByBrand"
          >
            Search
          </ElButton>
        </div>
      </div>
    </div>
  </VCard>
  <!-- </div> -->

  <!-- <SearchProductListBrand></SearchProductListBrand> -->
  <!-- overflow-y-auto max-h-[550px] -->
  <div
    class="w-full   space-y-4"
    style="margin-top: 15px;"
  >
    <div
      v-if="noDataFound"
      class="flex flex-col rounded-md"
    >
      <p class="text-xl text-center font-bold">
        Unfortunately, we could not find any article related to your search
      </p>
    </div>
    <!--
      <p>
      Resultat
      </p>
    -->
    <!--
      <p>
      {{ searchResults }}
      </p>
    -->

    <div
      v-for="result in pagedItems"
      :key="result.ART_ID"
    >
      <PartOverViewVue

        :sup-id="result.ART_SUP_ID"
        :brand="
          result.ART_SUP_BRAND
        "
        :product-name="
          result.ART_DES
        "
        :article="result"
        :image="`${S3_STORAGE_IMAGE}articles.img/IMAGES/${
          result.ART_SUP_ID
        }/${result.ART_MEDIA_FILE_NAME}`"
      />
    </div>

    <div class="text-center mt-5">
      <VPagination
        v-if="articles.length > 0"
        v-model="currentPage"
        :length="Math.ceil(searchResults.length / itemsPerPage)"
        :total-visible="10"
        style=" display: inline-block;"
      />
      <VSelect
        v-model="currentPage"
        solo
        :items="Array.from({ length: Math.ceil(searchResults.length / itemsPerPage) }, (_, i) => (i + 1))"
        style=" display: inline-block;height: 20px !important;"
      />
    </div>
  </div>

  <!-- end SearchProductListBrand -->
</template>

<style scoped>
.brand-search {
  display: flex;
  flex-direction: column;

  /* gap: 10px; */
}

.btn {
  background-color: #2d4aae;
  color: white;
}
</style>
