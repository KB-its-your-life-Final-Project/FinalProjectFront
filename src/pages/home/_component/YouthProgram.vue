<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { YouthProgramDTO } from "@/api/autoLoad/data-contracts";
import { Api } from "@/api/autoLoad/Api";
import { authStore } from "@/stores/authStore";

const api = new Api();
const auth = authStore();
const memberId = auth.member.id || 0;

const allowedPstSeNm = ["취업지원", "직업훈련", "대외활동"]; // 취업지원, 직업훈련, 대외활동 중 필요 시 필터

const youthProgramList = ref<YouthProgramDTO[]>([]);
const currentPage = ref(1);
const pageSize = 20;
const loading = ref(false);
const hasMore = ref(true);

const loadMoreTrigger = ref<HTMLElement | null>(null);

async function fetchUnreadPrograms(page: number) {
  if (loading.value || !hasMore.value) return;

  loading.value = true;

  try {
    const { data } = await api.getUnreadProgramsUsingGet({
      memberId,
      page,
      size: pageSize,
    });
    console.log("data: ", data);
    const newItems = data.data ?? [];

    const filtered = newItems
      .filter(
        (item) =>
          allowedPstSeNm.includes(item.pstSeNm ?? "") && !!item.pstWholCn?.match(/href="([^"]+)"/),
      )
      .map((item) => {
        const hrefMatch = item.pstWholCn?.match(/href="([^"]+)"/);
        return {
          ...item,
          pstUrlAddr: item.pstUrlAddr || (hrefMatch ? hrefMatch[1] : ""), // 기존 값이 없을 때만 대체, 링크가 여러개 있는 경우 있음 -> 하나만 불러오기
        };
      });

    const existingIds = new Set(youthProgramList.value.map((i) => i.id));
    const uniqueNew = filtered.filter((item) => !existingIds.has(item.id));

    youthProgramList.value.push(...uniqueNew);

    if (newItems.length < pageSize) {
      hasMore.value = false;
    } else {
      currentPage.value = page;
    }
  } catch (error: unknown) {
    console.error("청년 프로그램 불러오기 실패:", error);
  } finally {
    loading.value = false;
  }
}

// IntersectionObserver 설정 (스크롤 끝 감지)
function setupObserver() {
  if (!loadMoreTrigger.value) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && hasMore.value && !loading.value) {
        fetchUnreadPrograms(currentPage.value + 1);
      }
    });
  });
  observer.observe(loadMoreTrigger.value);
  onUnmounted(() => {
    observer.disconnect();
  });
}

async function handleClick(program: YouthProgramDTO) {
  if (!program.id) {
    console.error("프로그램 ID가 없습니다.");
    // 링크만 열고 읽음 처리는 하지 않음
    if (program.pstUrlAddr) {
      window.open(program.pstUrlAddr, "_blank");
    }
    return;
  }
  try {
    await api.markAsReadUsingPost({
      memberId: memberId, // 당신의 변수 이름에 맞게 조정
      contentId: program.id,
    });
    console.log(`읽음 처리 완료 - contentId: ${program.id}`);
  } catch (err) {
    console.error("읽음 처리 실패", err);
  }
  // 링크 새창 열기
  if (program.pstUrlAddr) {
    window.open(program.pstUrlAddr, "_blank");
  }
}

onMounted(async () => {
  await fetchUnreadPrograms(1);
  setupObserver();
});
</script>

<template>
  <div class="wrapper">
    <div class="flex justify-center mb-4">
      <div class="header-title-wrapper">
        <h1 class="w-13">
          <img class="w-full" src="@/assets/imgs/youth_logo.svg" alt="온통청년 로고" />
        </h1>
        <h2 class="header-title-text-wrapper">
          <span class="text-kb-ui-06 text-sm">제공</span>
          <span>청년 프로그램</span>
        </h2>
      </div>
    </div>
    <ul v-if="youthProgramList.length > 0" class="list-wrapper">
      <li
        v-for="(program, index) in youthProgramList"
        :key="program.id ?? index"
        class="list-item-wrapper"
      >
        <div class="flex-1 pr-4 min-w-0">
          <h3 class="program-title">
            <a
              v-if="program.pstUrlAddr"
              :href="program.pstUrlAddr"
              target="_blank"
              rel="noopener noreferrer"
              @click.prevent="handleClick(program)"
            >
              {{ program.pstTtl }}
            </a>
            <span v-else>{{ program.pstTtl }}</span>
          </h3>
        </div>
        <div v-if="program.atchFile" class="img-wrapper">
          <a
            v-if="program.pstUrlAddr"
            :href="program.pstUrlAddr"
            target="_blank"
            rel="noopener noreferrer"
            @click.prevent="handleClick(program)"
          >
            <img :src="program.atchFile" alt="프로그램 이미지" class="program-img" />
          </a>
          <img v-else :src="program.atchFile" alt="프로그램 이미지" class="program-img" />
        </div>
      </li>
      <!-- 무한 스크롤 트리거 요소 -->
      <li ref="loadMoreTrigger" class="h-1"></li>
    </ul>

    <p v-if="loading" class="loading">로딩중...</p>
    <p v-else-if="!hasMore && youthProgramList.length === 0" class="text-gray-500 mt-2">
      표시할 콘텐츠가 없습니다.
    </p>
  </div>
</template>

<style scoped>
@reference "@/assets/styles/main.css";
ul::-webkit-scrollbar {
  @apply w-[0.5rem];
}
ul::-webkit-scrollbar-thumb {
  @apply bg-kb-yellow/50 rounded-lg;
}
ul::-webkit-scrollbar-thumb:hover {
  @apply bg-kb-yellow-positive;
}
.wrapper {
  @apply bg-white rounded-xl shadow-md p-4 sm:p-6 text-center mt-6 h-[20rem] flex flex-col;
}
.header-title-wrapper {
  @apply flex flex-row items-center text-base gap-2;
}
.header-title-text-wrapper {
  @apply flex items-center text-base font-semibold gap-x-2;
}
.list-wrapper {
  @apply space-y-4 text-left overflow-auto flex-1 max-h-[15rem];
}
.list-item-wrapper {
  @apply flex h-[7rem] justify-between gap-1 break-words overflow-hidden;
}
.program-title {
  @apply text-[0.9rem] text-base text-kb-ui-04 break-words underline;
}
.img-wrapper {
  @apply flex items-center justify-center w-28 h-28 flex-shrink-0;
}
.program-img {
  @apply max-w-27 max-h-27 object-cover rounded-lg shadow-sm shadow-gray-300;
}
.loading {
  @apply text-[0.8rem] font-pretendard-regular text-kb-ui-06;
}
</style>
