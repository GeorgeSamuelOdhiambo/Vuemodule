<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { pickBy, uniqBy } from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import CarOverview from '@/components/Custom/Results/CarOverview.vue'
import useCarStore from '@/store/car'
import useBrandStore from '@/store/brands'
import useCars from '@/composables/cars'
import type { ICategory } from '@/globalTypes'
import { useBreadcrumbsStore } from '@/store/breadcrumbs'

const props = defineProps(['carId'])
const breadcrumbsStore = useBreadcrumbsStore()
const searchCategory = ref('')
interface BrandItem {

  name: string
  nameCount: string
  count: number
}

interface FilterLevel {
  STR_LEVEL: number
  ROOT_NODE_TEXT: string
  ROOT_NODE_STR_ID: string
  NODE_1_TEXT: string
  NODE_1_STR_ID: string
  NODE_2_TEXT: string | null
  NODE_2_STR_ID: string | null
  NODE_3_TEXT: string | null
  NODE_3_STR_ID: string | null
}
interface Breadcrumb {

  level: number
  title: string
  disabled: boolean
  href?: string
  data: any
}

let resultFiltredLevel: FilterLevel[] = []
const carStore = useCarStore()
const brandStore = useBrandStore()
const { carDataLoading, getCarInfo } = useCars()
let resCarID = ''
const router = useRouter()
const route = useRoute()
const query_params: Ref<any> = ref({})
const filterTitle: Ref<string> = ref('Categories')
const carCategoriesData: Ref<any> = ref(null)
const loading: Ref<boolean> = ref(false)
const selectedBrand: Ref<string> = ref('')
const routeItems: Ref<any[]> = ref([route.matched])

const cartCount: Ref<number> = ref(0)

const onBreadcrumbItemClick = (item: Breadcrumb) => {
//
  brandStore.brands = []
  searchCategory.value = ''

  console.log('item Breadcrumps: ', item)
  if (item.title === 'Categories') {
    // Categories
    carStore.filterLevel = 1
    carStore.setFilterTitles('Categories')
    carStore.carCategories = item.data
    carCategoriesData.value = item.data
    breadcrumbsStore.clearBreadcrumbs()
  }

  else {
    if (item.level === 2) {
      carStore.setFilteredCategories(uniqBy(item.data, 'NODE_1_TEXT'))
      carStore.setAllCategories(item.data)
    }
    else { carStore.filteredCategories = item.data }

    carStore.filterLevel = item.level
    carStore.setFilterTitles(item.title)

    breadcrumbsStore.removeItemsBreadcrumb(item.title)
    breadcrumbsStore.setPersistBreadcrumbs()
  }

  // router.push('/read')
}

const handleRedirect = (treeID: string, treeName: string) => {
  loading.value = true

  // Get the URL pathname
  const pathname = window.location.pathname

  // Split the pathname into segments
  const segments = pathname.split('/')

  resCarID = props.carId
  if (props.carId === undefined)

    resCarID = segments[(segments.length) - 1]

  router.push({
    name: 'Product List',
    params: { categoryId: treeID, carId: route.params.carId },
    query: { ...query_params.value, ...{ filtercat: route.query.filtercat } },
  })
  loading.value = false
}

// search category
watch(searchCategory, async () => {
  console.log('search', searchCategory)
  console.log('filterLevel', carStore.filterLevel)
  if (carStore.filterLevel === 1) {
    console.log('list category filtre 1 :', carStore.carCategories)

    const filteredData = Object.entries(carStore.carCategories)
      .filter(([key]) => key.toUpperCase().includes(searchCategory.value.toUpperCase()))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})

    carCategoriesData.value = filteredData
  }
  else if (carStore.filterLevel === 2) {
    resultFiltredLevel = carStore.filteredCategories.filter(item => item.NODE_1_TEXT?.toUpperCase().includes(searchCategory.value.toUpperCase()))
    console.log('search result', resultFiltredLevel)
  }
  else if (carStore.filterLevel === 3) {
    resultFiltredLevel = carStore.filteredCategories.filter(item => item.NODE_2_TEXT?.toUpperCase().includes(searchCategory.value.toUpperCase()))
    console.log('search result', resultFiltredLevel)
  }
  else if (carStore.filterLevel === 4) {
    resultFiltredLevel = carStore.filteredCategories.filter(item => item.NODE_3_TEXT?.toUpperCase().includes(searchCategory.value.toUpperCase()))
    console.log('search result', resultFiltredLevel)
  }
})

