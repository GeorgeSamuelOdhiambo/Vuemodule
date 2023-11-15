<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { S3_STORAGE_IMAGE, SINGLE_ARTICLE } from '@/composables/constant'
import { checkIfImageExists } from '@/utils'

const props = defineProps(['artId', 'artNumber', 'supId', 'image'])

const articleData: Ref<any> = ref(null)
const components: Ref<{ CRITERIA_NAME: string; CRITERIA_VALUE: string }[]> = ref([])
const documents: Ref<{ ART_MEDIA_TYPE: string; ART_MEDIA_SOURCE: string }[]> = ref([])
const specifications: Ref<any[]> = ref([])
const cross: Ref<any[]> = ref([])
const loading: Ref<boolean> = ref(false)
const criterias: Ref<any[]> = ref([])
const applicabilltycar: Ref<any[]> = ref([])
const origapplicabilltycar: Ref<any[]> = ref([])

const imageUrl: Ref<string> = ref('')
const activeTab: Ref<string> = ref('info')

const selectedCar: Ref<any[]> = ref([])
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
  if (await checkIfImageExists(props.image))
    imageUrl.value = props.image
  else imageUrl.value = `${S3_STORAGE_IMAGE}articles.img/article_img_not_found.png`
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

    console.log(response)

    articleData.value = responseData.data.details[0]
    components.value = responseData.data.components
    documents.value = responseData.data.documents
    specifications.value = responseData.data.specifications
    criterias.value = responseData.data.criterias
    cross.value = responseData.data.cross
    applicabilltycar.value = responseData.data.appicabilitycars
    origapplicabilltycar.value = applicabilltycar.value
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
  if (await checkIfImageExists(articleData.value.ART_MEDIA_FILE_NAME)) {
    imageUrl.value = `${S3_STORAGE_IMAGE}articles.img/IMAGES/${articleData.value.ART_SUP_ID}/${articleData.value.ART_MEDIA_FILE_NAME}`
  }
  else {
    imageUrl.value = `${S3_STORAGE_IMAGE}articles.img/article_img_not_found.png`
    console.log(imageUrl.value)
  }
})

watch(selectedCar, async () => {
  if (selectedCar.value)
    applicabilltycar.value = origapplicabilltycar.value.filter(el => el.TYPEL.toLowerCase().toString().startsWith(selectedCar.value.toString().toLocaleLowerCase()))

  else
    applicabilltycar.value = origapplicabilltycar.value
})

const eancode = computed(() => {
  // return articleData.value.EAN_NUMBERS ? articleData.value.EAN_NUMBERS.split(' ') : ''
})

const goToArticle = (article: any) => {
  router.push({
    name: 'Product Details',
    params: {
      artId: article.ART_ID,
      artNumber: article.ART_ARTICLE_NR,
      supId: article.ART_SUP_ID,
    },
  })
}
</script>

