<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="Title">{{ msg }}</h1>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 100;
  font-size: 2.6rem;
}

</style>