watchEffect(() => {
  routeItems.value = route.matched
})

const handlePrimaryCategoryClick = (values: ICategory[]) => {
  console.log('handlePrimaryCategoryClick: values', values)

  searchCategory.value = ''
  console.log('query', query_params.value)
  carStore.setFilterTitles(values[0].ROOT_NODE_TEXT)
  if (route.query.filtercat && route.query.filtercat === 'consumable') {
    console.log(values)

    if (values[0].ROOT_NODE_STR_ID === '100018') {
      values = values.filter(el =>
        el.NODE_1_STR_ID === '100133')
    }
    if (values[0].ROOT_NODE_STR_ID === '100006') {
      values = values.filter(el =>
        el.NODE_1_STR_ID === '100626' || el.NODE_1_STR_ID === '102208')
    }
    if (values[0].ROOT_NODE_STR_ID === '100050') {
      values = values.filter(el =>
        el.NODE_1_STR_ID === '104813')
    }
    if (values[0].ROOT_NODE_STR_ID === '100007') {
      values = values.filter(el =>
        el.NODE_1_STR_ID === '102205')
    }
    if (values[0].ROOT_NODE_STR_ID === '100002') {
      values = values.filter(el =>
        el.NODE_1_STR_ID === '100245')
    }
    if (values[0].ROOT_NODE_STR_ID === '100341') {
      values = values.filter(el =>
        el.NODE_1_STR_ID === '102692')
    }
    if (values[0].ROOT_NODE_STR_ID === '100238') {
      values = values.filter(el =>
        el.NODE_1_STR_ID === '706233')
    }
  }
  carStore.setFilteredCategories(uniqBy(values, 'NODE_1_TEXT'))
  carStore.setAllCategories(values)
  carStore.setFilterLevel(2)
  console.log('handlePrimaryCategoryClick: values', values)

  // breadcrumbsStore.breadcrumbs
  breadcrumbsStore.clearBreadcrumbs()
  breadcrumbsStore.addBreadcrumb({
    level: 1,
    title: 'Categories',
    disabled: false,
    href: window.location.href,
    data: carStore.carCategories,
  })
  breadcrumbsStore.addBreadcrumb({
    level: 2,
    title: values[0].ROOT_NODE_TEXT,
    disabled: true,
    href: '',
    data: values,
  })
  breadcrumbsStore.setPersistBreadcrumbs()

  // end breadcrumbsStore

  query_params.value.cat1 = values[0].ROOT_NODE_STR_ID

  router.push({
    name: 'Categories',
    params: { carId: route.params.carId, treeName: values[0].ROOT_NODE_TEXT },
    query: { ...query_params.value, ...{ filtercat: route.query.filtercat } },

  })
}

