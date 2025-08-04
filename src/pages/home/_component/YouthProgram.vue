<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { YouthContentDTO } from "@/api/autoLoad/data-contracts";
import { Api } from "@/api/autoLoad/Api";

const api = new Api();
const memberId = 123; // 실제 로그인한 회원 ID를 적절히 교체하세요

const allowedPstSeNm = ["취업지원", "직업훈련", "대외활동"]; // 필터링 조건

const youthProgramList = ref<YouthContentDTO[]>([]);
const currentPage = ref(1);
const pageSize = 20;
const loading = ref(false);
const hasMore = ref(true);

const loadMoreTrigger = ref<HTMLElement | null>(null);

async function fetchUnreadContents(page: number) {
  if (loading.value || !hasMore.value) return;

  loading.value = true;

  try {
    // Swagger API 메서드 호출 (query 인자에 memberId, page, size 전달)
    const { data } = await api.getUnreadContentsUsingGet({
      memberId,
      page,
      size: pageSize,
    });
    console.log("data: ", data);
    const newItems = data.data ?? [];

    const filtered = newItems
      .filter(
        (item) =>
          allowedPstSeNm.includes(item.pstSeNm ?? "") &&
          !!item.pstWholCn?.match(/href="([^"]+)"/)
      )
      .map((item) => {
        const hrefMatch = item.pstWholCn?.match(/href="([^"]+)"/);
        return {
          ...item,
          hrefUrl: hrefMatch ? hrefMatch[1] : "",
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
  } catch (error) {
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
        fetchUnreadContents(currentPage.value + 1);
      }
    });
  });

  observer.observe(loadMoreTrigger.value);

  onUnmounted(() => {
    observer.disconnect();
  });
}
async function handleClick(program: YouthContentDTO) {
  try {
    await api.markAsReadUsingPost({
      memberId: memberId,     // 당신의 변수 이름에 맞게 조정
      contentId: program.id,
    });
    console.log(`읽음 처리 완료 - contentId: ${program.id}`);
  } catch (err) {
    console.error("읽음 처리 실패", err);
  }

  // 링크 새창 열기
  if (program.hrefUrl) {
    window.open(program.hrefUrl, "_blank");
  }
}

onMounted(async () => {
  await fetchUnreadContents(1);
  setupObserver();
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center mt-6 h-[17rem] flex flex-col">
    <div class="flex justify-center mb-4">
      <div class="flex flex-row items-center text-base gap-2">
        <h1 class="w-13">
          <img class="w-full" src="@/assets/imgs/youth_logo.svg" alt="온통청년 로고" />
        </h1>
        <h2 class="flex items-center text-base font-semibold gap-x-2">
          <span class="text-kb-ui-06 text-sm">제공</span>
          <span>청년 프로그램</span>
        </h2>
      </div>
    </div>

    <ul
      v-if="youthProgramList.length > 0"
      class="space-y-4 text-left overflow-auto flex-1 max-h-[12.5rem]"
    >
      <li
        v-for="(program, index) in youthProgramList"
        :key="program.id ?? index"
        class="flex item-start h-[5rem] justify-between gap-2 break-words overflow-hidden"
      >
        <div class="flex-1 pr-4 min-w-0">
          <h3 class="text-small text-base text-kb-ui-04 break-words underline">
            <a
              v-if="program.hrefUrl"
              :href="program.hrefUrl"
              target="_blank"
              rel="noopener noreferrer"
              @click.prevent="handleClick(program)"
            >
              {{ program.pstTtl }}
            </a>
            <span v-else>{{ program.pstTtl }}</span>
          </h3>
        </div>
        <div v-if="program.atchFile" class="w-16 h-16 flex-shrink-0">
          <a
            v-if="program.hrefUrl"
            :href="program.hrefUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click.prevent="handleClick(program)"
          >
            <img
              :src="program.atchFile"
              alt="프로그램 이미지"
              class="w-full h-full object-cover rounded-lg"
            />
          </a>
          <img
            v-else
            :src="program.atchFile"
            alt="뉴스 이미지"
            class="w-full h-full object-cover rounded-lg"
          />
        </div>
      </li>
      <!-- 무한 스크롤 트리거 요소 -->
      <li ref="loadMoreTrigger" class="h-1"></li>
    </ul>

    <p v-if="loading" class="text-gray-500 mt-2">로딩 중...</p>
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
  @apply bg-kb-yellow rounded-lg;
}
ul::-webkit-scrollbar-thumb:hover {
  @apply bg-kb-yellow-positive;
}
</style>
