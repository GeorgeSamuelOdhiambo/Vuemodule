import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import { ref } from 'vue'
import axios from '../../node_modules/axios'
import { VIN_DOMAIN } from './constant'

export default function useVins() {
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string> = ref('')
  const noDataFound: Ref<boolean> = ref(false)
  const searchData: Ref<any> = ref(null)
  const searchDataTn: Ref<any> = ref(null)

  const getByVins = async (vinInput: string) => {
    try {
      loading.value = true

      const response = await axios.get(VIN_DOMAIN, {
        params: {
          vin: vinInput,
        },
      })

      console.log(response)

      const responseData = response.data

      searchDataTn.value = responseData.datatn
      if (!responseData.data) {
        ElNotification({
          title: 'No Data',
          message: 'No data found with this VIN number',
          type: 'warning',
        })
        noDataFound.value = true
        loading.value = false

        return
      }

      searchData.value = responseData.data

      loading.value = false
    }
    catch (err: any) {
      console.log(err)
      loading.value = false
      if (err.response) {
        error.value = err.response.data.message
      }
      else if (err.request) {
        console.log(err.request)
      }
      else {
        ElMessage({
          message: 'Oops! Something went wrong',
          showClose: true,
          type: 'error',
          customClass: 'font-bold',
        })
      }
    }
  }

  return {
    error, loading, getByVins, noDataFound, searchData, searchDataTn,
  }
}
