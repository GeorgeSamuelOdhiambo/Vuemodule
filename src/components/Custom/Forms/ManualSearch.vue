<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'
import CarInfo from '../Results/CarInfo.vue'
import TabButton from '../Buttons/TabButton.vue'
import useCarStore from '@/store/car'
import useManufacturers from '@/composables/manufacturers'
import useModels from '@/composables/models'
import useCars from '@/composables/cars'
import useManufacturesStore from '@/store/manufacturers'
import useEngineCodes from '@/composables/engineCodes'

const props = defineProps({
  isCustom: String,
})

interface IButton {
  title: string
  isActive: boolean
  icon: string
  type: string
}

const router = useRouter()
const route = useRoute()
const store = useCarStore()
const manufacturersStore = useManufacturesStore()
const { getManufacturers, manufacturersLoading } = useManufacturers()
const { getModels, models, modelsLoading } = useModels()

const {
  getCars,
  cars,
  carsLoading,
  carData,
  getCarInfo,
  noDataFound,
  carDataLoading,
} = useCars()

const { getEngineCodes, engineCodes, engineLoading } = useEngineCodes()

const selectedType: Ref<string> = ref('PC')

const buttons: Ref<IButton[]> = ref([
  { title: 'PC', isActive: false, icon: 'fa-car', type: 'PC' },
  { title: 'CV', isActive: false, icon: 'fa-bus-simple', type: 'CV' },
  { title: 'Motorcycle', isActive: false, icon: 'fa-motorcycle', type: 'MTB' },
  { title: 'Tractor', isActive: false, icon: 'fa-tractor', type: 'TRA' },
  { title: 'Engine', isActive: false, icon: 'fa-gears', type: 'ENG' },
  { title: 'Axle', isActive: false, icon: 'fa-arrows-left-right', type: 'AXL' },
])

const currentButton: Ref<string> = ref('PC')

const selectedManufacturer: Ref<string> = ref('')
const car: Ref<string> = ref('')
const model: Ref<string> = ref('')
const engineCode: Ref<string> = ref('')
const manufacturerErr: Ref<string> = ref('')
const carErr: Ref<string> = ref('')
const modelErr: Ref<string> = ref('')
const modelYear: Ref<string> = ref('')
const fuelType: Ref<string> = ref('')
const ccCapacity: Ref<string> = ref('')
const loading: Ref<boolean> = ref(false)
const carStore = useCarStore()

const handleRedirect = () => {
  loading.value = true
  carStore.setFilterLevel(1)

  const params = {
    name: 'Categories',
    params: { carId: car.value, targetType: selectedType.value },

  }

  if (props.isCustom)
    params.query = { filtercat: props.isCustom }

  setTimeout(() => {
    router.push(params)
  }, 100)
}

// onMounted(() => {

// })

const handleTypeClick = async (button: IButton) => {
  currentButton.value = button.title
  selectedType.value = button.type
  store.setCarType(selectedType.value)
  await getManufacturers(selectedType.value)
}

watchEffect(async () => {
  manufacturersLoading.value = false
  if (manufacturersStore.manufacturers.length === 0)
    await getManufacturers(selectedType.value)
})

watch(
  selectedManufacturer,
  async () =>
    await getModels({
      selectedManufacturer: selectedManufacturer.value,
      selectedType: selectedType.value,
    }),
)

watch(
  model,
  async () =>
    await getCars({ model: model.value, selectedType: selectedType.value }),
)

watch(selectedManufacturer, async () => {
  if (selectedType.value === 'ENG')
    await getEngineCodes(selectedManufacturer.value)
})

watch(car, async () => {
  await getCarInfo({ car: car.value, selectedType: selectedType.value })

  modelYear.value
    = carData.value
    && dayjs(carData.value.PCS_CONSTRUCTION_INTERVAL_START).format('YYYY')
  fuelType.value = carData.value && carData.value.PC_FUEL_TYPE

  if (route.path !== '/home') {
    router.push({
      name: 'Categories',
      params: { carId: car.value, targetType: selectedType.value },
    })
  }
})

watch(engineCode, async () => {
  await getCarInfo({ car: engineCode.value, selectedType: selectedType.value })
  modelYear.value
    = carData.value
    && dayjs(carData.value.PCS_CONSTRUCTION_INTERVAL_START).format('YYYY')
  fuelType.value = carData.value && carData.value.PC_FUEL_TYPE

  if (route.path !== '/home') {
    router.push({
      name: 'Categories',
      params: { carId: engineCode.value, targetType: selectedType.value },
    })
  }
})
watchEffect(() => {
  loading.value = carDataLoading.value
})
</script>

