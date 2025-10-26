<template>
  <div :class="darkMode ? 'dark' : ''">
    <NuxtPage />
  </div>
</template>

<script setup>
import { useReportStore } from '../stores/report'
import { storeToRefs } from 'pinia'

const store = useReportStore()
const { darkMode } = storeToRefs(store)
</script>