<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import useParts from '@/composables/parts'

const router = useRouter()

const { articles, error, loading, getByPartNumber, noDataFound } = useParts()
const partNumber: Ref<string> = ref('')
const partType: Ref<string> = ref(null)
const errpartType: Ref<string> = ref('')

const handleSearchByPartNumber = async (searchby: string) => {
  error.value = errpartType.value = ''
  if (partNumber.value === '') {
    error.value = 'Part number is required'

    return
  }

  if (!partType.value) {
    errpartType.value = 'Part Type is required'

    return
  }
  loading.value = true

  router.push({
    name: 'Product List By Part Number',
    params: { partnumber: partNumber.value },
    query: { searchby, partnumber: partNumber.value, parttype: partType.value },
  })

  // await getByPartNumber(partNumber.value)
  // articles.value && router.push({ name: 'Product List', params: { categoryId: treeID, groupName: treeName, carId: props.carId } })
}

const reset = () => {
  partNumber.value = ''
}

defineExpose({
  reset,
})
</script>

<template>
  <div class="vehicle-search">
    <div class="w-full flex flex-col md:flex-row flex-wrap gap-4 md:gap-0">
      <div class="w-full md:w-full">
        <label>Search by Part Number</label>
        <div class="w-2/3 flex flex-row flex-wrap">
          <div class="w-2/3">
            <ElInput
              v-model="partNumber"
              placeholder="248 HJS 938 HJ3"
              class="w-full"
            />
            <p
              v-if="error"
              class="text-red-500 text-sm"
            >
              {{ error }}
            </p>
          </div>
          <div>
            <ElRadioGroup v-model="partType">
              <ElRadio
                label="1"
                size="large"
                border
              >
                Origine
              </ElRadio>
              <ElRadio
                label="2"
                size="large"
                border
              >
                Adaptable
              </ElRadio>
            </ElRadioGroup>
            <p
              v-if="errpartType"
              class="text-red-500 text-sm"
            >
              {{ errpartType }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <ElButton
        class="btn"
        icon="search"
        @click="handleSearchByPartNumber('any')"
      >
        Any Number
      </ElButton>
      <ElButton
        class="btn"
        icon="search"
        @click="handleSearchByPartNumber('excat')"
      >
        Exact Number
      </ElButton>
      <ElButton
        v-if="partType !== '1' "
        class="btn"
        icon="search"
        @click="handleSearchByPartNumber('origine')"
      >
        Origine Number
      </ElButton>
      <ElButton
        class="btn"
        icon="search"
        @click="handleSearchByPartNumber('adaptable')"
      >
        Adaptable Number
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
    <div v-if="noDataFound">
      <p>NO DATA FOUND</p>
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
