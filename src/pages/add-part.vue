<script lang="ts" setup>
import { useRoute } from 'vue-router'

import AddManufacture from '@/views/pages/add-part/AddManufacture.vue'
import AddSupplier from '@/views/pages/add-part/AddSupplier.vue'
import AddPart from '@/views/pages/add-part/AddPart.vue'

const route = useRoute()

const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  { title: 'Manufacture', icon: 'bx-add', tab: 'manu' },
  { title: 'Supplier', icon: 'bx-add', tab: 'supplier' },
  { title: 'Part', icon: 'bx-add', tab: 'part' },
]
</script>

<template>
  <div>
    <VTabs
      v-model="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
    >
      <!-- Account -->
      <VWindowItem value="manu">
        <AddManufacture />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="supplier">
        <AddSupplier />
      </VWindowItem>

      <!-- Notification -->
      <VWindowItem value="part">
        <AddPart />
      </VWindowItem>
    </VWindow>
  </div>
</template>
