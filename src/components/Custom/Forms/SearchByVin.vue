<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'

import { isEmpty } from 'lodash'
import CarInfo from '../Results/CarInfo.vue'
import VinInfo from '../Results/VinInfo.vue'
import useVins from '@/composables/vins'
import useCarStore from '@/store/car'
import useCars from '@/composables/cars'

const props = defineProps({
  isCustom: String,
})

const router = useRouter()
const store = useCarStore()
const { carData, getCarInfo } = useCars()

const { loading, error, searchData, noDataFound, getByVins, searchDataTn } = useVins()

const vinInput: Ref<string> = ref('')

const hadleSearchByVin = async () => {
  error.value = ''
  if (vinInput.value === '') {
    error.value = 'VIN number is required'

    return
  }

  if (vinInput.value.length !== 17) {
    error.value = 'VIN number is 17 characters long'

    return
  }
  loading.value = true
  await getByVins(vinInput.value)
}

const handleRedirect = async () => {
  store.setFilterLevel(1)

  const params = {
    name: 'Categories',
    params: { carId: searchData.value.carId, targetType: store.carType },
  }

  if (props.isCustom) {
    params.query = { filtercat: props.isCustom }
  }
  (await searchData.value)
    && router.push(params)
}

watch(searchData, async () => {
  console.log(searchData.value)
  if (searchData.value) {
    await getCarInfo({
      car: searchData.value.carId,
      selectedType: store.carType,
    })
  }
})

const reset = () => {
  searchData.value = null
  searchDataTn.value = null
  vinInput.value = ''
}

defineExpose({
  reset,
})
</script>

<template>
  <div class="vehicle-search">
    <div class="w-full flex flex-col md:flex-row flex-wrap gap-4">
      <div class="w-full md:w-1/3">
        <label>Search by Vin</label>
        <div class="vin-input">
          <ElInput
            v-model.trim="vinInput"
            placeholder="WAUBH54B11N111054"
            class="input-with-btn"
          >
            <template #append>
              {{ vinInput.length }}
            </template>
          </ElInput>
        </div>

        <p
          v-if="error"
          class="text-red-500 text-sm"
        >
          {{ error }}
        </p>
      </div>
      <div
        v-if="searchData"
        class="w-full md:w-1/2"
      >
        <VinInfo :vindata="searchDataTn" />
      </div>
    </div>
    <div>
      <ElButton
        class="btn"
        icon="search"
        @click="hadleSearchByVin"
      >
        Search
      </ElButton>
    </div>
    <div
      v-if="loading"
      class="flex justify-center"
    >
      <VProgressCircular
        :size="35"
        :width="6"
        color="primary"
        indeterminate
      />
    </div>
    <div v-if="!isEmpty(carData)">
      <CarInfo :car-details="carData" />
      <div
        v-if="$route.path === '/home'"
        class="pt-5"
      >
        <VBtn
          color="#2d4aae"
          append-icon="mdi-arrow-right"
          class="text-white"
          @click="handleRedirect"
        >
          Go to categories
        </VBtn>
      </div>
    </div>
    <!--
      <div v-if="noDataFound">
      <p>NO DATA FOUND</p>
      </div>
    -->
  </div>
</template>

<style scoped>
.vehicle-search {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.el-input {
  inline-size: 100%;
}

label {
  font-weight: normal;
  margin-block-end: 5px;
  padding-block: 5px;
  padding-inline: 0;
}
</style>
