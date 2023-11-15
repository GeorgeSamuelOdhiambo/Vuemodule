import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import { ref } from 'vue'

import axios from 'axios'
import { ElMessage } from 'element-plus'
import { ARTICLES_BRANDS_And_Product_DOMAIN, BRANDS_DOMAIN } from './constant'


export default function useBrands() {
  const brands: Ref<any[]> = ref([])
  const articles: Ref<any[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string> = ref('')

  const getBrands = async () => {
    loading.value = true
    try {
      const data = await axios.get(BRANDS_DOMAIN)

      brands.value = data.data
      loading.value = false
    }
    catch (e: any) {
      if (e.response) {
        // brandErr.value = e.response.data.message
        console.log(e)
      }
      else if (e.request) {
        console.log(e.request)
      }
      else {
        ElMessage({
          message: 'Oops! Something went wrong',
          showClose: true,
          type: 'error',
          customClass: 'font-bold',
        })
      }
      loading.value = true
    }
  }

  // articlesbyproductandbrand
  const getArticlesbyproductandbrand = async (params: {
    suppid: string
    ptid: string
  }) => {
    loading.value = true
    try {
      const data = await axios.get(ARTICLES_BRANDS_And_Product_DOMAIN, {
        params: {
          suppid: params.suppid,
          ptid: params.ptid,
        },
      })

      articles.value = data.data
      loading.value = false
    }
    catch (e: any) {
      if (e.response) {
        // brandErr.value = e.response.data.message
        console.log(e)
      }
      else if (e.request) {
        console.log(e.request)
      }
      else {
        ElMessage({
          message: 'Oops! Something went wrong',
          showClose: true,
          type: 'error',
          customClass: 'font-bold',
        })
      }
      loading.value = true
    }
  }

  const getArticlesByBrandProductGroup = async (params: {
    suppid: string
    ptid: string
  }) => {
    loading.value = true
    try {
      const data = await axios.get(ARTICLES_BRANDS_DOMAIN, {
        params: {
          suppid: params.suppid,
          ptid: params.ptid,
        },
      })

      articles.value = data.data
      loading.value = false
    }
    catch (e: any) {
      if (e.response) {
        // brandErr.value = e.response.data.message
        console.log(e)
      }
      else if (e.request) {
        console.log(e.request)
      }
      else {
        ElMessage({
          message: 'Oops! Something went wrong',
          showClose: true,
          type: 'error',
          customClass: 'font-bold',
        })
      }
      loading.value = true
    }
  }

  return {
    brands, brandsError: error, brandsLoading: loading, getBrands, articles, getArticlesByBrandProductGroup, getArticlesbyproductandbrand,
  }
}
