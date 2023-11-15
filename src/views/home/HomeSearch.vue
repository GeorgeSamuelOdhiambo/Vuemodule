<script setup lang="ts">
import { ref } from 'vue'
import ManualSearch from '../../components/Custom/Forms/ManualSearch.vue'
import SearchByVin from '../../components/Custom/Forms/SearchByVin.vue'
import SearchByPlate from '../../components/Custom/Forms/SearchByPlate.vue'
import TyresSearchByVehicule from '../../components/Custom/Forms/TyresSearch/TyresSearchByVehicule.vue'
import TyresSearchBySize from '../../components/Custom/Forms/TyresSearch/TyresSearchBySize.vue'
import BatteriesSearchByVehicule from '../../components/Custom/Forms/BatteriesSearch/BatteriesSearchByVehicule.vue'
import BatteriesSearchBySize from '../../components/Custom/Forms/BatteriesSearch/BatteriesSearchBySize.vue'
import VitreSearchByVehicule from '../../components/Custom/Forms/VitreSearch/VitreSearchByVehicule.vue'
import ConsumableSearchByVehicule from '../../components/Custom/Forms/ConsumableSearch/ConsumableSearchByVehicule.vue'
import SearchByPartNumber from '@/components/Custom/Forms/SearchByPartNumber.vue'

defineProps({
  isCommercial: Boolean,
  isPersonal: Boolean,
})

const refManualSearch = ref(null)
const refSearchByVin = ref(null)
const refSearchByPartNumber = ref(null)
const refSearchByPlate = ref(null)
const tabs = ref('manual')
const tabsTyres = ref('vehicule')

const handleClickTab = () => {
  refSearchByPlate.value.reset()
  refSearchByVin.value.reset()
  refSearchByPartNumber.value.reset()
}
</script>

<template>
  <ElTabs
    v-model="tabs"
    type="border-card"
    @tab-click="handleClickTab"
  >
    <ElTabPane name="manual">
      <template #label>
        <span class="blue-text flex items-center gap-3">
          <ElIcon :size="18"><Search /></ElIcon>
          <span>Manual Search</span>
        </span>
      </template>
      <div>
        <ManualSearch
          ref="refManualSearch"
          :is-commercial="isCommercial"
          :is-personal="isPersonal"
        />
      </div>
    </ElTabPane>
    <ElTabPane>
      <template #label>
        <span class="blue-text flex items-center gap-3">
          <ElIcon :size="18"><Search /></ElIcon>
          <span>Search By Car Plate</span>
        </span>
      </template>
      <div>
        <SearchByPlate ref="refSearchByPlate" />
      </div>
    </ElTabPane>
    <ElTabPane>
      <template #label>
        <span class="blue-text flex items-center gap-3">
          <ElIcon :size="18"><Search /></ElIcon>
          <span>Search By VIN</span>
        </span>
      </template>
      <SearchByVin ref="refSearchByVin" />
    </ElTabPane>
    <ElTabPane>
      <template #label>
        <span class="blue-text flex items-center gap-3">
          <ElIcon :size="18"><Search /></ElIcon>
          <span>Search By Part Number</span>
        </span>
      </template>
      <div>
        <SearchByPartNumber ref="refSearchByPartNumber" />
      </div>
    </ElTabPane>
    <ElTabPane>
      <template #label>
        <span class="blue-text flex items-center gap-3">
          <ElIcon :size="18"><Search /></ElIcon>
          <span> Tyres </span>
        </span>
      </template>
      <div>
        <ElTabs
          v-model="tabsTyres"
          type="border-card"
          @tab-click="handleClickTab"
        >
          <ElTabPane name="vehicule">
            <template #label>
              <span class="blue-text flex items-center gap-3">
                <ElIcon :size="18"><Search /></ElIcon>
                <span> Vehicule</span>
              </span>
            </template>
            <div>
              <TyresSearchByVehicule />
            </div>
          </ElTabPane>
          <ElTabPane name="size">
            <template #label>
              <span class="blue-text flex items-center gap-3">
                <ElIcon :size="18"><Search /></ElIcon>
                <span>  Size</span>
              </span>
            </template>
            <div>
              <TyresSearchBySize />
            </div>
          </ElTabPane>
        </ElTabs>
      </div>
    </ElTabPane>
    <ElTabPane>
      <template #label>
        <span class="blue-text flex items-center gap-3">
          <ElIcon :size="18"><Search /></ElIcon>
          <span> Battery </span>
        </span>
      </template>
      <div>
        <ElTabs
          v-model="tabsTyres"
          type="border-card"
          @tab-click="handleClickTab"
        >
          <ElTabPane name="vehicule">
            <template #label>
              <span class="blue-text flex items-center gap-3">
                <ElIcon :size="18"><Search /></ElIcon>
                <span> Vehicule</span>
              </span>
            </template>
            <div>
              <BatteriesSearchByVehicule />
            </div>
          </ElTabPane>
          <ElTabPane name="size">
            <template #label>
              <span class="blue-text flex items-center gap-3">
                <ElIcon :size="18"><Search /></ElIcon>
                <span>  Size</span>
              </span>
            </template>
            <div>
              <BatteriesSearchBySize />
            </div>
          </ElTabPane>
        </ElTabs>
      </div>
    </ElTabPane>
    <ElTabPane>
      <template #label>
        <span class="blue-text flex items-center gap-3">
          <ElIcon :size="18"><Search /></ElIcon>
          <span> Vitre </span>
        </span>
      </template>
      <div>
        <ElTabs
          v-model="tabsTyres"
          type="border-card"
          @tab-click="handleClickTab"
        >
          <ElTabPane name="vehicule">
            <template #label>
              <span class="blue-text flex items-center gap-3">
                <ElIcon :size="18"><Search /></ElIcon>
                <span> Vehicule</span>
              </span>
            </template>
            <div>
              <VitreSearchByVehicule />
            </div>
          </ElTabPane>
          <ElTabPane name="size">
            <template #label>
              <span class="blue-text flex items-center gap-3">
                <ElIcon :size="18"><Search /></ElIcon>
                <span>  Size</span>
              </span>
            </template>
            <div />
          </ElTabPane>
        </ElTabs>
      </div>
    </ElTabPane>
    <ElTabPane>
      <template #label>
        <span class="blue-text flex items-center gap-3">
          <ElIcon :size="18"><Search /></ElIcon>
          <span> Consumables </span>
        </span>
      </template>
      <div>
        <ElTabs
          v-model="tabsTyres"
          type="border-card"
          @tab-click="handleClickTab"
        >
          <ElTabPane name="vehicule">
            <template #label>
              <span class="blue-text flex items-center gap-3">
                <ElIcon :size="18"><Search /></ElIcon>
                <span> Vehicule</span>
              </span>
            </template>
            <div>
              <ConsumableSearchByVehicule />
            </div>
          </ElTabPane>
          <ElTabPane name="size">
            <template #label>
              <span class="blue-text flex items-center gap-3">
                <ElIcon :size="18"><Search /></ElIcon>
                <span>  Size</span>
              </span>
            </template>
            <div />
          </ElTabPane>
        </ElTabs>
      </div>
    </ElTabPane>
  </ElTabs>
</template>
