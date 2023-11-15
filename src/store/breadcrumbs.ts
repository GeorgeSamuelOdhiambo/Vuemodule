import { defineStore } from 'pinia'

interface Breadcrumb {

  level: number
  title: string
  disabled: boolean
  href?: string
  data: any
}

export const useBreadcrumbsStore = defineStore('breadcrumbs', {
  state: () => ({
    breadcrumbs: [] as Breadcrumb[],
  }),
  actions: {
    addBreadcrumb(breadcrumb: Breadcrumb) {
      this.breadcrumbs.push(breadcrumb)
    },

    // update  item
    updatetItemBreadcrumb(index: number, disabled: boolean, href?: string) {
      // const itemIndex = this.breadcrumbs.findIndex(item => item.title === title)
      if (index > -1) {
        this.breadcrumbs[index].disabled = disabled
        if (href)
          this.breadcrumbs[index].href = href
      }
    },

    // remove last item
    removeLastItemBreadcrumb() {
      this.breadcrumbs.pop()
    },

    // remove items since item
    removeItemsBreadcrumb(title: string) {
      const itemIndex = this.breadcrumbs.findIndex(item => item.title === title)
      if (itemIndex !== -1)
        this.breadcrumbs.splice(itemIndex + 1, this.breadcrumbs.length - itemIndex - 1)
    },
    clearBreadcrumbs() {
      this.breadcrumbs = []
    },
    setPersistBreadcrumbs() {
      localStorage.setItem('breadcrumbs', JSON.stringify(this.breadcrumbs))
    },
    getPersistBreadcrumbs() {
      const persistedBreadcrumbs = localStorage.getItem('breadcrumbs')
      if (persistedBreadcrumbs)
        this.breadcrumbs = JSON.parse(persistedBreadcrumbs)
    },

  },
})
