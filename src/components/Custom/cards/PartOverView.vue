<!-- eslint-disable vue/require-prop-types -->
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import useCartStore from '../../../store/cart'
import useCarStore from '../../../store/car'
import SearchProductDetailsTab from '../Results/SearchProductDetailsTab.vue'
import { S3_STORAGE_IMAGE } from '@/composables/constant'
import { checkIfImageExists } from '@/utils'

const props = defineProps(['image', 'brand', 'supId', 'article', 'productName'])

const router = useRouter()
const store = useCartStore()
const storeCar = useCarStore()

const route = useRoute()

const cartObject: Ref<any> = ref({
  name: '',
  quantity: 1,
  price: 0,
})

const showModal: Ref<boolean> = ref(false)
const imageUrl: Ref<string> = ref('')
const quantity: Ref<number> = ref(1)

onMounted(async () => {
  if (props.article.ART_MEDIA_FILE_NAME && props.image) {
    if (await checkIfImageExists(props.image))
      imageUrl.value = props.image

    else
      imageUrl.value = `${S3_STORAGE_IMAGE}articles.img/article_img_not_found.png`
  }
  else { imageUrl.value = `${S3_STORAGE_IMAGE}articles.img/article_img_not_found.png` }
})

const handleAddToCart = () => {
  cartObject.value = { ...cartObject.value, name: props.productName }
  store.addToCart(cartObject.value)
}

const handleViewDetails = () => {
  console.log(props)
  router.push({
    name: 'Product Details',
    params: {
      artId: props.article.ART_ID,
      artNumber: props.article.ART_ARTICLE_NR,
      supId: props.supId,
      carId: route.params.carId,
    },
    query: { ...route.query, ...{ kind: props.article.ARL_KIND ? props.article.ARL_KIND : 1 } },
  })
}

const showDetailModal = () => {
  showModal.value = true
}

const closeDetailModal = () => {
  showModal.value = false
}
</script>

<template>
  <div class="flex flex-col md:flex-row items-center p-5 gap-4 w-full rounded-md shadow-md bg-white">
    <div class="w-full md:w-1/3 h-40 p-4 flex items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-95">
      <VImg

        class="rounded-md cursor-pointer"

        :src="imageUrl"
        @click="handleViewDetails"
      />
    </div>

    <div class="w-full md:2/3 py-3 flex flex-col md:flex-row gap-5">
      <!-- <div class="w-2/3 space-y-4" @click="handleViewDetails"> -->
      <div class="w-2/3 space-y-4">
        <div
          class="font-bold underline text-black cursor-pointer"
          @click="handleViewDetails"
        >
          {{ article.ART_ARTICLE_NR }}

          {{ props.productName }} <VIcon icon="mdi-information-slab-circle-outline" />
        </div>
        <span v-if="article.ARL_KIND">
          <ElIcon
            v-if="article.ARL_KIND === 1"
            :size="18"
          >
            <CircleCheck />
          </ElIcon>
        </span>
        <p><span class="font-bold">SUPPLIER BRAND:</span> {{ props.brand }}</p>
        <p v-if="article.ART_STATUS_TEXT">
          <span class="font-bold">STATUS:</span> {{ article.ART_STATUS_TEXT }}
        </p>
        <p>{{ article.DESCRIPTIONS }}</p>
        <!-- <p>{{ article.ART_INFO }}</p> -->
        <p>{{ article.LA_ARTICLE_CRITERIA }}</p>
      </div>
      <div class="w-1/3 flex flex-col items-end gap-2 md:gap-3">
        <div class="flex items-center justify-between">
          <ElSelect
            v-model="quantity"
            class="m-2 w-[100px]"
            placeholder="1"
          >
            <ElOption
              v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              :key="item"
              :label="item"
              :value="item"
            />
          </ElSelect>

          <div>
            <VBtn
              color="#2d4aae"
              prepend-icon="mdi-cart"
              class="text-white w-[160px] my-3"
              @click="handleAddToCart"
            >
              Add to cart
            </VBtn>
            <VBtn
              color="white"
              prepend-icon="mdi-eye"
              class="text-[#2d4aae] w-[160px] border-2 border-[#2d4aae]"
              @click.stop="handleViewDetails"
            >
              View Detail
            </VBtn>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ElDialog
    v-model="showModal"
    :title="`${props.article.ART_ARTICLE_NR} ${props.article.ART_DES}`"
  >
    <SearchProductDetailsTab
      :art-id="props.article.ART_ID"
      :art-number="props.article.ART_ARTICLE_NR"
      :sup-id="props.article.ARL_KIND === 1 ? props.article.ARL_BRA_ID : props.article.ART_SUP_ID"
    />
  </ElDialog>
</template>
