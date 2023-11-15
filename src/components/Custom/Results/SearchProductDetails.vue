<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'
import PartDetailsCard from '../cards/PartDetailsCard.vue'
import { S3_STORAGE_IMAGE, SINGLE_ARTICLE } from '@/composables/constant'
import { checkIfImageExists } from '@/utils'

const props = defineProps(['artId', 'artNumber', 'supId'])

const articleData: Ref<any> = ref(null)
const components: Ref<{ CRITERIA_NAME: string; CRITERIA_VALUE: string }[]> = ref([])
const documents: Ref<any> = ref(null)
const specifications: Ref<any[]> = ref([])
const loading: Ref<boolean> = ref(false)
const imageUrl: Ref<string> = ref('')

const quantity: Ref<number> = ref(1)

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

    const response = await axios.get(SINGLE_ARTICLE, {
      params: {
        ART_ARTICLE_NR: props.artNumber,
        ART_ID: props.artId,
        SUP_ID: props.supId,
      },
    })

    const responseData = response.data

    console.log('RESPOS:', responseData.data)
    articleData.value = responseData.data.details
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

watch(articleData, async () => {
  if (
    await checkIfImageExists(
      `${S3_STORAGE_IMAGE}articles.img/IMAGES/${articleData.value[0]?.ART_SUP_ID}/${documents.value[0]?.ART_MEDIA_FILE_NAME}`,
    )
  ) {
    imageUrl.value = `${S3_STORAGE_IMAGE}articles.img/IMAGES/${articleData.value[0]?.ART_SUP_ID}/${documents.value[0]?.ART_MEDIA_FILE_NAME}`
  }
  else {
    imageUrl.value = `${S3_STORAGE_IMAGE}articles.img/article_img_not_found.png`
    console.log(imageUrl.value)
  }
})

const eancode = computed(() => {
  return articleData.value.EAN_NUMBERS ? articleData.value.EAN_NUMBERS.split(' ') : ''
})
</script>

<template>
  <div v-loading.fullscreen.lock="loading" />
  <div
    v-if="articleData"
    class="space-y-4"
  >
    <div class="pt-4">
      <h2 class="font-bold blue-text text-3xl">
        {{ articleData[0].ART_PRODUCT_NAME }} {{ articleData[0].ART_ARTICLE_NR }}
      </h2>
      <p class="font-semibold text-lg my-2">
        {{ articleData[0].ART_SUP_BRAND }}
      </p>
    </div>
    <VCard style="max-height: 70vh; padding: 20px; overflow-y: auto;">
      <PartDetailsCard
        :image="documents"
        :ean-code="eancode[1]"
        :status="articleData.ART_STATUS_TEXT"
        :delivery-unit="articleData.ACS_PACK_UNIT"
        :article-data="articleData"
      />
    </VCard>
    <!--
      <v-card style="max-height: 40vh; overflow-y: auto; padding: 20px">
      <div v-if="specifications.length > 0" class="w-full flex flex-col gap-4">
      <h2 class="font-bold text-2xl blue-text">Vehicle Specifications</h2>
      <div v-for="attr in specifications" :key="attr.CRITERIA_NAME" class="w-full flex">
      <div class="w-1/2">
      <h3>{{ attr.CRITERIA_NAME }}</h3>
      </div>
      <div class="w-1/2">
      <p>{{ attr.CRITERIA_VALUE }}</p>
      </div>
      </div>
      </div>
      </v-card>
    -->
    <VCard
      style="
        display: flex;
        max-height: 30vh;
        padding: 20px;
        margin-bottom: 10px;
        overflow-y: auto;
"
    >
      <div class="w-1/2 flex items-center gap-3">
        <ElInputNumber
          v-model="quantity"
          :min="1"
          :max="10"
          class="mx-0"
          @change="handleChange"
        />
      </div>
      <div class="w-1/2">
        <VBtn
          color="#242a64"
          prepend-icon="mdi-cart"
          class="text-white"
          @click="handleAddToCart"
        >
          Add To Cart
        </VBtn>
      </div>
    </VCard>
  </div>
</template>
