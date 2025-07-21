<script setup lang="ts">
import colorList from "@/assets/styles/colors.css?raw";
import fontList from "@/assets/styles/fonts.css?raw";

const kbColorList = colorList
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.startsWith("--color-"))
  .map((line) => {
    const [name, value] = line
      .replace(";", "")
      .split(":")
      .map((s) => s.trim());
    return {
      name: name.replace("--color-", ""),
      value,
    };
  });

const pretendardFontList = fontList
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.startsWith("--font-"))
  .map((line) => {
    const [name, value] = line
      .replace(";", "")
      .split(":")
      .map((s) => s.trim());
    return {
      name: name.replace("--font-", ""),
      value,
    };
  });
</script>

<template>
  <div>
    <h1 class="text-center text-3xl font-bold underline text-red-300 mb-12">Testing Tailwind</h1>
    <br />
    <div class="flex flex-col items-center gap-6 p-7 md:flex-row md:gap-8 rounded-2xl">
      <div>
        <img class="size-48 shadow-xl rounded-md" alt="사진" src="../assets/imgs/lollipop.jpg" />
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="text-2xl font-pretendard-thin">Pretendard Thin 글꼴 적용</span>
        <span class="font-medium text-kb-yellow-positive">커스텀 KB 색상 적용</span>
        <span class="flex gap-2 font-medium text-kb-gray-dark">
          <span>No 4</span>
          <span>·</span>
          <span>2025</span>
        </span>
      </div>
    </div>
    <br />
    <div class="flex flex-col">
      <table class="border border-gray-300 mt-10">
        <thead>
          <tr>
            <th>색상</th>
            <th>색상값</th>
            <th>클래스명 예시</th>
          </tr>
        </thead>
        <tbody>
          <tr class="h-20" v-for="color in kbColorList" :key="color.name">
            <td class="flex flex-col items-center justify-center border" :style="{borderColor: color.value}">
              <div class="w-7 h-7 rounded-full" :style="{ backgroundColor: color.value }"></div>
              <div :style ="{color: color.value === '#ffffff' || color.value === '#f7f7f8'? '#484b51' : color.value}">{{ color.name }}</div>
            </td>
            <td class="text-center">{{ color.value }}</td>
            <td class="text-center">
              bg-{{ color.name }}<br>
              text-{{ color.name }}<br>
              border border-{{ color.name }}
            </td>
          </tr>
        </tbody>
      </table>
      <table class="border border-gray-300 mt-10">
        <thead>
          <tr>
            <th>폰트</th>
            <th>클래스명</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="font in pretendardFontList" :key="font.name">
            <td :style="{ fontFamily: font.value }">{{ font.value }}</td>
            <td class="text-center">text-{{ font.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
