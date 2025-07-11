<script setup lang="ts"></script>

<template>
  <div class="TestPage">
    <h1 class="text-center text-3xl font-bold underline text-red-300 mb-12">Testing Tailwind</h1>
    <br />
    <div class="flex flex-col items-center gap-6 p-7 md:flex-row md:gap-8 rounded-2xl">
      <div>
        <img class="size-48 shadow-xl rounded-md" alt="사진" src="../assets/imgs/lollipop.jpg" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="text-2xl font-medium">텍스트</span>
        <span class="font-medium text-sky-500">텍스트</span>
        <span class="flex gap-2 font-medium text-gray-600 dark:text-gray-400">
          <span>No. 4</span>
          <span>·</span>
          <span>2025</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.TestPage {
}
</style>