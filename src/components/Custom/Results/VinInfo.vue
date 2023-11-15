<script setup lang="ts">
const props = defineProps(['vindata'])
</script>

<template>
  <div class="block rounded-lg bg-white text-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
    <div class="border-b-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
      {{ props.vindata.GAUCHE !== null ? `${props.vindata.GAUCHE.toString().replace('.0', '')}-` : '' }}{{ props.vindata.CD_SERIE }}-{{ props.vindata.DROIT_MIL }}
    </div>
    <div class="p-6">
      <h5 class="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
        {{ props.vindata.CHASSIS }}
      </h5>
      <p class="mb-4 text-base text-neutral-600 dark:text-neutral-200">
        {{ props.vindata.MARQUE }} : {{ props.vindata.GENRE }} - {{ $props.vindata.TYP_COMM }}<br>
        <span>PUISSANCE: {{ props.vindata.PUISSANCE }}</span> &nbsp;
        <span>ENERGIE: {{ props.vindata.ENERGIE }}</span><br>
        <span>CAR: {{ props.vindata.carId }}</span>
      </p>
    </div>
    <div class="border-t-2 border-neutral-100 px-6 py-3 dark:border-neutral-600 dark:text-neutral-50">
      DATE IMMAT : {{ props.vindata.DAT_IMMAT }}
    </div>
  </div>
</template>
