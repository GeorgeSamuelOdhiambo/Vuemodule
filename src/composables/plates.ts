import { ElMessage } from 'element-plus'
import axios from '../../node_modules/axios'
import { PLATE_NUMBER } from './constant'

export default function usePlates() {
  const searchData: Ref<any> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const noDataFound: Ref<boolean> = ref(false)
  const error: Ref<string> = ref('')

  const getByPlates = async (params: {
    plate: string
    serie: string
    plateType: string
  }) => {
    try {
      loading.value = true

      const response = await axios.get(PLATE_NUMBER, {
        params: {
          platenum: params.plate,
          serie: params.serie,
          plateType: params.plateType,
        },
      })

      const responseData = response.data

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

      searchData.value = responseData
      noDataFound.value = false
      loading.value = false
    }
    catch (err: any) {
      console.log(err)
      loading.value = false
      if (err.response)
        error.value = err.response.data.message

      else if (err.request)
        console.log(err.request)

      else
        ElMessage({ message: 'Oops! Something went wrong', showClose: true, type: 'error', customClass: 'font-bold' })
    }
  }

  return {
    getByPlates,
    searchData,
    loading,
    error,
    noDataFound,
  }
}