const handleSecondLevelClick = (item: ICategory) => {
  searchCategory.value = ''

  console.log('handleSecondLevelClick: item', item)

  if (item.STR_LEVEL === 2) {
    if (breadcrumbsStore.breadcrumbs[breadcrumbsStore.breadcrumbs.length - 1].data === null)
      breadcrumbsStore.removeLastItemBreadcrumb()

    breadcrumbsStore.addBreadcrumb({
      level: 2,
      title: item.NODE_1_TEXT,
      disabled: true,
      href: '',
      data: null,
    })
    breadcrumbsStore.setPersistBreadcrumbs()
    handleRedirect(item.NODE_1_STR_ID, item.NODE_1_TEXT)
  }
  else {
    carStore.setFilterTitles(item.NODE_1_TEXT)

    let categories = carStore.allCategories.filter(
      (category: ICategory) => category.NODE_1_STR_ID === item.NODE_1_STR_ID,
    )

    if (route.query.filtercat) {
      if (route.query.filtercat === 'vitre') {
        if (item.NODE_1_STR_ID === '101690') {
          categories = categories.filter(el =>
            el.NODE_2_STR_ID === '101697' || el.NODE_2_STR_ID === '101698' || el.NODE_2_STR_ID === '101695')
        }
        if (item.NODE_1_STR_ID === '101648') {
          categories = categories.filter(el =>
            el.NODE_2_STR_ID === '101655')
        }
        if (item.NODE_1_STR_ID === '101705') {
          categories = categories.filter(el =>
            el.NODE_2_STR_ID === '101784')
        }
      }
      if (route.query.filtercat === 'consumable') {
        if (item.NODE_1_STR_ID === '100245') {
          categories = categories.filter(el =>
            el.NODE_2_STR_ID === '101994')
        }
      }
    }
    console.log(categories)
    carStore.setFilteredCategories(uniqBy(categories, 'NODE_2_TEXT'))
    carStore.setFilterLevel(3)
    console.log('carStore.allCategories: item', carStore.allCategories)
    console.log('carStore.setFilteredCategories: item', carStore.filteredCategories)

    // breadcrumbsStore.breadcrumbs
    breadcrumbsStore.updatetItemBreadcrumb((breadcrumbsStore.breadcrumbs.length - 1), false, window.location.href)
    breadcrumbsStore.addBreadcrumb({
      level: 3,
      title: item.NODE_1_TEXT,
      disabled: true,
      href: '',
      data: carStore.filteredCategories,
    })
    breadcrumbsStore.setPersistBreadcrumbs()

    // end breadcrumbsStore

    query_params.value.cat2 = item.NODE_1_STR_ID

    // catId: item.NODE_1_STR_ID,
    //     strName: item.NODE_1_TEXT,
    // treeName: item.ROOT_NODE_TEXT,

    router.push({
      name: 'Categories',
      params: {
        carId: route.params.carId,

        strid: item.NODE_1_STR_ID,

      },
      query: { ...query_params.value, ...{ filtercat: route.query.filtercat } },
    })
  }
}

const handleThirdLevelClick = (item: ICategory) => {
  searchCategory.value = ''

  console.log('handleThirdLevelClick: item', item)

  if (item.STR_LEVEL === 3 && item.NODE_2_STR_ID
      && item.NODE_2_TEXT) {
    if (breadcrumbsStore.breadcrumbs[breadcrumbsStore.breadcrumbs.length - 1].data === null)
      breadcrumbsStore.removeLastItemBreadcrumb()

    breadcrumbsStore.addBreadcrumb({
      level: 3,
      title: item.NODE_2_TEXT,
      disabled: true,
      href: '',
      data: null,
    })
    breadcrumbsStore.setPersistBreadcrumbs()

    handleRedirect(item.NODE_2_STR_ID, item.NODE_2_TEXT)
  }
  else {
    item.NODE_2_TEXT && carStore.setFilterTitles(item.NODE_2_TEXT)

    const categories = carStore.allCategories.filter(
      (category: ICategory) => category.NODE_2_STR_ID === item.NODE_2_STR_ID,
    )

    carStore.setFilteredCategories(uniqBy(categories, 'NODE_3_TEXT'))
    carStore.setFilterLevel(4)

    // breadcrumbsStore.breadcrumbs
    if (item.NODE_2_TEXT) {
      breadcrumbsStore.updatetItemBreadcrumb((breadcrumbsStore.breadcrumbs.length - 1), false, window.location.href)

      breadcrumbsStore.addBreadcrumb({
        level: 4,
        title: item.NODE_2_TEXT,
        disabled: false,
        href: '',
        data: carStore.filteredCategories,
      })
      breadcrumbsStore.setPersistBreadcrumbs()
    }

    // end breadcrumbsStore
    // treeName: item.ROOT_NODE_TEXT,
    // strName: item.NODE_2_TEXT,

    query_params.value.cat3 = item.NODE_2_STR_ID
    router.push({
      name: 'Categories',
      params: {
        carId: route.params.carId,
        strid: item.NODE_2_STR_ID,
      },
      query: { ...query_params.value, ...{ filtercat: route.query.filtercat } },
    })
  }
}

