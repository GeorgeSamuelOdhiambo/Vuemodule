<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import PartOverViewVue from '../cards/PartOverView.vue'
import { BAR_CODE, S3_STORAGE_IMAGE } from '@/composables/constant'
import useBrandStore from '@/store/brands'
import useBrands from '@/composables/brands'

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

const route = useRoute()

// const { getCarSuppliersProduct, carSuppliersProducts } = useCars()

const { getArticlesbyproductandbrand, articles } = useBrands()

// const carSTore = useCarStore()
const brandStore = useBrandStore()
const router = useRouter()
const searchResults: Ref<IArticle[]> = ref([])

const loading: Ref<boolean> = ref(false)
const noDataFound: Ref<boolean> = ref(false)
const itemsPerPage: Ref<number> = ref(10)
const filteredSearchResults: Ref<IArticle[]> = ref([])

const currentPage: Ref<number> = ref(1)

// const groupid: Ref<any> = ref('')
// const brandid: Ref<any> = ref('')

// const filteredSearchResultsByAssemblyGroup = computed(() => {
//   return searchResults.value.filter((item: IArticle) => item.PRODUCT_GROUP.toLowerCase().includes(assemblyGroup.value.toLowerCase()))
// })

// watch(assemblyGroup, () => {
//   filteredSearchResults.value = filteredSearchResultsByAssemblyGroup.value
// })

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

  const resp = await axios.get(BAR_CODE, {
    params: {
      barcode: route.params.barcode,
    },
  })

  loading.value = false
  articles.value = resp.data.data
  console.log(articles.value)

  // const brands =
  //   carSuppliersProducts.value &&
  //   uniq(carSuppliersProducts.value.map((item) => item.SUP_BRAND));

  // brandStore.setBrands(brands);
  // brandStore.setCarSupplierProducts(carSuppliersProducts.value);
  loading.value = false
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

      const responseData = articles.value
      if (responseData.length > 0) {
        searchResults.value = responseData
        filteredSearchResults.value = responseData
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
            v-model="currentPage"
            :length="Math.ceil(searchResults.length / itemsPerPage)"
            :total-visible="10"
          />
        </div>
      </div>
    </div>
  </div>
</template>
