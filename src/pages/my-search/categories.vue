<script setup lang="ts">
import Categories from '@/views/home/components/Categories.vue'
import { useBreadcrumbsStore } from '@/store/breadcrumbs'

const breadcrumbsStore = useBreadcrumbsStore()
</script>

<template>
  <div class="bg-[#f1f1fc] space-y-4">
    <div class="w-[100%] m-auto">
      <Categories />
    </div>
  </div>
</template>

<style>
.btn {
  color: white;
  /* stylelint-disable-next-line order/properties-order */
  background-color: #2d4aae;
}
</style>