<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="manual-search"
  >
    <div class="tabs-buttons">
      <TabButton
        v-for="button in props.isCustom ? buttons.filter(el => el.type !== 'ENG' && el.type !== 'AXL') : buttons"
        :key="button.title"
        :title="button.title"
        :icon="button.icon"
        :class="{ active: currentButton === button.title }"
        @update-vehicle-type="handleTypeClick(button)"
      />
    </div>
    <div class="w-full flex flex-col md:flex-row gap-4 md:gap-4">
      <div class="w-full md:w-1/3">
        <label>
          Select Manufactuerer
          {{
            manufacturersStore.manufacturers.length > 0
              ? `(${manufacturersStore.manufacturers.length})`
              : ""
          }}
        </label>
        <ElSelect
          v-model="selectedManufacturer"
          v-loading="manufacturersLoading"
          filterable
          placeholder="Select"
          class="select"
        >
          <ElOption
            v-for="item in manufacturersStore.manufacturers"
            :key="item.MFA_ID"
            :label="item.MFA_BRAND"
            :value="item.MFA_ID"
          />
        </ElSelect>
        <p
          v-if="selectedManufacturer === ''"
          class="text-red-500 text-sm"
        >
          {{ manufacturerErr }}
        </p>
      </div>
      <div
        v-if="selectedType === 'ENG'"
        class="w-full md:w-1/3"
      >
        <label>
          Select Engine code
          {{ engineCodes.length > 0 ? `(${engineCodes.length})` : "" }}</label>
        <ElSelect
          v-model="engineCode"
          v-loading="engineLoading"
          filterable
          placeholder="Select"
          class="select"
        >
          <ElOption
            v-for="item in engineCodes"
            :key="item.ENG_ID"
            :label="`Code ${item.ENG_CODE} | cylinders ${item.ECS_NUMBER_OF_CYLINDERS}`"
            :value="item.carId"
          >
            <span style="display: inline; width: 100%;">{{
              item.ENG_CODE
            }}</span>
            &nbsp;&nbsp;&nbsp;
            <span> {{ item.ECS_NUMBER_OF_CYLINDERS }} </span>
          </ElOption>
        </ElSelect>
        <p
          v-if="model === ''"
          class="text-red-500 text-sm"
        >
          {{ modelErr }}
        </p>
      </div>
      <div
        v-if="selectedType !== 'ENG'"
        class="w-full md:w-1/3"
      >
        <label>
          Select Model
          {{ models.length > 0 ? `(${models.length})` : "" }}</label>
        <ElSelect
          v-model="model"
          v-loading="modelsLoading"
          filterable
          placeholder="Select"
          class="select"
          popper-class="select-full"
        >
          <ElOption
            value=""
            disabled
          >
            <div class="w-full flex flex-col md:flex-row gap-4 md:gap-4">
              <div class="w-full md:w-1/3">
                <span> TYPE </span>
              </div>
              <div class="w-full md:w-1/3">
                <span> CONTRUCTION YEAR </span>
              </div>
            </div>
          </ElOption>
          <ElOption
            v-for="item in models"
            :key="item.MS_ID"
            :label="`${item.MS_NAME}`"
            :value="item.MS_ID"
          >
            <div class="flex h-auto w-full flex-nowrap   ">
              <div class="w-full    min-w-0">
                <p class="break-words">
                  {{ item.MS_NAME }}
                </p>
              </div>
              <div class="w-full md:w-1/3">
                <p v-if="item.MS_CI_FROM && item.MS_CI_TO">
                  {{
                    `${item.MS_CI_FROM.split("-")[1]
                    }.${
                      item.MS_CI_FROM.split("-")[0]}`
                  }}
                  -
                  {{
                    `${item.MS_CI_TO.split("-")[1]
                    }.${
                      item.MS_CI_TO.split("-")[0]}`
                  }}
                </p>
                <p v-if="item.MS_CI_FROM && !item.MS_CI_TO">
                  {{
                    `from ${
                      item.MS_CI_FROM.split("-")[1]
                    }.${
                      item.MS_CI_FROM.split("-")[0]}`
                  }}
                </p>
                <p v-if="item.MS_CI_TO && !item.MS_CI_FROM">
                  {{
                    `to ${
                      item.MS_CI_TO.split("-")[1]
                    }.${
                      item.MS_CI_TO.split("-")[0]}`
                  }}
                </p>
              </div>
            </div>
          </ElOption>
        </ElSelect>
        <p
          v-if="model === ''"
          class="text-red-500 text-sm"
        >
          {{ modelErr }}
        </p>
      </div>
      <div
        v-if="selectedType !== 'ENG'"
        class="w-full md:w-1/3"
      >
        <label>
          Select Car {{ cars.length > 0 ? `(${cars.length})` : "" }}</label>
        <ElSelect
          v-model="car"
          v-loading="carsLoading"
          filterable
          placeholder="Select"
          class="select"
          fit-input-width
          popper-class="select-full"
        >
          <ElOption
            value=""
            disabled
          >
            <div class="flex h-auto w-full flex-nowrap">
              <div class="w-full ">
                <span> TYPE </span>
              </div>
              <div class="w-full md:w-1/3">
                <span> KW </span>
              </div>
              <div class="w-full md:w-1/3">
                <span> HP </span>
              </div>
              <div class="w-full md:w-1/3">
                <span> ENGINE </span>
              </div>
            </div>
          </ElOption>
          <ElOption
            v-for="item in cars"
            :key="item.ELEMENT_ID"
            :label="`${item.ELEMENT_NAME}${
              item.el3 ? ` | ${item.el3?item.el3.toString().replace('.0000', ''):''}` : ''
            }${item.el4 ? ` | ${item.el4?item.el4.toString().replace('.0000', ''):''}` : ''}${
              item.el7 ? ` | ${item.el7}` : ''
            }`"
            :value="Number(item.ELEMENT_ID)"
          >
            <div class="flex h-auto w-full flex-nowrap">
              <div class="w-full  ">
                <span> {{ item.ELEMENT_NAME }} </span>
              </div>
              <div class="w-full md:w-1/3">
                <span> {{ item.el3 ? item.el3.toString().replace(".0000", "") : '' }} </span>
              </div>
              <div class="w-full md:w-1/3">
                <span> {{ item.el4 ? item.el4.toString().replace(".0000", "") : '' }} </span>
              </div>
              <div class="w-full md:w-1/3">
                <span> {{ item.el7 }} </span>
              </div>
            </div>
          </ElOption>
        </ElSelect>
        <p
          v-if="car === ''"
          class="text-red-500 text-sm"
        >
          {{ carErr }}
        </p>
      </div>
    </div>
    <div
      v-if="!props.isCustom"
      class="w-full flex flex-col md:flex-row gap-4 md:gap-4"
    >
      <div class="w-full md:w-1/3">
        <label> Model Year </label>
        <ElInput
          v-model="modelYear"
          placeholder=""
          disabled
        />
      </div>
      <div class="w-full md:w-1/3">
        <label> Fuel Type</label>
        <ElInput
          v-model="fuelType"
          placeholder=""
          disabled
        />
      </div>
      <div class="w-full md:w-1/3">
        <label> CC Capacity</label>
        <ElInput
          v-model="ccCapacity"
          placeholder=""
          disabled
        />
      </div>
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
    <div v-if="noDataFound">
      <p>NO DATA FOUND</p>
    </div>
  </div>
</template>

<style>
.select-full .el-select-dropdown {
  min-inline-size: 700px !important;
}

.manual-search {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
/* stylelint-disable-next-line rule-empty-line-before */
.tabs-buttons {
  display: flex;
  flex-direction: row;
  /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
  flex-wrap: wrap;
  padding: 10px;
  background-color: #fff;
}
/* stylelint-disable-next-line rule-empty-line-before */
button {
  /* stylelint-disable-next-line order/properties-order */
  display: flex;
  justify-content: center;
  /* stylelint-disable-next-line order/properties-order */
  align-items: center;
  /* stylelint-disable-next-line order/properties-order */
  /* stylelint-disable-next-line order/properties-order */
  border-radius: 3px;
  /* stylelint-disable-next-line order/properties-order */
  border-width: 1px;
  border-color: #d9d9e0;
  /* stylelint-disable-next-line order/properties-order */
  background-color: #fff;
  color: #2d4aae;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  gap: 10px;
  padding-block: 5px;
  padding-inline: 10px;
  text-transform: uppercase;
}
/* stylelint-disable-next-line rule-empty-line-before */
button:disabled,
button[disabled],
button[disabled]:hover {
  border: 1px solid #999;
  background-color: #ccc;
  color: #666;
  cursor: auto;
}
/* stylelint-disable-next-line rule-empty-line-before */
.active {
  background-color: #2d4aae;
  color: white;
}

.icon:hover,
button:hover {
  background-color: #2d4aae;
  color: white;
}

.vehicle-type {
  display: flex;
  gap: 20px;
}

.el-input {
  padding: 0;
  margin-inline-start: -10px;
}
/* stylelint-disable-next-line rule-empty-line-before */
.select {
  inline-size: 100%;
}

label {
  /* stylelint-disable-next-line order/properties-order */
  /* stylelint-disable-next-line order/properties-order */
  font-weight: normal;
  margin-block-end: 5px;
  padding-block: 5px;
  padding-inline: 0;
}
</style>
