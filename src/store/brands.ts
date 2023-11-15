import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { ICarSupplierProduct } from '@/composables/cars'

interface BrandItem {

  name: string
  nameCount: string
  count: number
}

const useBrandStore = defineStore('brand', () => {
  const brands: Ref<BrandItem[]> = ref([])
  const brandsCount: Ref<string[]> = ref([])
  const selectedBrandCountIndex: Ref<number> = ref(0)
  const selectedBrandIndex: Ref<number> = ref(-1)
  const carSuppliersProducts: Ref<ICarSupplierProduct[]> = ref([])

  const setBrands = (brandsArr: BrandItem[]) => {
    brands.value = brandsArr
  }

  const setSelectedBrandIndex = (index: number) => {
    selectedBrandIndex.value = index
  }

  const setBrandsCount = (brandsArr: string[]) => {
    brandsCount.value = brandsArr
  }

  const setSelectedBrandCountIndex = (index: number) => {
    selectedBrandCountIndex.value = index
  }

  const setCarSupplierProducts = (products: ICarSupplierProduct[]) => {
    carSuppliersProducts.value = products
  }

  return { brands, setBrands, selectedBrandIndex, brandsCount, setBrandsCount, selectedBrandCountIndex, setSelectedBrandIndex, setSelectedBrandCountIndex, carSuppliersProducts, setCarSupplierProducts }
})

export default useBrandStore
