<script lang="ts" setup>
import { DOMAIN } from '@/composables/constant'

const manu = {
  img: '',
  MFA_BRAND: '',
  type: '',
  origine: false,
  models: '',
}

const refInputEl = ref<HTMLElement>()
const dialog = ref(false)
const manuLocal = ref(structuredClone(manu))

const saveData = async () => {
  const resp = await axios.post(`${DOMAIN}/addmanu`, manuLocal.value)

  console.log(resp)
}

const resetForm = () => {
  manuLocal.value = structuredClone(manu)
}

// changeAvatar function
const changeAvatar = (file: Event) => {
  const fileReader = new FileReader()
  const { files } = file.target as HTMLInputElement

  if (files && files.length) {
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        manuLocal.value.img = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  manuLocal.value.img = manu.img
}
</script>

<template>
  <VRow>
    <VCol cols="6">
      <VCard title="Manufacture">
        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="manuLocal.MFA_BRAND"
                  placeholder="Renault"
                  label="Manufacture Name"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VSelect
                  v-model="manuLocal.type"
                  multiple
                  label="Manufacture Type"
                  :items="['PC', 'CV', 'DC', 'ENG', 'MTB']"
                  placeholder="Select type"
                />
              </VCol>
              <VCol
                md="6"
                cols="12"
              >
                <VCheckbox
                  v-model="manuLocal.origine"
                  label="Origine contruction"
                />
              </VCol>

              <VCardText class="d-flex">
                <!-- 👉 Avatar -->
                <VAvatar
                  rounded="lg"
                  size="100"
                  class="me-6"
                  :image="manuLocal.img"
                />

                <!-- 👉 Upload Photo -->
                <form class="d-flex flex-column justify-center gap-5">
                  <div class="d-flex flex-wrap gap-2">
                    <VBtn
                      color="primary"
                      @click="refInputEl?.click()"
                    >
                      <VIcon
                        icon="bx-cloud-upload"
                        class="d-sm-none"
                      />
                      <span class="d-none d-sm-block">Upload new photo</span>
                    </VBtn>

                    <input
                      ref="refInputEl"
                      type="file"
                      name="file"
                      accept=".jpeg,.png,.jpg,GIF"
                      hidden
                      @input="changeAvatar"
                    >

                    <VBtn
                      type="reset"
                      color="error"
                      variant="tonal"
                      @click="resetAvatar"
                    >
                      <span class="d-none d-sm-block">Reset</span>
                      <VIcon
                        icon="bx-refresh"
                        class="d-sm-none"
                      />
                    </VBtn>
                  </div>

                  <p class="text-body-1 mb-0">
                    Allowed JPG, GIF or PNG. Max size of 800K
                  </p>
                </form>
              </VCardText>
              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn @click.prevent="saveData">
                  Save changes
                </VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Reset
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </vcard>
    </vcol>
    <VCol cols="6">
      <VCard title="Models">
        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VBtn @click.prevent="dialog = true">
                  Add models
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
