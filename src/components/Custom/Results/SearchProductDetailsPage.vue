<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import PartDetailsCardPage from '../cards/PartDetailsCardPage.vue'
import CrossComp from '../Results/ArticleDetailPAgeComp/CrossComp.vue'
import ApplicabilityCarComp from '../Results/ArticleDetailPAgeComp/ApplicabilityCarComp.vue'
import { SINGLE_ARTICLE } from '@/composables/constant'

const props = defineProps(['artId', 'artNumber', 'supId'])
const route = useRoute()
const articleData: Ref<any> = ref(null)
const truncate: Ref<boolean> = ref(true)
const articleDetails: Ref<any> = ref(null)

const components: Ref<{ CRITERIA_NAME: string; CRITERIA_VALUE: string }[]> = ref([])
const documents: Ref<any> = ref(null)
const specifications: Ref<any[]> = ref([])
const loading: Ref<boolean> = ref(false)

const currentPage: Ref<number> = ref(1)
const itemsPerPage: Ref<number> = ref(10)

const filteredItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value

  return cross.value.slice(startIndex, endIndex)
})

const pagedItems = computed(() => {
  return filteredItems.value
})

const quantity: Ref<number> = ref(1)
const router = useRouter()

const handleChange = (value?: number) => {
  console.log(value)
}

const handleAddToCart = () => {
  /**
   * @todo implement add to cart
   */
}

onMounted(async () => {
  try {
    loading.value = true
    console.log(props)

    const response = await axios.get(SINGLE_ARTICLE, {
      params: {
        ART_ARTICLE_NR: route.params.artNumber,
        ART_ID: route.params.artId,
        SUP_ID: route.params.supId,
        ARL_KIND: route.query.kind,
      },
    })

    const responseData = response.data

    console.log('RESPOS:', responseData.data)
    articleData.value = responseData.data
    articleDetails.value = responseData.data.details
    components.value = responseData.data.components
    documents.value = responseData.data.documents

    specifications.value = responseData.data.specifications
    loading.value = false
  }
  catch (error: any) {
    console.log(error)
    loading.value = false
    if (error.response) {
      console.log(error)
    }
    else if (error.request) {
      console.log(error.request)
    }
    else {
      ElMessage({
        message: 'Oops! Something went wrong',
        showClose: true,
        type: 'error',
        customClass: 'font-bold',
      })
    }
  }
})

const truncateText = () => {
  truncate.value = !truncate.value
}

// origine : 04E129620  04E905601B  04E115561H
// adaptable : 534048010
</script>

<template>
  <div v-loading.fullscreen.lock="loading" />
  <div
    v-if="articleDetails"
    class="space-y-4"
  >
    <VCard style="padding: 20px;">
      <div class="pt-4">
        <h2 class="font-bold blue-text text-3xl">
          {{ route.params.artNumber }} {{ articleDetails[0].ART_PRODUCT_NAME }}
        </h2>
        <p class="font-semibold text-lg my-2">
          {{ articleDetails[0].ART_SUP_BRAND }}
        </p>
      </div>
      <PartDetailsCardPage :article-data="articleData" />
      <div class="mb-3 bg-gray-400 h-[1px]" />

      <div
        v-if="specifications.length > 0"
        class="w-full flex flex-col gap-4"
      >
        <h2 class="font-bold text-2xl blue-text">
          Article Attributes
        </h2>
        <div class="grid grid-cols-2 gap-1">
          <div
            v-for="attr in specifications"
            :key="attr.CRITERIA_NAME"
            class="w-full flex"
          >
            <div class="w-1/2">
              <h3>{{ attr.CRITERIA_NAME }}</h3>
            </div>
            <div class="w-1/2 cursor-pointer">
              <div
                :class="truncate ? 'd-inline-block text-truncate' : ''"
                :style="truncate ? 'max-width: 200px;' : ''"
                @click=" truncateText"
              >
                {{ attr.CRITERIA_VALUE }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3 bg-gray-400 h-[1px] my-5" />

      <CrossComp />
      <div class="mb-3 bg-gray-400 h-[1px] my-5" />
      <ApplicabilityCarComp />

      <div class="flex justify-end my-5">
        <div class="flex items-center gap-3">
          <ElInputNumber
            v-model="quantity"
            :min="1"
            :max="10"
            class="mx-5"
            @change="handleChange"
          />
        </div>
        <div class="ml-3">
          <VBtn
            color="#242a64"
            prepend-icon="mdi-cart"
            class="text-white"
            @click="handleAddToCart"
          >
            Add To Cart
          </VBtn>
        </div>
      </div>
    </VCard>
  </div>
</template>
