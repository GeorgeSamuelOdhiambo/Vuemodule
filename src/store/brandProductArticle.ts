import { defineStore } from 'pinia'

interface Brand {
  SUP_ID: number
  SUP_BRAND: string
  SUP_MATCH_CODE: string
  SUP_LOGO_NAME: string
}
interface Product {
  PT_ID: number
  SUP_ID: number
  PT_DES_ID: string
  COUNT_ART: number
}
interface Article {
  ART_ARTICLE_NR: string
  ART_DES: string
  ART_ID: number
  ART_MEDIA_FILE_NAME: string
  ART_SUP_BRAND: string
  ART_SUP_ID: number

}
export const useBrandProductArticleStore = defineStore('brandProductArticle', {
  state: () => ({

    listBrands: [] as Brand[],
    listProducts: [] as Product[],
    listArticles: [] as Article[],
    selectedBrand: {
      key1: 'value1',
      key2: 'value2',
    },
    selectectProduct: {
      key3: 'value3',
      key4: 'value4',
    },
    selectedArticle: {
      key3: 'value5',
      key4: 'value6',
    },
    selectedBrandId: '-1',
    selectedProductId: '-1',
    selectedArticleId: '-1',
  }),
})
