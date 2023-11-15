<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { pickBy, uniqBy } from 'lodash'
import type { ICategory } from '../../../globalTypes'
import useCarStore from '@/store/car'
import PartCard from '@/components/Custom/cards/PartCard.vue'
import { S3_STORAGE_IMAGE } from '@/composables/constant'
import { useBreadcrumbsStore } from '@/store/breadcrumbs'

const props = defineProps(['carId'])
const breadcrumbsStore = useBreadcrumbsStore()
const router = useRouter()
const route = useRoute()

const query_params: Ref<any> = ref({})

const carStore = useCarStore()
const loading: Ref<boolean> = ref(false)
const carCategoriesData: Ref<any> = ref(null)

const handleRedirect = (treeID: string, treeName: string) => {
  console.log(query_params.value)
  router.push({
    name: 'Product List',
    params: { categoryId: treeID, carId: props.carId },
    query: { ...query_params.value, ...{ filtercat: route.query.filtercat } },
  })
}

const handlePrimaryCategoryClick = (values: ICategory[]) => {
  console.log(query_params.value)
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
    params: { carId: props.carId, treeName: values[0].ROOT_NODE_TEXT },
    query: { ...query_params.value, ...{ filtercat: route.query.filtercat } },
  })
}

const handleSecondLevelClick = (item: ICategory) => {
  console.log(query_params.value)
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
    carStore.setFilteredCategories(uniqBy(categories, 'NODE_2_TEXT'))
    carStore.setFilterLevel(3)

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
    // treeName: item.ROOT_NODE_TEXT,
    // strName: item.NODE_1_TEXT,
    query_params.value.cat2 = item.NODE_1_STR_ID
    router.push({
      name: 'Categories',
      params: {
        carId: props.carId,

        strid: item.NODE_1_STR_ID,

      },
      query: { ...query_params.value, ...{ filtercat: route.query.filtercat } },
    })
  }
}

const handleThirdLevelClick = (item: ICategory) => {
  console.log(query_params.value)
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
        carId: props.carId,

        strid: item.NODE_2_STR_ID,

      },
      query: { ...query_params.value, ...{ filtercat: route.query.filtercat } },
    })
  }
}

const handleFourthLevlClick = (item: ICategory) => {
  if (item.NODE_3_STR_ID
    && item.NODE_3_TEXT
  ) {
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
}

onMounted(async () => {
  // carId.value = route.params.carId
  // typeCar.value = route.params.targetType
  // strid.value = route.params.strid
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
  }
  carCategoriesData.value = carStore.carCategories
})

watchEffect(() => {
  // carCategoriesData.value = carStore.carCategories
})

watch(
  () => route.name,
  () => {
    if (route.name !== 'Categories' && route.name !== 'Product List')
      carStore.setFilterLevel(1)
  },
)

window.addEventListener('popstate', () => {
  // eslint-disable-next-line curly
  if (carStore.filterLevel > 1 && route.name === 'Categories') {
    carStore.filterLevel--
  }
  carStore.removeFilterTitle()
})
</script>

<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="p-3 space-y-4 scroll-smooth"
  >
    <div class="w-full flex gap-4  ">
      <div v-if="carStore.filterLevel === 1">
        <div v-if="carStore.carCategories">
          <div class="flex flex-wrap flex-col md:flex-row gap-6 w-full">
            <div
              v-for="(values, key) in carStore.carCategories"
              :key="key"
            >
              <PartCard
                v-if="values[0].ROOT_NODE_STR_ID !== '103671'"
                :name="key"
                :image="`${S3_STORAGE_IMAGE}img.sections/100x100/${values[0].ROOT_NODE_STR_ID}.png`"
                @click="handlePrimaryCategoryClick(values)"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="carStore.filterLevel === 2">
        <div class="flex flex-wrap flex-col md:flex-row gap-6 w-full">
          <div
            v-for="item in carStore.filteredCategories"
            :key="item.NODE_1_STR_ID"
          >
            <PartCard
              :name="item.NODE_1_TEXT"
              :image="`${S3_STORAGE_IMAGE}img.sections/100x100/${item.NODE_1_STR_ID}.png`"
              @click="handleSecondLevelClick(item)"
            />
          </div>
        </div>
      </div>
      <div v-if="carStore.filterLevel === 3">
        <div class="flex flex-wrap flex-col md:flex-row gap-6 w-full">
          <div
            v-for="item in carStore.filteredCategories"
            :key="item.NODE_2_STR_ID ?? item.NODE_1_STR_ID"
          >
            <PartCard
              :name="item.NODE_2_TEXT"
              :image="`${S3_STORAGE_IMAGE}img.sections/100x100/${item.NODE_2_STR_ID}.png`"
              @click="handleThirdLevelClick(item)"
            />
          </div>
        </div>
      </div>
      <div v-if="carStore.filterLevel === 4">
        <div class="flex flex-wrap flex-col md:flex-row gap-6 w-full">
          <div
            v-for="item in carStore.filteredCategories"
            :key="item.NODE_3_STR_ID ?? item.NODE_1_STR_ID"
          >
            <PartCard
              :name="item.NODE_3_TEXT"
              :image="`${S3_STORAGE_IMAGE}img.sections/100x100/${item.NODE_3_STR_ID}.png`"
              @click="handleFourthLevlClick(item)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