// rclone mount eu2:otsimages /mnt --vfs-cache-mode full --vfs-fast-fingerprint --no-modtime
const handleFourthLevlClick = (item: ICategory) => {
  searchCategory.value = ''

  console.log('handleFourthLevlClick: item', item)

  if (item.NODE_3_STR_ID
    && item.NODE_3_TEXT) {
    if (breadcrumbsStore.breadcrumbs[breadcrumbsStore.breadcrumbs.length - 1].data === null)
      breadcrumbsStore.removeLastItemBreadcrumb()

    if (item.NODE_3_TEXT) {
      breadcrumbsStore.addBreadcrumb({
        level: 4,
        title: item.NODE_3_TEXT,
        disabled: true,
        href: '',
        data: null,
      })
      breadcrumbsStore.setPersistBreadcrumbs()
    }
    handleRedirect(item.NODE_3_STR_ID, item.NODE_3_TEXT)
  }

  // // breadcrumbsStore.breadcrumbs
  // breadcrumbsStore.updatetItemBreadcrumb((breadcrumbsStore.breadcrumbs.length - 1), false, window.location.href)
  // if (item.NODE_3_TEXT) {
  //   breadcrumbsStore.addBreadcrumb({
  //     level: 4,
  //     title: item.NODE_3_TEXT,
  //     disabled: true,
  //     href: '',
  //     data: carStore.filteredCategories,
  //   })
  //   breadcrumbsStore.setPersistBreadcrumbs()
  // }
  // // end breadcrumbsStore
}

const handleProductGroupClick = item => {
  loading.value = true

  // $route.router.go({
  //   name: 'Product List By Part Number',
  //   params: { partnumber: route.params.partnumber },
  //   query: { ...route.query, ...{ ptid: item.PT_ID } },
  // })
  loading.value = false
}

const handlePreviousClick = () => {
  brandStore.brands = []

  // searchCategory.value = ''

  // if (carStore.filterLevel > 1) {
  //   carStore.filterLevel = carStore.filterLevel - 1
  //   carStore.removeFilterTitle()
  //   router.go(-1)
  // }

  // // else {
  // window.history.back()

  // }
}

watch(selectedBrand, async () => {
  const index = brandStore.carSuppliersProducts.findIndex(
    item => item.SUP_BRAND === selectedBrand.value,
  )

  brandStore.setSelectedBrandIndex(index)
})

watchEffect(() => {
  // carCategoriesData.value = carStore.carCategories
})

