<script setup lang="ts">
import axios from 'axios';
import { TYRE_SIZE } from '@/composables/constant'

const tyreWidth: Ref<string> = ref('')
const loading: Ref<boolean> = ref(false)
const listWidth: Ref<any> = ref(null)

watchEffect(async () => {
  const resp = await axios.get(TYRE_SIZE)

  listWidth.value = resp.data.data
  console.log(resp.data.data)
})
</script>

<template>
  <div>
    <ElSelect
      v-model="tyreWidth"
      v-loading="loading"
      filterable
      placeholder="Select"
      class="select"
    >
      <ElOption
        v-for="item in listWidth"
        :key="item.ACR_VALUE"
        :label="item.ACR_VALUE"
        :value="item.ACR_VALUE"
      />
    </ElSelect>
  </div>
</template>
