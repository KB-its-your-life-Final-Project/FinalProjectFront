<!-- Header -->

<script setup lang="ts">
import { defineProps, ref, reactive } from "vue";
import movePage from "@/utils/movePage";
import { headerTitleList, headerShowList } from "./header";
import type { headerShowtype } from "./header";

//헤더 받아오기
const props = defineProps<{
  headerShowtype: headerShowtype;
}>();

//제목 설정
const title = ref(headerTitleList[props.headerShowtype]);

// 자동으로 모든 항목에 대한 boolean 변수들 생성
const showItems = reactive(
  (headerShowList[props.headerShowtype] ?? []).reduce(
    (acc, item) => {
      acc[item] = true;
      return acc;
    },
    {} as Record<string, boolean>,
  ),
);

// function handleBackClick() {
//   // 부모에서 @back을 전달하면 emit, 아니면 기본 동작
//   // (Vue 3의 $emit은 setup에서 defineEmits 사용)
//   if (typeof (emit as any) === 'function' && (emit as any).length > 0) {
//     // @back 리스너가 있으면 emit
//     emit('back');
//   } else {
//     // 없으면 기본 동작
//     movePage.back();
//   }
// }
</script>

<template>
  <header class="bg-kb-yellow w-full p-[1rem] relative">
    <!-- 왼쪽: 뒤로가기 아이콘 or 타이틀 -->
    <div
      class="absolute top-4 left-4 flex items-center space-x-[1rem] text-kb-ui-01 text-[1.25rem]"
    >
      <font-awesome-icon
        v-if="showItems.showBack"
        :icon="['fas', 'arrow-left']"
        class="text-[1.125rem] cursor-pointer"
        @click="movePage.back()"
      />
      <span
        v-if="title"
        :class="['text-base font-semibold text-kb-ui-01', showItems.showBack ? 'ml-4' : '']"
      >
        {{ title }}
      </span>
    </div>

    <div
      v-if="showItems.showAlarm"
      class="absolute top-4 right-4 flex items-center space-x-[1rem] text-kb-ui-01 text-xl"
    >
      <font-awesome-icon
        :icon="['fas', 'bell']"
        class="cursor-pointer"
        @click="movePage.myAlarm()"
      />
    </div>
      <slot />
  </header>
</template>
