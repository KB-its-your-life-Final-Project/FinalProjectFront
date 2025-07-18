<!--관심매물 레이아웃-->
<script setup lang="ts">
import Header from '@/components/common/Header.vue';
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Section from '@/components/common/Section.vue';
import LogoSearchBar from '@/components/common/LogoSearchBar.vue';
import { useSearch } from '@/utils/useSearch'

const { searchQuery, clearSearch } = useSearch()
// 관심 지역 리스트 (임시 데이터)
const favoriteRegions = ref([
    // 여기에 사용자가 설정한 찜들이 뜰 수 있도록 연동할 것!
  { name: '서초동', liked: false },
  { name: '성수동', liked: false },
]);

function toggleLike(index: number) {
  favoriteRegions.value[index].liked = !favoriteRegions.value[index].liked;
}

function removeRegion(index: number) {
  favoriteRegions.value.splice(index, 1);
}
const favoriteApts = [
  /*임의의 데이터입니다.*/
  { id: 1, name: '아파트1', address: '3 구의역 필루시드', price: '₩200,000,000' },
  { id: 2, name: '아파트2', address: '4 성수역 필루시드', price: '₩250,000,000' },
  { id: 3, name: '아파트3', address: '5 뚝섬역 필루시드', price: '₩180,000,000' }
];
</script>


<template>
  <div class="pb-24">

    <Header :title="'관심 목록'" :showBack="true" :showAlarm="true">


      <div class="text-center mt-3">
        <p class="text-sm text-kb-ui-01">원룸, 빌라, 오피스텔, 아파트</p>
      </div>

      <div class="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 w-[85%]">
        <LogoSearchBar
          v-model="searchQuery"
          placeholder="지역 또는 단지 검색"
          @clear="clearSearch"
        />
      </div>


    </Header>


    <div class="px-4 mt-6">
      <h2 class="text-sm font-semibold mb-2">관심 지역</h2>
      <ul class="space-y-4">
        <li
            v-for="(region, index) in favoriteRegions"
            :key="index"
            class="flex justify-between items-center text-sm border-b pb-2"
        >

          <div class="flex items-center space-x-2">
            <font-awesome-icon
                :icon="[region.liked ? 'fas' : 'far', 'star']"
                class="cursor-pointer"
                :class="region.liked ? 'text-kb-yellow' : 'text-kb-ui-05'"
                @click="toggleLike(index)"
            />
            <span>{{ region.name }}</span>
          </div>
          <button class="text-kb-ui-01 text-xs" @click="removeRegion(index)">
            해제
          </button>
        </li>
      </ul>
    </div>


    <section class="px-4 mt-6">
      <h2 class="text-sm font-semibold mb-2">관심 단지</h2>
      <div class="flex justify-evenly space-x-4 overflow-x-auto">
        <div
            v-for="apt in favoriteApts"
            :key="apt.id"
            class="min-w-[180px] rounded-xl border p-4 shadow-md bg-kb-ui-11"
        >
          <p class="text-sm font-semibold">{{ apt.name }}</p>
          <p class="text-xs text-kb-ui-05">{{ apt.address }}</p>
          <p class="mt-2 text-sm font-bold">{{ apt.price }}</p>
        </div>
      </div>
    </section>


    <section class="px-4 mt-6">
      <h2 class="text-sm font-semibold mb-2">최근 본 단지</h2>
      <ul class="space-y-2">
        <li class="flex items-center space-x-3 text-sm">
<!-- 여기도 임의의 데이터         -->
          <div>
            <p>YY아파트 5층</p>
            <p class="text-xs text-kb-ui-06">₩200,000,000</p>
          </div>
        </li>
        <li class="flex items-center space-x-3 text-sm">
          <div>
            <p>ZZ아파트 1층</p>
            <p class="text-xs text-kb-ui-06">₩300,000,000</p>
          </div>
        </li>
      </ul>
    </section>
    <Section />
  </div>
</template>



<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