onMounted(async () => {
  console.log(carStore.filterLevel)
  if (route.query.filtercat) {
    if (route.query.filtercat === 'tyres' && carStore.filterLevel === 1) {
      const filterCat = Object.values(pickBy(carStore.carCategories, (value, key) => {
        if (value.find(el => el.ROOT_NODE_STR_ID === '103099'))
          return true
      }))

      // console.log(filterCat)
      // await handlePrimaryCategoryClick(filterCat)
      carStore.setFilterTitles(filterCat[0].ROOT_NODE_TEXT)
      carStore.setFilteredCategories(uniqBy(filterCat[0], 'NODE_1_TEXT'))

      carStore.setFilterLevel(2)
    }

    if (route.query.filtercat === 'battery' && carStore.filterLevel === 1) {
      const filterCat = Object.values(pickBy(carStore.carCategories, (value, key) => {
        if (value.find(el => el.ROOT_NODE_STR_ID === '100010'))
          return true
      }))

      await handlePrimaryCategoryClick(filterCat)

      // carStore.setFilteredCategories(uniqBy(filterCat, 'NODE_2_TEXT'))
      // carStore.setFilterLevel(2)
      // console.log(filterCat)
      await handleSecondLevelClick(filterCat[0].find(el => el.NODE_1_STR_ID === '100042'))
    }

    if (route.query.filtercat === 'vitre') {
      console.log(carStore.carCategories)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const filterCat = Object.values(pickBy(carStore.carCategories, (value, key) => {
        if (value.find(el => el.ROOT_NODE_STR_ID === '100001'))
          return true
      }))

      // await handlePrimaryCategoryClick(filterCat)
      const catVitre = filterCat[0].filter(el =>
        el.NODE_1_STR_ID === '101690' || el.NODE_1_STR_ID === '101648' || el.NODE_1_STR_ID === '101705'
        || el.NODE_1_STR_ID === '100744')

      console.log(uniqBy(catVitre, 'NODE_1_TEXT'))
      carStore.setFilterTitles(filterCat[0][0].ROOT_NODE_TEXT)
      carStore.setFilteredCategories(uniqBy(catVitre, 'NODE_1_TEXT'))
      carStore.setAllCategories(filterCat[0])
      carStore.setFilterLevel(2)
    }
    if (route.query.filtercat === 'consumable') {
      const filterCat = pickBy(carStore.carCategories, (value, key) => {
        if (value.find(el => el.ROOT_NODE_STR_ID === '100005' || el.ROOT_NODE_STR_ID === '100018'
        || el.ROOT_NODE_STR_ID === '100006' || el.ROOT_NODE_STR_ID === '100050' || el.ROOT_NODE_STR_ID === '100007'
        || el.ROOT_NODE_STR_ID === '100002' || el.ROOT_NODE_STR_ID === '100341'
        || el.ROOT_NODE_STR_ID === '100238' || el.ROOT_NODE_STR_ID === '100733'))
          return true
      })

      carStore.setFilterTitles('Categories')
      carStore.setCategories(filterCat)
      console.log(filterCat)
    }

    // carStore.setCategories()
  }
  carCategoriesData.value = carStore.carCategories
  breadcrumbsStore.getPersistBreadcrumbs()

  if (carStore.filterLevel === 1) {
    breadcrumbsStore.clearBreadcrumbs()
    breadcrumbsStore.setPersistBreadcrumbs()

    // set first breadcrump: Categories
    // window.location.pathname
    // route.path
    breadcrumbsStore.addBreadcrumb({
      level: 1,

      title: 'Categories',
      disabled: true,
      href: window.location.href,
      data: carStore.carCategories,
    })
    breadcrumbsStore.setPersistBreadcrumbs()
  }
})

watch(
  () => route.params,
  async () => {
    // Get the URL pathname
    const pathname = window.location.pathname

    // Split the pathname into segments
    const segments = pathname.split('/')

    resCarID = props.carId
    if (props.carId === undefined)

      resCarID = segments[(segments.length) - 1]

    if (route.name === 'Categories')

      await getCarInfo({ selectedType: carStore.carType, car: route.params.carId })
  },
)

watch(
  () => brandStore.brands,
  () => {
    if (brandStore.brands.length === 2) {
      selectedBrand.value = brandStore.brands[1].name
      console.log('change from : brandStore.brands, ')
    }
    else if (brandStore.brands.length > 2) {
      selectedBrand.value = brandStore.brands[0].name
      console.log('change from : brandStore.brands, ')
    }
  },
)

const isProductDetail: Ref<string> = ref('')

isProductDetail.value = 'w-full space-y-4'
</script>

