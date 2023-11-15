<script lang="ts" setup>
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import axios from 'axios'
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

// Components
// import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import useCartStore from '@/store/cart'

const route = useRoute()
const store = useCartStore()
const lang: Ref<number> = ref('en')
const routeItems: Ref<any[]> = ref([route.matched])

const cartCount: Ref<number> = ref(0)
const { mdAndDown } = useDisplay()

watchEffect(() => {
  routeItems.value = route.matched
})
watch(
  lang,
  async () => {
    // const axClient = axios.create()

    // axClient.interceptors.request.use(config => {
    // // use config.params if it has been set
    //   config.params = config.params || {}

    //   // add any client instance specific params to config
    //   config.params['lang'] = lang.value

    //   return config
    // })
  },

)
onMounted(() => {
  mdAndDown.value = true

  const storedJsonString = localStorage.getItem('cart')
  const cartItems = JSON.parse(storedJsonString || '[]')

  cartCount.value = cartItems.length
})

watch(store.cartItems, () => {
  const storedJsonString = localStorage.getItem('cart')
  const cartItems = JSON.parse(storedJsonString || '[]')

  cartCount.value = cartItems.length
})

const customToggleNav = isNAv => {
  mdAndDown.value = !isNAv
}
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center justify-between">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3  "
          @click="() => { mdAndDown ? toggleVerticalOverlayNavActive(true) : customToggleNav(mdAndDown) }"
        >
          <VIcon icon="bx-menu" />
        </IconBtn>

        <!-- 👉 Search -->
        <!--
          <div
          class="d-flex align-center cursor-pointer"
          style="user-select: none;"
          >
          <ElBreadcrumb separator="/">
          <ElBreadcrumbItem
          v-for="item in routeItems"
          :key="item.name"
          :href="item.path"
          :to="item.path"
          >
          {{ item.name }}
          </ElBreadcrumbItem>
          </ElBreadcrumb>
          </div>
        -->

        <VSpacer />
        <div class="flex items-center">
          <ElSelect
            v-model="lang"
            class="text-none"
            stacked
          >
            <ElOption
              v-for="item in [{ label: 'English', value: 'en' }, { label: 'French', value: 'fr' }]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
          <IconBtn
            class="text-none"
            stacked
          >
            <VBadge
              :content="cartCount"
              color="error"
            >
              <VIcon>mdi-cart</VIcon>
            </VBadge>
          </IconBtn>
          <IconBtn class="me-2">
            <VIcon icon="bx-bell" />
          </IconBtn>

          <NavbarThemeSwitcher class="me-2" />

          <UserProfile />
        </div>
      </div>
    </template>

    <template #vertical-nav-content>
      <!--
        <VerticalNavLink
        :item="{
        title: 'Dashboard',
        icon: 'bx-home',
        to: '/dashboard',
        }"
        />
      -->
      <VerticalNavLink
        :item="{
          title: 'Home',
          icon: 'bx-home',
          to: '/home',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Account Settings',
          icon: 'mdi-account-cog-outline',
          to: '/account-settings',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Add Part',
          icon: 'mdi-add',
          to: '/add-part',
        }"
      />
      <!-- 👉 Pages -->
      <VerticalNavSectionTitle
        :item="{
          heading: 'Pages',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Login',
          icon: 'bx-log-in',
          to: '/login',
        }"
      />
      <VerticalNavLink
        :item="{
          title: 'Register',
          icon: 'bx-user-plus',
          to: '/register',
        }"
      />
      <!--
        <VerticalNavLink
        :item="{
        title: 'Error',
        icon: 'bx-info-circle',
        to: '/no-existence',
        }"
        />
      -->

      <!-- 👉 User Interface -->
      <!--
        <VerticalNavSectionTitle
        :item="{
        heading: 'User Interface',
        }"
        />
        <VerticalNavLink
        :item="{
        title: 'Typography',
        icon: 'mdi-alpha-t-box-outline',
        to: '/typography',
        }"
        />
        <VerticalNavLink
        :item="{
        title: 'Icons',
        icon: 'bx-show',
        to: '/icons',
        }"
        />
        <VerticalNavLink
        :item="{
        title: 'Cards',
        icon: 'bx-credit-card',
        to: '/cards',
        }"
        />
        <VerticalNavLink
        :item="{
        title: 'Tables',
        icon: 'bx-table',
        to: '/tables',
        }"
        />
        <VerticalNavLink
        :item="{
        title: 'Form Layouts',
        icon: 'mdi-form-select',
        to: '/form-layouts',
        }"
        />
      -->
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <!-- <Footer /> -->
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
