<!-- eslint-disable vue/require-prop-types -->
<script setup lang="ts">
import SearchProductDetailsPage from "@/components/Custom/Results/SearchProductDetailsPage.vue";

const props = defineProps(["id", "artNumber", "supId", "showModal"]);
</script>

<template>
  <div class="bg-[#f1f1fc] py-2">
    <div class="w-full md:w-[90%] mx-auto">
      <div class="space-y-4">
        <SearchProductDetailsPage
          :art-id="props.id"
          :art-number="props.artNumber"
          :sup-id="props.supId"
        />
      </div>
    </div>
  </div>
</template>
