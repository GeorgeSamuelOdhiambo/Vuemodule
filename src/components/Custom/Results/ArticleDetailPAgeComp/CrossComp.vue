<script setup lang="ts">
import axios from 'axios'
import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { groupBy } from 'lodash'
import { useRoute } from 'vue-router'
import { ARTICLE_CROSS } from '@/composables/constant'

const route = useRoute()
const loading: Ref<boolean> = ref(false)
const cross: Ref<any> = ref(null)

onMounted(async () => {
  try {
    loading.value = true

    const response = await axios.get(ARTICLE_CROSS, {
      params: {
        ART_ARTICLE_NR: route.params.artNumber,
        ART_ID: route.params.artId,
        SUP_ID: route.params.supId,
      },
    })

    cross.value = response.data

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
</script>

<template>
  <div>
    <ElDescriptions
      v-if="cross && cross.filter(el => el.ARL_KIND === 3).length > 0"
      direction="vertical"
      :column="1"
      border
    >
      <ElDescriptionsItem label="Original Codes">
        <div
          class="overflow-y-auto   	"
          style="height: 200px;"
        >
          <ElCollapse>
            <ElCollapseItem
              v-for="(crossbrand, index) in groupBy(cross.filter(el => el.ARL_KIND === 3), 'ART_SUP_BRAND') "
              :key="index"
              :title="index"
              :name="index"
            >
              <div
                v-for="data in crossbrand"
                :key="data.ART_ID"
                class="flex h-auto w-full flex-nowrap"
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
                  <span v-if="data.ART_PRODUCT_NAME">  {{ data.ART_PRODUCT_NAME }}</span>
                </div>
                <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                  <span v-if="data.ART_SUP_BRAND">
                    {{ data.ART_SUP_BRAND }}
                  </span>
                </div>
              </div>
            </ElCollapseItem>
          </ElCollapse>
        </div>
      </ElDescriptionsItem>
    </ElDescriptions>

    <ElDescriptions
      v-if="cross && cross.filter(el => el.ARL_KIND !== 3).length > 0"
      direction="vertical"
      :column="1"
      border
    >
      <ElDescriptionsItem label="Cross Codes">
        <div
          class="overflow-y-auto   "
          style="height: 200px;"
        >
          <ElCollapse>
            <ElCollapseItem
              v-for="(crossbrand, index) in groupBy(cross.filter(el => el.ARL_KIND !== 3), 'ART_SUP_BRAND') "
              :key="index"
              :title="index"
              :name="index"
            >
              <div
                v-for="data in crossbrand"
                :key="data.ART_ID"
                class="flex h-auto w-full flex-nowrap"
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
                  <span v-if="data.ART_PRODUCT_NAME">  {{ data.ART_PRODUCT_NAME }}</span>
                </div>
                <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                  <span v-if="data.ART_SUP_BRAND">
                    {{ data.ART_SUP_BRAND }}
                  </span>
                </div>
              </div>
            </ElCollapseItem>
          </ElCollapse>
        </div>
      </ElDescriptionsItem>
    </ElDescriptions>
  </div>
</template>
