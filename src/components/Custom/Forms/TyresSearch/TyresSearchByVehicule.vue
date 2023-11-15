<script setup lang="ts">
import SearchByVin from '@/components/Custom/Forms/SearchByVin.vue'
import SearchByPlate from '@/components/Custom/Forms/SearchByPlate.vue'
import ManualSearch from '@/components/Custom/Forms/ManualSearch.vue'
</script>

<template>
  <div>
    <div class="card w-full  pb-5 ">
      <ElCard class="box-card">
        <ManualSearch is-custom="tyres" />
      </ElCard>
    </div>
    <div class="w-full flex flex-col md:flex-row gap-4 md:gap-4">
      <div class="w-full md:w-1/2">
        <ElCard class="box-card">
          <SearchByVin is-custom="tyres" />
        </ElCard>
      </div>
      <div class="w-full md:w-1/2">
        <ElCard class="box-card">
          <SearchByPlate is-custom="tyres" />
        </ElCard>
      </div>
    </div>
  </div>
</template>
