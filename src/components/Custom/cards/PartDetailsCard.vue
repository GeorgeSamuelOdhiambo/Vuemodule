<!-- eslint-disable vue/require-prop-types -->
<script setup lang="ts">
import { S3_STORAGE_IMAGE } from '@/composables/constant'

const props = defineProps([
  'image',
  'title',
  'eanCode',
  'price',
  'status',
  'deliveryUnit',
  'articleData',
])

const items: Ref<any> = ref([])

console.log('Images: ', props.image[0])
onMounted(async () => {
  if (
    props.image

  // await checkIfImageExists(
  //   `${S3_STORAGE_IMAGE}articles.img/IMAGES/${props.articleData[0]?.ART_SUP_ID}/${props.image[0]?.ART_MEDIA_FILE_NAME}`
  // )
  ) {
    props.image?.map((item: any) =>
      item.ART_MEDIA_FILE_NAME
        ? items.value.push(
          `${S3_STORAGE_IMAGE}/${props.articleData[0]?.ART_SUP_ID}/${item?.ART_MEDIA_FILE_NAME}`,
        )
        : items.value.push(`${S3_STORAGE_IMAGE}articles.img/article_img_not_found.png`),
    )
  }
  else { items.value = `${S3_STORAGE_IMAGE}articles.img/article_img_not_found.png` }

  console.log(items)
})
</script>

<template>
 
  <div class="w-full">
    <div
      v-if="props.articleData"
      class="flex flex-col md:flex-row gap-6 w-full items-start mb-10"
    >
      <div class="w-full md:w-1/2">
        <VCarousel
          :cycle="true"
          :interval="3000"
          :show-arrows="false"
          hide-delimiter-background
        >
          <VCarouselItem
            v-for="(item, index) in items"
            :key="index"
          >
            <img
              :src="item"
              alt="Slider Image"
            >
          </VCarouselItem>
        </VCarousel>
      </div>
      <div class="w-full md:w-1/2 space-y-4 py-3 px-8 flex flex-col justify-center mt-5">
        <!--
          <p>
          {{
          props.articleData[0].ACS_PACK_UNIT
          ? `Pack Unit: ${props.articleData[0].ACS_PACK_UNIT} `
          : null
          }}
          </p>
        -->
        <div v-if="articleData[0].ART_STATUS_TEXT">
          <p class="text-gray-800 font-bold">
            Article Status
          </p>
          <div class="flex items-center">
            <p>{{ articleData[0].ART_STATUS_TEXT }}</p>
            <div
              v-if="articleData[0].ART_STATUS_TEXT.toLowerCase().includes(`normal`)"
              class="flex items-center"
            >
              <VBadge
                color="success"
                dot
                content=""
                inline
              />
            </div>
          </div>
        </div>
        <div v-if="articleData[0].ACS_PACK_UNIT">
          <p class="text-gray-800 font-bold">
            Delivery Unit
          </p>
          <p>{{ articleData[0].ACS_PACK_UNIT }}</p>
        </div>
        <p>
          {{
            articleData[0].ACS_QUANTITY_PER_UNIT
              ? `quantity Per Unit: ${articleData[0].ACS_QUANTITY_PER_UNIT} `
              : null
          }}
        </p>
        <p>
          {{
            articleData[0].ACS_STATUS_DATE
              ? `Status Date: ${articleData[0].ACS_STATUS_DATE} `
              : null
          }}
        </p>

        <p>
          {{
            articleData[0].ART_PRODUCT_NAME
              ? `Product Name: ${articleData[0].ART_PRODUCT_NAME} `
              : null
          }}
        </p>
  
        <p>
          {{
            articleData[0].EAN_NUMBERS
              ? `EAN Number: ${articleData[0].EAN_NUMBERS}`
              : null
          }}
        </p>
        <p>
          {{
            articleData[0].ART_INFO ? `Article Info: ${articleData[0].ART_INFO} ` : null
          }}
        </p>
        <p>
          {{
            articleData[0].ARTICLE_CRITERIA
              ? `Article Criteria: ${articleData[0].ARTICLE_CRITERIA} `
              : null
          }}
        </p>
        <!--
          <p>
          {{
          articleData[0].ART_SUP_BRAND
          ? `Pack Unit: ${articleData[0].ART_SUP_BRAND} `
          : null
          }}
          </p>
        -->
      </div>
    </div>
  </div>
</template>
