<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'

import { sortBy, uniq } from 'lodash'
import { useRoute } from 'vue-router'
import axios from 'axios'

import PartOverViewVue from '../cards/PartOverView.vue'
import useCars from '@/composables/cars'
import { ARTICLES_DOMAIN, S3_STORAGE_IMAGE } from '@/composables/constant'
import useBrandStore from '@/store/brands'
import useCarStore from '@/store/car'

interface IArticle {
  ART_ID: number
  ART_SUP_ID: number
  ART_SUP_BRAND: string
  ART_ARTICLE_NR: string
  ACS_STATUS_KV_KV: string
  ART_STATUS_TEXT: string
  DESCRIPTIONS: string
  ART_INFO: string
  LA_ARTICLE_CRITERIA: any
  ART_MEDIA_FILE_NAME: string
  ART_DES: string
}

const props = defineProps(['searchTreeId', 'carId'])

let resCarID = ''
const brandAll = false
const { getCarSuppliersProduct, carSuppliersProducts } = useCars()
const carSTore = useCarStore()
const brandStore = useBrandStore()

const route = useRoute()
const searchResults: Ref<IArticle[]> = ref([])

const loading: Ref<boolean> = ref(false)
const noDataFound: Ref<boolean> = ref(false)
const itemsPerPage: Ref<number> = ref(10)
const filteredSearchResults: Ref<IArticle[]> = ref([])

const currentPage: Ref<number> = ref(1)

// const filteredSearchResultsByAssemblyGroup = computed(() => {
//   return searchResults.value.filter((item: IArticle) => item.PRODUCT_GROUP.toLowerCase().includes(assemblyGroup.value.toLowerCase()))
// })

// watch(assemblyGroup, () => {
//   filteredSearchResults.value = filteredSearchResultsByAssemblyGroup.value
// })

const filteredItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value

  noDataFound.value = false
  loading.value = false

  return filteredSearchResults.value.slice(startIndex, endIndex)
})

const pagedItems = computed(() => {
  loading.value = false
  noDataFound.value = false

  return filteredItems.value
})

watch(
  () => route.params,
  async () => {
    noDataFound.value = false
    loading.value = true

    await getCarSuppliersProduct({
      carId: route.params.carId,
      strid: route.params.categoryId,
      selectedType: carSTore.carType,
    })

    const brands
    = carSuppliersProducts.value
    && uniq(carSuppliersProducts.value.map(item => item.SUP_BRAND))

    brandStore.setBrands(brands)
    brandStore.setCarSupplierProducts(carSuppliersProducts.value)
  },
)
onMounted(async () => {
  console.log(brandStore.selectedBrandIndex)
  noDataFound.value = false
  loading.value = true

  // Get the URL pathname
  const pathname = window.location.pathname

  // Split the pathname into segments
  const segments = pathname.split('/')

  resCarID = props.carId
  if (props.carId === undefined)

    resCarID = segments[(segments.length) - 1]

  await getCarSuppliersProduct({
    carId: route.params.carId,
    strid: props.searchTreeId,
    selectedType: carSTore.carType,
  })
  carSuppliersProducts.value = sortBy(carSuppliersProducts.value, ['SUP_BRAND'])

  if (carSuppliersProducts.value.length > 1)
    carSuppliersProducts.value.unshift({ SUP_BRAND: 'All', PRODUCT_GROUP: '', PT_ID: -1, SUP_ID: -1 })

  const brands
    = carSuppliersProducts.value
    && uniq(carSuppliersProducts.value.map(item => item.SUP_BRAND))

  brandStore.setBrands(brands)
  brandStore.setCarSupplierProducts(carSuppliersProducts.value)
})

watch([carSuppliersProducts, () => brandStore.selectedBrandIndex], async () => {
  if (brandStore.selectedBrandIndex < 0)
    return
  if (carSuppliersProducts.value.length > 0) {
    noDataFound.value = false

    // Get the URL pathname
    const pathname = window.location.pathname

    // Split the pathname into segments
    const segments = pathname.split('/')

    resCarID = props.carId
    if (props.carId === undefined)

      resCarID = segments[(segments.length) - 1]

    try {
      loading.value = true

      if (brandStore.selectedBrandIndex === 0) {
        // if selected brand = all
        console.log(carSuppliersProducts.value)

        const response = await axios.get(ARTICLES_DOMAIN, {
          params: {
            carid: resCarID,
            ptid: carSuppliersProducts.value[1].PT_ID,
            typeCar: route.params.targetType,
          },
        })

        console.log(carSuppliersProducts.value[1].PT_ID)

        const responseData = response.data
        if (responseData.length > 0) {
          searchResults.value = responseData
          filteredSearchResults.value = responseData
        }
        else {
          noDataFound.value = true
          searchResults.value = []
          filteredSearchResults.value = []
        }
      }
      else if (brandStore.selectedBrandIndex > 0) {
        // if selected brand != all
        const response = await axios.get(ARTICLES_DOMAIN, {
          params: {
            carid: resCarID,
            ptid: carSuppliersProducts.value[brandStore.selectedBrandIndex].PT_ID,
            suppid:
            carSuppliersProducts.value[brandStore.selectedBrandIndex].SUP_ID,
            typeCar: route.params.targetType,
          },
        })

        const responseData = response.data
        if (responseData.length > 0) {
          searchResults.value = responseData
          filteredSearchResults.value = responseData
        }
        else {
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
  }
})
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
            v-model="currentPage"
            :length="Math.ceil(searchResults.length / itemsPerPage)"
            :total-visible="10"
          />
        </div>
      </div>
    </div>
  </div>
</template>
