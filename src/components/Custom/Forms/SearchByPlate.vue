<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import LabeledSwitch from '../../Custom/Switches/LabeledSwitch.vue'
import CarInfo from '../Results/CarInfo.vue'
import VinInfo from '../Results/VinInfo.vue'
import usePlates from '@/composables/plates'
import useCars from '@/composables/cars'
import useCarStore from '@/store/car'

const props = defineProps({
  isCustom: String,
})

const router = useRouter()

const { searchData, loading, getByPlates, noDataFound } = usePlates()
const { getCarInfo, carData } = useCars()
const carStore = useCarStore()

const plate: Ref<string> = ref('')
const serie: Ref<string> = ref('')
const plateErr: Ref<string> = ref('')
const serieErr: Ref<string> = ref('')
const plateType: Ref<string> = ref('TU')

const setVehiclePlateType = (value: string) => {
  reset()
  plateType.value = value
}

const handleSearchByPlate = async () => {
  serieErr.value = ''
  plateErr.value = ''
  if (plateType.value === 'TU') {
    if (serie.value === '') {
      serieErr.value = 'Serie code is required'

      return
    }
    if (plate.value === '') {
      plateErr.value = 'Plate number is required'

      return
    }
  }
  else {
    if (plate.value === '') {
      plateErr.value = 'Plate number is required'

      return
    }
  }

  await getByPlates((plateType.value === 'RS') ? { plate: plate.value, plateType: plateType.value } : { plate: plate.value, serie: serie.value, plateType: plateType.value })
  console.log(searchData.value)
}

watch(searchData, async () => {
  if (searchData.value) {
    await getCarInfo({
      car: searchData.value.data.carId,
      selectedType: carStore.carType,
    })
  }
})

const handleRedirect = () => {
  const params = {
    name: 'Categories',
    params: { carId: searchData.value.data.carId, targetType: carStore.carType },
  }

  if (props.isCustom)
    params.query = { filtercat: props.isCustom }

  router.push(params)
}

const reset = () => {
  serieErr.value = ''
  plateErr.value = ''
  plate.value = ''
  serie.value = ''
  searchData.value = null
}

defineExpose({
  reset,
})
</script>

<template>
  <div class="vehicle-search">
    <div class="w-full md:w-6/6">
      Search by Plate
    </div>
    <div>
      <LabeledSwitch
        v-model.trim="plateType"
        :titles="['TU', 'RS']"
        @set-switch-value="setVehiclePlateType"
      />
    </div>
    <div class="w-full flex flex-col md:flex-row flex-wrap gap-4 md:gap-0">
      <div
        v-if="plateType === 'TU'"
        class="w-full md:w-1/6"
      >
        <div class="flex flex-wrap">
          <ElInput
            v-model="serie"
            type="number"
            :placeholder="plateType === 'TU' ? `Series : 156` : '999999'"
            class="w-full"
          />
        </div>
        <p
          v-if="serieErr"
          class="text-red-500 text-sm"
        >
          {{ serieErr }}
        </p>
      </div>
      <div class="w-full md:w-20">
        <div class="flex flex-wrap">
          <span class="inline-flex items-center rounded-md bg-gray-50 px-5 py-3 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {{ plateType }}</span>
        </div>
      </div>

      <div class="w-full md:w-1/6">
        <div class="flex flex-wrap">
          <ElInput
            v-model="plate"
            type="number"
            placeholder="Number : 2999"
            class="w-full"
          />
        </div>
        <p
          v-if="plateErr"
          class="text-red-500 text-sm"
        >
          {{ plateErr }}
        </p>
      </div>
      <div
        v-if="searchData"
        class="w-full md:w-1/2"
      >
        <VinInfo :vindata="searchData.data" />
      </div>
    </div>
    <div>
      <ElButton
        class="btn"
        icon="search"
        @click="handleSearchByPlate"
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
    <!--
      <div v-if="noDataFound">
      <p>NO DATA FOUND</p>
      </div>
    -->
    <div v-if="carData">
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
