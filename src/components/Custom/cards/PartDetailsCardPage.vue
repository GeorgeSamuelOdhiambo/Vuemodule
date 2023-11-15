<!-- eslint-disable vue/require-prop-types -->
<script setup lang="ts">
import { S3_STORAGE_IMAGE } from '@/composables/constant'
import { checkIfImageExists } from '@/utils'

const props = defineProps([
  'articleData',
])

const truncate: Ref<boolean> = ref(true)
const videos: Ref<any> = ref([])
const articleDocuments: Ref<any> = ref([])
const imageUrl: Ref<string> = ref('')

onMounted(async () => {
  console.log(props)
  articleDocuments.value = props.articleData.documents
})

const truncateText = () => {
  truncate.value = !truncate.value
}
</script>

<template>
  <div class="w-full">
    <div
      v-if="props.articleData.details[0]"
      class="flex flex-col md:flex-row gap-6 w-full items-start mb-10"
    >
      <div class="w-full md:w-2/4">
        <div v-if="articleDocuments && articleDocuments.length > 0">
          <ElCarousel
            height="500px"
            :autoplay="false"
          >
            <template
              v-for="(item, index) in articleDocuments"
              :key="index"
            >
              <!-- display only images in carousel 3 for photo : 4 for picture -->
              <ElCarouselItem v-if="item.ART_MEDIA_TYPE === 3 || item.ART_MEDIA_TYPE === 4">
                <ElImage

                  referrerpolicy="no-referrer"
                  :src="checkIfImageExists(
                    `${S3_STORAGE_IMAGE}articles.img/IMAGES/${item.ART_MEDIA_SUP_ID}/${item.ART_MEDIA_FILE_NAME}`,
                  ) ? `${S3_STORAGE_IMAGE}articles.img/IMAGES/${item.ART_MEDIA_SUP_ID}/${item.ART_MEDIA_FILE_NAME}`
                    : `${S3_STORAGE_IMAGE}articles.img/article_img_not_found.png`"
                >
                  <template #error>
                    <div class="image-slot">
                      <ElImage :src="`${S3_STORAGE_IMAGE}articles.img/article_img_not_found.png`" />
                    </div>
                  </template>
                </ElImage>
              </ElCarouselItem>
            </template>
          </ElCarousel>
        </div>
        <div v-else>
          <ElImage :src="`${S3_STORAGE_IMAGE}articles.img/article_img_not_found.png`" />
        </div>
      </div>

      <div class="w-full md:w-1/3 space-y-4 py-3 px-8 flex flex-col justify-center mt-5">
        <!--
          <p>
          {{
          props.props.articleData.details[0].ACS_PACK_UNIT
          ? `Pack Unit: ${props.props.articleData.details[0].ACS_PACK_UNIT} `
          : null
          }}
          </p>
        -->
        <div v-if="props.articleData.details[0].ART_STATUS_TEXT">
          <p class="text-gray-800 font-bold">
            Article Status
          </p>
          <div class="flex items-center">
            <p>{{ props.articleData.details[0].ART_STATUS_TEXT }}</p>
            <div
              v-if="props.articleData.details[0].ART_STATUS_TEXT.toLowerCase().includes(`normal`)"
              class="flex items-center"
            >
              <VBadge
                color="success"
                dot
                content=""
                inline
              />
            </div>
            <div
              v-if="props.articleData.details[0].ART_STATUS_TEXT.toLowerCase().includes(`not`)"
              class="flex items-center"
            >
              <VBadge
                color="error"
                dot
                content=""
                inline
              />
            </div>
          </div>
        </div>
        <div v-if="props.articleData.details[0].ACS_PACK_UNIT">
          <p class="text-gray-800 font-bold">
            Delivery Unit
          </p>
          <p>{{ props.articleData.details[0].ACS_PACK_UNIT }}</p>
        </div>
        <p>
          {{
            props.articleData.details[0].ACS_QUANTITY_PER_UNIT
              ? `quantity Per Unit: ${props.articleData.details[0].ACS_QUANTITY_PER_UNIT} `
              : null
          }}
        </p>
        <p>
          {{
            props.articleData.details[0].ACS_STATUS_DATE
              ? `Status Date: ${props.articleData.details[0].ACS_STATUS_DATE} `
              : null
          }}
        </p>
        <p>
          {{
            props.articleData.details[0].ART_PRODUCT_NAME
              ? `Product Name: ${props.articleData.details[0].ART_PRODUCT_NAME} `
              : null
          }}
        </p>
        <p>
          {{
            props.articleData.details[0].EAN_NUMBERS
              ? `EAN Number: ${props.articleData.details[0].EAN_NUMBERS}`
              : null
          }}
        </p>
        <p
          :class="truncate ? 'd-inline-block text-truncate' : ''"
          :style="truncate ? 'max-height: 200px;' : ''"
          @click=" truncateText"
        >
          {{
            props.articleData.details[0].ART_INFO ? `Article Info: ${props.articleData.details[0].ART_INFO} ` : null
          }}
        </p>
        <p
          :class="truncate ? 'd-inline-block text-truncate' : ''"
          :style="truncate ? 'max-height: 200px;' : ''"
          @click=" truncateText"
        >
          {{
            props.articleData.details[0].ARTICLE_CRITERIA
              ? `Article Criteria: ${props.articleData.details[0].ARTICLE_CRITERIA} `
              : null
          }}
        </p>
        <!--
          <p>
          {{
          props.articleData.details[0].ART_SUP_BRAND
          ? `Pack Unit: ${props.articleData.details[0].ART_SUP_BRAND} `
          : null
          }}
          </p>
        -->
      </div>
    </div>
    <div
      v-if="videos.length"
      class="w-full flex flex-wrap justify-center my-auto"
    >
      <VCarousel

        :show-arrows="false"
        hide-delimiter-background
      >
        <VCarouselItem
          v-for="(item, index) in videos"
          :key="index"
        >
          <div class="w-full h-full">
            <iframe
              style="width: 100%;height: 100%;"
              :src="item"
            />
          </div>
        </VCarouselItem>
      </VCarousel>
      <!--
        <div v-for="item in videos" :key="item" class="mx-4 w-1/3 my-5">

        <video width="480" height="320" controls>
        <source :src="item?.ART_MEDIA_SOURCE" type="video/mp4" />
        Your browser does not support the video tag.
        </video>
        </div>
      -->

      <!-- <img :src="imageUrl" class="w-full" alt="Product" /> -->
    </div>
  </div>
</template>