<template>
  <div v-loading.fullscreen.lock="loading">
    <ElTabs
      v-if="articleData"
      v-model="activeTab"
    >
      <ElTabPane
        label="Info"
        name="info"
      >
        <ElDescriptions
          v-if="articleData"
          direction="vertical"
          :column="1"
          border
        >
          <ElDescriptionsItem label="Details">
            <div
              v-for="(data, key) in articleData "
              class="w-full md:w-full flex flex-col md:flex-row  "
            >
              <span v-if="data && key != 'ARTICLE_CRITERIA' && key != 'OEM_NUMBERS'">{{ key }} : {{ data }}</span>
            </div>
          </ElDescriptionsItem>
        </ElDescriptions>

        <ElDescriptions
          direction="vertical"
          :column="1"
          border
        >
          <ElDescriptionsItem label="Criterias">
            <div
              v-for="data in criterias"
              class="w-full md:w-full flex flex-col md:flex-row  "
            >
              {{ data.CRITERIA_NAME }} : {{ data.CRITERIA_VALUE }}
            </div>
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElTabPane>

      <ElTabPane
        label="Original Codes"
        name="origine"
      >
        <ElDescriptions
          direction="vertical"
          :column="1"
          border
        >
          <ElDescriptionsItem
            v-if="cross.length > 0"
            label="Origines"
          >
            <div
              v-for="data in cross.filter(el => el.ARL_KIND === 3)"
              :key="data.ART_ID"
              class="w-full md:w-full flex flex-col md:flex-row py-5 "
            >
              <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                <a
                  class="font-bold underline text-black"
                  target="_blank"
                  :href="`/my-search/product-details/${data.ART_ID}/${data.ART_ARTICLE_NR}/${data.ART_SUP_ID}`"
                >

                  {{ data.ART_ARTICLE_NR }}

                </a>
              </div>
              <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                {{ data.ART_PRODUCT_NAME }}
              </div>
              <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                {{ data.ART_SUP_BRAND }}
              </div>
            </div>
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElTabPane>

      <ElTabPane
        label="Applicabillity"
        name="appli"
      >
        <ElDescriptions
          direction="vertical"
          :column="1"
          border
        >
          <ElDescriptionsItem
            v-if="cross.length > 0"
            label="cross"
          >
            <div
              v-for="data in cross.filter(el => el.ARL_KIND !== 3)"
              :key="data.ART_ID"
              class="w-full md:w-full flex flex-col md:flex-row py-5 "
            >
              <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                <a
                  class="font-bold underline text-black"
                  target="_blank"
                  :href="`/my-search/product-details/${data.ART_ID}/${data.ART_ARTICLE_NR}/${data.ART_SUP_ID}`"
                >

                  {{ data.ART_ARTICLE_NR }}

                </a>
              </div>
              <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                {{ data.ART_PRODUCT_NAME }}
              </div>
              <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                {{ data.ART_SUP_BRAND }}
              </div>
            </div>
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElTabPane>

      <ElTabPane
        label="Vehicle Linkage"
        name="linkage"
      >
        <ElDescriptions
          direction="vertical"
          :column="1"
          border
        >
          <ElDescriptionsItem label="Cars">
            <div class="w-full md:w-full flex flex-col md:flex-row py-5 ">
              <VTextField
                v-model="selectedCar"
                label="Search Car"
                variant="outlined"
                clearable
              />
            </div>
            <div
              v-if="applicabilltycar.length > 0"
              class="overflow-y-auto h-screen	"
            >
              <div
                v-for="data in applicabilltycar "
                :key="data.PC_ID"
                class="w-full md:w-full flex flex-col md:flex-row py-5 "
              >
                <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                  <a
                    class="font-bold underline text-black"
                    target="_blank"
                    :href="`/my-search/${data.PC_ID}/PC`"
                  >

                    {{ data.TYPEL }}

                  </a>
                </div>
                <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                  {{ data.PC_ENG_CODES }}
                </div>
                <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                  <span v-if="data.PCS_CONSTRUCTION_INTERVAL_START">
                    {{ data.PCS_CONSTRUCTION_INTERVAL_START.toString().replace('-00', '') }}
                  </span>
                </div>
              </div>
            </div>
          </ElDescriptionsItem>
        </ElDescriptions>
      </ElTabPane>
      <ElTabPane
        label="Photo"
        name="photo"
      >
        <div
          v-if="documents.length > 0"
          class="grid gap-x-8 gap-y-4 grid-cols-3"
        >
          <div
            v-for="data in documents"
            :class="data.ART_MEDIA_TYPE === 4 ? 'col-span-2' : ''"
          >
            <ElImage
              v-if="data.ART_MEDIA_TYPE === 3"
              style="width: 200px;"
              :src="`${S3_STORAGE_IMAGE}articles.img/IMAGES/${data.ART_MEDIA_SUP_ID
              }/${data.ART_MEDIA_FILE_NAME}`"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="documents.map(el => `${S3_STORAGE_IMAGE}articles.img/IMAGES/${data.ART_MEDIA_SUP_ID}/${el.ART_MEDIA_FILE_NAME}`)"
              :initial-index="4"
              fit="cover"
            />

            <object
              v-if="data.ART_MEDIA_TYPE === 2"
              width="400"
              height="500"
              type="application/pdf"
              :data="`${S3_STORAGE_IMAGE}articles.img/IMAGES/${data.ART_MEDIA_SUP_ID
              }/${data.ART_MEDIA_FILE_NAME}?#zoom=85&scrollbar=0&toolbar=0&navpanes=0`"
            >
              <p>Failed to load PDF</p>
            </object>

            <iframe
              v-if="data.ART_MEDIA_TYPE === 4"
              width="700"
              :src="data.ART_MEDIA_SOURCE"
            />
          </div>
        </div>
      </ElTabPane>
    </ElTabs>
  </div>
</template>
<!--
  <template>
  <div v-loading.fullscreen.lock="loading" />
  <div v-if="articleData" class="space-y-4">
  <div class="pt-4">
  <h2 class="font-bold blue-text text-lg">
  {{ articleData[0].ART_SUP_BRAND }}
  </h2>
  <p>{{}}</p>
  </div>
  <v-card style="max-height: 30vh; overflow-y: auto; padding: 20px">
  <PartDetailsCard
  :image="props.image"
  :ean-code="eancode[1]"
  :status="articleData.ART_STATUS_TEXT"
  :delivery-unit="articleData.ACS_PACK_UNIT"
  :article-data="articleData"
  />
  </v-card>
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
  <v-card
  style="
  max-height: 40vh;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  margin-bottom: 10px;
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
  </v-card>
  </div>
  </template>
-->
