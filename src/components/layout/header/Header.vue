<!-- Header -->

<script setup lang="ts">
import { defineProps, ref, reactive } from "vue";
import movePage from "@/utils/movePage";
import { headerTitleList, headerShowList } from "./header";
import type { headerShowtype } from "./header";
import { useRoute } from "vue-router";

const route = useRoute();

const emit = defineEmits(["back-click"]);

//헤더 받아오기
const props = defineProps<{
  headerShowtype: headerShowtype;
  title? :string; // 아파트명을 받아오고 싶음
}>();

//제목 설정
const title = ref(props.title ?? headerTitleList[props.headerShowtype]);

/*
const title = ref(headerTitleList[props.headerShowtype]);
*/

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

function handleBackClick() {
  console.log("뒤로가기 버튼 클릭됨!");
  console.log("현재 route.name:", route.name);

  if (route.name === "safeReport") {
    console.log("SafeReport 페이지 - emit 실행");
    emit("back-click");
  } else {
    console.log("다른 페이지 - movePage.back() 실행");
    movePage.back();
  }
}
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
        @click="handleBackClick"
      />
      <span
        v-if="title"
        :class="['text-base font-semibold text-kb-ui-01', showItems.showBack ? 'ml-4' : '']"
      >
         {{ props.title || title }}

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
