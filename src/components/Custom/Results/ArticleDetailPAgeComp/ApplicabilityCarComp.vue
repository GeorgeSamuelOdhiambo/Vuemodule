<script setup lang="ts">
import axios from 'axios'
import type { Ref } from 'vue'
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { groupBy } from 'lodash'
import { useRoute } from 'vue-router'
import { ARTICLE_APPLICABILITY_CAR } from '@/composables/constant'

const route = useRoute()
const loading: Ref<boolean> = ref(false)

const applicabilltycar: Ref<any[]> = ref([])
const origapplicabilltycar: Ref<any[]> = ref([])
const selectedCar: Ref<any[]> = ref([])

watch(selectedCar, async () => {
  if (selectedCar.value)
    applicabilltycar.value = origapplicabilltycar.value.filter(el => el.TYPEL.toLowerCase().toString().startsWith(selectedCar.value.toString().toLocaleLowerCase()))

  else
    applicabilltycar.value = origapplicabilltycar.value
})
onMounted(async () => {
  try {
    loading.value = true

    const response = await axios.get(ARTICLE_APPLICABILITY_CAR, {
      params: {
        ART_ARTICLE_NR: route.params.artNumber,
        ART_ID: route.params.artId,
        SUP_ID: route.params.supId,
      },
    })

    applicabilltycar.value = response.data

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
      v-if="applicabilltycar && applicabilltycar.length > 0"
      direction="vertical"
      :column="1"
      border
    >
      <ElDescriptionsItem label="Vehicle Linkage">
        <!-- <div class="w-full md:w-full flex flex-col md:flex-row py-5 ">
          <VTextField
            v-model="selectedCar"
            label="Search Car"
            variant="outlined"
            clearable
          />
        </div> -->
        <div
          class="overflow-y-auto"
          style="height: 200px;"
        >
          <ElCollapse>
            <ElCollapseItem
              v-for="(models, index) in groupBy(applicabilltycar, 'MFA_BRAND') "
              :key="index"
              :title="index"
              :name="index"
            >
              <div
                v-for="data in models"
                :key="data.PC_ID"
                class="flex h-auto w-full flex-nowrap"
              >
                <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                  <a
                    class="font-bold underline text-black"
                    target="_blank"
                    :href="`/my-search/PC/${data.PC_ID}`"
                  >

                    {{ data.TYPEL }}

                  </a>
                </div>
                <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                  <span v-if="data.PC_ENG_CODES">  {{ data.PC_ENG_CODES }}</span>
                </div>
                <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                  <span v-if="data.PCS_POWER_KW">  {{ data.PCS_POWER_KW }} KW</span>
                </div>
                <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                  <span v-if="data.PCS_POWER_PS">  {{ data.PCS_POWER_PS }} PS</span>
                </div>
                <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                  <span v-if="data.PCS_CAPACITY_TECH">  {{ data.PCS_CAPACITY_TECH }} CCM</span>
                </div>
                <div class="w-full md:w-1/3 flex flex-col md:flex-row  ">
                  <span v-if="data.PCS_CONSTRUCTION_INTERVAL_START">
                    {{ data.PCS_CONSTRUCTION_INTERVAL_START.toString().replace('-00', '') }}
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