<template>
  <div
    v-loading.fullscreen.lock="loading"
    class=""
  >
    <!--
      <div v-if="route.path.includes('product-details')">

      <div class="w-full space-y-4">
      <div class="top-0 z-10 w-full space-y-3">
      <CarOverview
      v-if="route.params.carid"
      :carid="route.params.carid"
      />
      <div class="rounded-md w-full">
      <ElBreadcrumb separator=">>">
      <div
      v-if=" route.params.artNumber"
      class="flex bg-white px-2 py-4"
      >
      <ElBreadcrumbItem
      v-for="item in routeItems"
      :key="item.name"
      :href="route.path"
      :to="route.path"
      >
      {{ item.name }}
      </ElBreadcrumbItem>
      <div>{{ route.params.groupName }}</div>
      </div>

      <div
      v-if="route.params.treeName"
      class="flex bg-white px-2 py-4"
      >
      <ElBreadcrumbItem
      v-for="item in routeItems"
      :key="item.name"
      :href="route.path"
      :to="route.path"
      >
      {{ item.name }}
      </ElBreadcrumbItem>
      <div>{{ route.params.treeName }}</div>
      </div>
      </ElBreadcrumb>
      </div>
      </div>
      <RouterView />
      </div>
      </div>
    -->
    <div>
      <div class="w-full flex gap-4">
        <div
          v-if="!route.path.includes('product-details')"
          class="w-1/4 space-y-4"
        >
          <div
            v-if="brandStore.brands && brandStore.brands.length > 0 && route.path.includes('products-list')"
            class="bg-white rounded-md px-4 py-2"
          >
            <div class="w-full pb-3 space-y-5">
              <div class="bg-white rounded-md">
                <div class="space-y-5 pt-5 w-full">
                  <!-- <p>hi from bbb</p> -->

                  <VAutocomplete

                    v-model="selectedBrand"
                    label="Brand"
                    :items="brandStore.brands"
                    variant="outlined"
                  />
                  <VDivider />
                  <!--
                    <VTextField
                    v-model="assemblyGroup"
                    label="Search Product Group"
                    append-inner-icon="mdi-search"
                    variant="outlined"
                    />
                  -->
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="route.params.partnumber || route.params.brandid"
            class="bg-white rounded-md"
          >
            <div class="p-4 flex justify-start gap-5">
              <h2 class="font-bold text-lg">
                Categories
              </h2>
            </div>
            <div class="rounded-md bg-white">
              <div>
                <div
                  v-for="(item, key) in uniqBy(brandStore.carSuppliersProducts, 'PT_ID')"
                  :key="key"
                  class="flex justify-between px-4 py-2 hover:bg-slate-100 cursor-pointer"
                  @click="router.push({
                    name: 'Product List By Part Number',
                    params: { partnumber: route.params.partnumber },
                    query: { ...route.query, ...{ ptid: item.PT_ID } },
                  })"
                >
                  <div v-if="item.PT_ID === -1">
                    ALL
                  </div>
                  <div v-else>
                    {{ item.PRODUCT_GROUP }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            class="bg-white rounded-md"
          >
            <div class="w-full ">
              <br>
              <VTextField
                id="searchCategory"
                v-model="searchCategory"
                prepend-inner-icon="mdi-magnify"
                label="Search category"
                style=" margin-right: 15px; margin-left: 15px;"
              />
            </div>
            <div class="p-4 flex justify-start gap-5">
              <VBtn
                :disabled="carStore.filterLevel <= 10"
                density="compact"
                icon=" mdi-chevron-right"
                color="primary"
                variant="outlined"
                class="rounded-md bg-slate-400 text-white"
                @click="handlePreviousClick"
              />

              <h2 class="font-bold text-lg">
                {{ carStore.filterTitles.at(-1) ?? filterTitle }}
              </h2>
            </div>
            <div class="rounded-md bg-white">
              <div v-if="carStore.filterLevel === 1">
                <!-- <div v-if="carCategoriesData"> -->
                <div v-if="carCategoriesData">
                  <div
                    v-for="(values, key) in carCategoriesData"
                    :key="key"
                    class="flex justify-between px-4 py-2 hover:bg-slate-100 cursor-pointer"
                    @click="handlePrimaryCategoryClick(values)"
                  >
                    <div>{{ key }}</div>
                    <div><VIcon icon="mdi-chevron-right" /></div>
                  </div>
                </div>
                <div
                  v-else-if="carDataLoading"
                  class="flex justify-center items-center p-5"
                >
                  <VProgressCircular
                    :size="70"
                    :width="7"
                    color="gray"
                    indeterminate
                  />
                </div>
              </div>
              <!-- if searchCategory -->
              <div v-if="searchCategory !== ''">
                <div v-if="carStore.filterLevel === 2">
                  <!-- v-for="item in carStore.filteredCategories" -->
                  <div

                    v-for="item in resultFiltredLevel"
                    :key="item.NODE_1_STR_ID"
                    class="flex justify-between px-4 py-2 hover:bg-slate-100 cursor-pointer"
                    @click="handleSecondLevelClick(item)"
                  >
                    <div>{{ item.NODE_1_TEXT }}</div>
                    <div v-if="item.NODE_2_STR_ID">
                      <VIcon icon="mdi-chevron-right" />
                    </div>
                  </div>
                </div>
                <div v-if="carStore.filterLevel === 3">
                  <!-- v-for="item in carStore.filteredCategories" -->
                  <div
                    v-for="item in resultFiltredLevel"
                    :key="item.NODE_2_STR_ID ?? item.NODE_1_STR_ID"
                    class="flex justify-between px-4 py-2 hover:bg-slate-100 cursor-pointer"
                    @click="handleThirdLevelClick(item)"
                  >
                    <div>{{ item.NODE_2_TEXT }}</div>
                    <div v-if="item.NODE_3_STR_ID">
                      <VIcon icon="mdi-chevron-right" />
                    </div>
                  </div>
                </div>

                <div v-if="carStore.filterLevel === 4">
                  <!-- v-for="item in carStore.filteredCategories" -->
                  <div
                    v-for="item in resultFiltredLevel"
                    :key="item.NODE_3_STR_ID ?? item.NODE_1_STR_ID"
                    class="flex justify-between px-4 py-2 hover:bg-slate-100 cursor-pointer"
                    @click="handleFourthLevlClick(item)"
                  >
                    <div>{{ item.NODE_3_TEXT }}</div>
                    <div v-if="!route.query.cat3">
                      <VIcon icon="mdi-chevron-right" />
                    </div>
                  </div>
                </div>
              </div>
              <!-- if not searchCategory -->
              <div v-if="searchCategory === ''">
                <div v-if="carStore.filterLevel === 2">
                  <!-- v-for="item in carStore.filteredCategories" -->
                  <div

                    v-for="item in carStore.filteredCategories"
                    :key="item.NODE_1_STR_ID"
                    class="flex justify-between px-4 py-2 hover:bg-slate-100 cursor-pointer"
                    @click="handleSecondLevelClick(item)"
                  >
                    <div>{{ item.NODE_1_TEXT }}</div>
                    <div v-if="item.NODE_2_STR_ID">
                      <VIcon icon="mdi-chevron-right" />
                    </div>
                  </div>
                </div>
                <div v-if="carStore.filterLevel === 3">
                  <!-- v-for="item in carStore.filteredCategories" -->
                  <div
                    v-for="item in carStore.filteredCategories"
                    :key="item.NODE_2_STR_ID ?? item.NODE_1_STR_ID"
                    class="flex justify-between px-4 py-2 hover:bg-slate-100 cursor-pointer"
                    @click="handleThirdLevelClick(item)"
                  >
                    <div>{{ item.NODE_2_TEXT }}</div>
                    <div v-if="item.NODE_3_STR_ID">
                      <VIcon icon="mdi-chevron-right" />
                    </div>
                  </div>
                </div>

                <div v-if="carStore.filterLevel === 4">
                  <!-- v-for="item in carStore.filteredCategories" -->
                  <div
                    v-for="item in carStore.filteredCategories"
                    :key="item.NODE_3_STR_ID ?? item.NODE_1_STR_ID"
                    class="flex justify-between px-4 py-2 hover:bg-slate-100 cursor-pointer"
                    @click="handleFourthLevlClick(item)"
                  >
                    <div>{{ item.NODE_3_TEXT }}</div>
                    <div v-if="!route.query.cat3">
                      <VIcon icon="mdi-chevron-right" />
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="!loading && !carCategoriesData"
                class="px-4"
              >
                No Categories found
              </div>
            </div>
          </div>
        </div>
        <div :class="!route.path.includes('product-details') ? 'w-3/4 space-y-4' : 'w-full'">
          <div class="top-0 z-10 w-full space-y-3">
            <CarOverview
              v-if="route.params.carId"
              :car-id="props.carId"
            />
            <!-- <p>VBreadcrumbs</p> -->
            <!-- {{ breadcrumbsStore.breadcrumbs }} -->
            <div
              class="flex bg-white rounded-md w-full"
              style="margin-top: 10px;"
            >
              <VBreadcrumbs
                class=" flex bg-white  rounded-md w-full"
                :items="breadcrumbsStore.breadcrumbs"
              >
                <template #title="{ item }">
                  <a
                    :href="item.href"
                    @click="onBreadcrumbItemClick(item)"
                  >{{ item.title }}</a>
                </template>
                <template #divider>
                  <VIcon icon="mdi-chevron-right" />
                </template>
              </VBreadcrumbs>
            </div>
            <!--
              <div class="rounded-md w-full">
              <ElBreadcrumb separator=">>">
              <div class=" flex bg-white px-2 py-4">
              <ElBreadcrumbItem
              href="/"
              :to="{ path: '/' }"
              >
              Home
              </ElBreadcrumbItem>
              <div v-if="route.query.cat1 || route.query.cat2 || route.query.cat3">
              <ElBreadcrumbItem
              href="/"
              :to="{
              name: 'Categories',
              params: { carId: route.params.carId, targetType: route.params.targetType },
              }"
              >
              {{ carStore.carInfo.TYPEL }}
              </ElBreadcrumbItem>
              <ElBreadcrumbItem
              v-if="route.query.cat1"
              :href="`/my-search/${route.params.targetType}/${route.params.carId}?cat1=${route.query.cat1}`"
              :to="{
              name: 'Categories',
              params: { carId: route.params.carId, targetType: route.params.targetType, strid: route.query.cat1 },
              query: { cat1: route.query.cat1 },
              }"
              >
              {{ route.query.cat1 }}
              </ElBreadcrumbItem>

              <ElBreadcrumbItem
              v-if="route.query.cat2"
              :href="`/my-search/${route.params.targetType}/${route.params.carId}?cat1=${route.query.cat1}&cat2=${route.query.cat2}&cat3=100285`"
              :to="{
              name: 'Categories',
              params: { carId: route.params.carId, targetType: route.params.targetType, strid: route.query.cat2 },
              query: { cat1: route.query.cat1, cat2: route.query.cat2 },
              }"
              >
              {{ route.query.cat2 }}
              </ElBreadcrumbItem>
              <ElBreadcrumbItem
              v-if="route.query.cat3"
              :href="`/my-search/${route.params.targetType}/${route.params.carId}?cat1=${route.query.cat1}&cat2=${route.query.cat2}&cat3=${route.query.cat3}`"
              :to="{
              name: 'Categories',
              params: { carId: route.params.carId, targetType: route.params.targetType, strid: route.query.cat3 },
              query: { cat1: route.query.cat1, cat2: route.query.cat2, cat3: route.query.cat3 },
              }"
              >
              {{ route.query.cat3 }}
              </ElBreadcrumbItem>
              </div>
              <div v-else>
              <div v-if="carStore.carInfo">
              <ElBreadcrumbItem>{{ carStore.carInfo.TYPEL }}</ElBreadcrumbItem>
              </div>
              </div>
              <div v-if="route.query.partnumber">
              <div v-if="route.params.artNumber">
              <ElBreadcrumbItem
              :href="`/my-search/products-list/${route.query.partnumber}/?partnumber=${route.query.partnumber}&searchby=${route.query.searchby}`"
              :to="{
              name: 'Product List By Part Number',
              params: { partnumber: route.query.partnumber },
              query: route.query,
              }"
              >
              {{ route.query.partnumber }}
              </ElBreadcrumbItem>
              <ElBreadcrumbItem>{{ route.params.artNumber }}</ElBreadcrumbItem>
              </div>
              <div v-else>
              <ElBreadcrumbItem>  {{ route.query.partnumber }} </ElBreadcrumbItem>
              </div>
              </div>

              <ElBreadcrumbItem
              v-for="item in routeItems"
              :key="item.name"
              :href="route.path"
              :to="route.path"
              >
              {{ item.name }}
              </ElBreadcrumbItem>
              <div>{{ route.params.groupName }}</div>

              </div>
              </ElBreadcrumb>
              </div>
            -->
          </div>
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
