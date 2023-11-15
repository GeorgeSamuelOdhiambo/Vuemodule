<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sortBy, uniq } from 'lodash'
import PartOverViewVue from '../cards/PartOverView.vue'
import { S3_STORAGE_IMAGE } from '@/composables/constant'
import useCars from '@/composables/cars'
import useCarStore from '@/store/car'
import useBrandStore from '@/store/brands'
import useParts from '@/composables/parts'

interface IArticle {
  ART_ID: number
  ARL_BRA_ID: number
  ARL_BRA_BRAND: string
  ART_DES: string
  ART_ARTICLE_NR: string
  ACS_STATUS_KV_KV: string
  ART_STATUS_TEXT: string
  DESCRIPTIONS: string
  ART_INFO: string
  LA_ARTICLE_CRITERIA: any
  ART_MEDIA_FILE_NAME: string
}

const props = defineProps(['searchTreeId', 'groupName', 'carId'])
const route = useRoute()
const { getCarSuppliersProduct, carSuppliersProducts } = useCars()
const { getByPartNumber, articles, error } = useParts()
const carSTore = useCarStore()
const brandStore = useBrandStore()
const router = useRouter()
const searchResults: Ref<IArticle[]> = ref([])

const loading: Ref<boolean> = ref(false)
const noDataFound: Ref<boolean> = ref(false)
const itemsPerPage: Ref<number> = ref(10)
const filteredSearchResults: Ref<IArticle[]> = ref([])

const currentPage: Ref<number> = ref(1)
const partNumber: Ref<any> = ref('')
const searchby: Ref<any> = ref('')

// const filteredSearchResultsByAssemblyGroup = computed(() => {
//   return searchResults.value.filter((item: IArticle) => item.PRODUCT_GROUP.toLowerCase().includes(assemblyGroup.value.toLowerCase()))
// })

// watch(assemblyGroup, () => {
//   filteredSearchResults.value = filteredSearchResultsByAssemblyGroup.value
// })
const carStore = useCarStore()

const filteredItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value

  return filteredSearchResults.value.slice(startIndex, endIndex)
})

const pagedItems = computed(() => {
  return filteredItems.value
})

onMounted(async () => {
  loading.value = true
  searchby.value = route.query.searchby
  carSuppliersProducts.value = []

  // remove car store info if it comes from search by partnumber or brand
  carSTore.setCarInfo([])

  partNumber.value = route.params.partnumber
  await getByPartNumber(partNumber.value, searchby.value, route.query.parttype)

  // if (articles.value.length === 1) {
  //   router.push({
  //     name: 'Product Details',
  //     params: {
  //       artId: articles.value[0].ART_ID,
  //       artNumber: articles.value[0].ART_ARTICLE_NR,
  //       supId: articles.value[0].ARL_BRA_ID,
  //     },
  //     query: { ...route.query, ...{ kind: articles.value[0].ARL_KIND ? articles.value[0].ARL_KIND : 1 } },
  //   })
  // }
  console.log(articles.value)
  carSuppliersProducts.value = articles.value.map(item => ({
    SUP_BRAND: item.ART_SUP_BRAND,
    PRODUCT_GROUP: item.PRODUCT_GROUP,
    PT_ID: item.PT_ID,
    SUP_ID: item.ART_SUP_ID,
  }))
  carSuppliersProducts.value = sortBy(carSuppliersProducts.value, ['SUP_BRAND'])

  carSuppliersProducts.value.unshift({ SUP_BRAND: 'All', PRODUCT_GROUP: '', PT_ID: -1, SUP_ID: -1 })
  console.log(carSuppliersProducts.value)

  const brands
    = carSuppliersProducts.value
    && uniq(carSuppliersProducts.value.map(item => item.SUP_BRAND))

  console.log(brands)
  brandStore.setBrands(brands)
  brandStore.setCarSupplierProducts(carSuppliersProducts.value)
  loading.value = false
})

