<!-- Header -->

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import movePage from "@/utils/movePage";
import { headerTitleList, headerShowList } from "./header";
import type { headerShowtype } from "./header";
import { useRoute } from "vue-router";
import { useAlarmStore } from "@/stores/alarmStore";

const route = useRoute();
const alarmStore = useAlarmStore();

const emit = defineEmits(["back-click"]);

//헤더 받아오기
const props = defineProps<{
  headerShowtype: headerShowtype;
  title?: string; // 아파트명을 받아오고 싶음
}>();

// 알림 개수 초기화
onMounted(() => {
  alarmStore.fetchUnreadCount();
});

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
  if (route.name === "safeReport") {
    emit("back-click");
  } else {
    movePage.back();
  }
}
</script>

<template>
  <header class="bg-kb-yellow w-full p-3 relative">
    <!-- 헤더 상단 -->
    <div class="flex justify-between text-kb-ui-01 h-7">
      <!-- 왼쪽 아이콘 리스트-->
      <div class="flex gap-2 text-md items-center">
        <font-awesome-icon
          v-if="showItems.showBack"
          :icon="['fas', 'arrow-left']"
          class="text-[1.125rem] cursor-pointer"
          @click="handleBackClick"
        />
        <span v-if="title" class="text-base font-semibold text-kb-ui-01">
          {{ props.title || title }}
        </span>
      </div>

      <!-- 오른쪽 아이콘 리스트 -->
      <div class="flex flex-row-reverse gap-2 text-md items-center">
        <div v-if="showItems.showAlarm" class="text-xl">
          <div class="relative">
            <font-awesome-icon
              :icon="['fas', 'bell']"
              class="cursor-pointer"
              @click="movePage.myAlarm()"
            />
            <!-- 미확인 알림 개수 표시 -->
            <div
              v-if="alarmStore.unreadCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              {{ alarmStore.unreadCount > 99 ? "99+" : alarmStore.unreadCount }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot />
  </header>
</template>
