<!-- eslint-disable vue/require-prop-types -->
<script setup lang="ts">
import { pickBy } from 'lodash'
import useCarStore from '@/store/car'

// const props = defineProps(['carDetails'])
const carStore = useCarStore()

const newCarData = computed(() => {
  if (
    carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_START
    && carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_END
  ) {
    carStore.carInfo.PCS_CONSTRUCTION_YEAR
      = `${carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_START.split('-')[1]
      }.${
        carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_START.split('-')[0]
      } - ${
        carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_END.split('-')[1]
      }.${
        carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_END.split('-')[0]}`

    delete carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_START
    delete carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_END
  }
  if (
    carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_START
    && !carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_END
  ) {
    carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_START
      = `${carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_START.split('-')[1]
      }.${
        carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_START.split('-')[0]}`
  }
  if (
    !carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_START
    && carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_END
  ) {
    carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_END
      = `${carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_END.split('-')[1]
      }.${
        carStore.carInfo.PCS_CONSTRUCTION_INTERVAL_END.split('-')[0]}`
  }

  return pickBy(carStore.carInfo, (value: any) => value !== null)
})
</script>

<template>
  <div v-if="newCarData">
    <h2 class="pb-4 text-xl font-semibold">
      Car info
    </h2>
    <div class="flex flex-col md:flex-row flex-wrap w-full gap-3">
      <div
        v-for="(value, key) in newCarData"
        :key="key"
        class="w-full md:w-[32%]"
      >
        <p v-if="value !== null">
          {{
            key === "TYPEL"
              ? key
              : key.toString().slice(3).replace(/_/g, " ").replace("-00", "")
          }}: {{ value.toString().replace("-00", "").replace(".0000", "") }}
        </p>
      </div>
    </div>
  </div>
</template>