watch([carSuppliersProducts, () => brandStore.selectedBrandIndex], async () => {
  // no brand select the user erase the select
  if (brandStore.selectedBrandIndex < 0)
    return

  if (carSuppliersProducts.value.length > 0) {
    noDataFound.value = false
    try {
      loading.value = true

      if (brandStore.selectedBrandIndex == 0) {
        // if selected brand = all

        await getByPartNumber(partNumber.value, searchby.value, route.query.parttype)

        if (articles.value.length > 0) {
          searchResults.value = articles.value
          filteredSearchResults.value = articles.value
          loading.value = false
        }
        else {
          loading.value = false
          noDataFound.value = true
          searchResults.value = []
          filteredSearchResults.value = []
        }
      }
      else if (brandStore.selectedBrandIndex > 0) {
        // if selected brand != all
        await getByPartNumber(partNumber.value, searchby.value, route.query.parttype,
          carSuppliersProducts.value[brandStore.selectedBrandIndex].SUP_ID)

        if (articles.value.length > 0) {
          searchResults.value = articles.value
          filteredSearchResults.value = articles.value
          loading.value = false
        }
        else {
          loading.value = false
          noDataFound.value = true
          searchResults.value = []
          filteredSearchResults.value = []
        }
      }
    }
    catch (e) {
      // console.log(e);
      loading.value = false
    }
  }
  else {
    noDataFound.value = true
    searchResults.value = []
    filteredSearchResults.value = []
  }
})
watch(
  () => route.query,
  async () => {
    console.log(route.query.ptid)
    if (route.query.ptid) {
      loading.value = true
      await getByPartNumber(partNumber.value, searchby.value, route.query.parttype, -1, route.query.ptid)

      //   carSuppliersProducts.value = articles.value.map(item => ({
      //     SUP_BRAND: item.ARL_BRA_BRAND,
      //     PRODUCT_GROUP: item.PRODUCT_GROUP,
      //     PT_ID: item.PT_ID,
      //     SUP_ID: item.ARL_BRA_ID,
      //   }))

      //   carSuppliersProducts.value.unshift({ SUP_BRAND: 'All', PRODUCT_GROUP: '', PT_ID: -1, SUP_ID: -1 })
      //   console.log(carSuppliersProducts.value)

      //   const brands
      // = carSuppliersProducts.value
      // && uniq(carSuppliersProducts.value.map(item => item.SUP_BRAND))

      //   console.log(brands)
      //   brandStore.setBrands(brands)
      //   brandStore.setCarSupplierProducts(carSuppliersProducts.value)

      if (articles.value.length > 0) {
        searchResults.value = articles.value
        filteredSearchResults.value = articles.value
        loading.value = false
      }
      else {
        loading.value = false
        noDataFound.value = true
        searchResults.value = []
        filteredSearchResults.value = []
      }
      loading.value = false
    }
  },
)
</script>

<template>
  <div>
    <div
      v-loading.fullscreen.lock="loading"
      class="flex flex-col md:flex-row w-full gap-5"
    >
      <div class="w-full md:1/2 lg:2/3 space-y-4">
        <div
          v-if="noDataFound"
          class="flex flex-col rounded-md"
        >
          <p class="text-xl text-center font-bold">
            Unfortunately, we could not find any article related to your search
          </p>
        </div>

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
              route.query.searchby === 'excat' ? result.PRODUCT_GROUP : result.ART_DES
            "
            :article="result"
            :image="result.ART_MEDIA_FILE_NAME ? `${S3_STORAGE_IMAGE}articles.img/IMAGES/${
              result.ART_SUP_ID
            }/${result.ART_MEDIA_FILE_NAME}` : null"
          />
        </div>
        <div class="text-center mt-5">
          <VPagination
            v-model="currentPage"
            :length="Math.ceil(searchResults.length / itemsPerPage)"
            :total-visible="10"
          />
        </div>
      </div>
    </div>
  </div>
</template>
