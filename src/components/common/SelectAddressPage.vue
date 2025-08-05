<template>
  <div class="select-address-page">
    <!-- 헤더 (SearchAddressLayer와 동일한 스타일) -->
    <div class="bg-kb-yellow px-4 py-3 flex items-center justify-between flex-shrink-0">
      <button
        @click="goBack"
        class="text-black hover:bg-black/10 p-1 rounded transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h1 class="text-lg font-semibold text-black">주소 선택</h1>
      <div class="w-6"></div> <!-- 균형을 위한 빈 공간 -->
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="flex flex-col bg-white flex-1 overflow-hidden">
      <!-- Breadcrumb -->
      <div class="px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div class="flex items-center text-sm text-gray-600">
          <button
            @click="goToStep(1)"
            class="mr-2 p-1 hover:bg-gray-100 rounded"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span
            class="cursor-pointer hover:text-gray-800 font-semibold text-gray-800"
            @click="goToStep(1)"
          >
            {{ selectedSido?.sidoNm || '시/도' }}
          </span>
          <span class="mx-2 text-gray-800"> > </span>
          <span
            class="cursor-pointer hover:text-gray-800"
            :class="selectedSigugun ? 'font-semibold text-gray-800' : 'text-gray-400'"
            @click="goToStep(2)"
          >
            {{ selectedSigugun?.sggNm || '시/군/구' }}
          </span>
          <span class="mx-2" :class="selectedSigugun ? 'text-gray-800' : 'text-gray-400'"> > </span>
          <span
            class="cursor-pointer hover:text-gray-800"
            :class="selectedDong ? 'font-semibold text-gray-800' : 'text-gray-400'"
            @click="goToStep(3)"
          >
            {{ selectedDong?.dongNm || '읍/면/동' }}
          </span>
          <span v-if="buildingList.length > 0" class="mx-2 text-gray-400"> > </span>
          <span
            v-if="buildingList.length > 0"
            class="cursor-pointer hover:text-gray-800 text-gray-400"
            @click="goToStep(4)"
          >
            건물 선택
          </span>
        </div>
      </div>

      <!-- 주소 선택 그리드 -->
      <div class="p-4 flex-1 min-h-0">
        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-kb-yellow"></div>
        </div>

        <!-- 시/도 선택 -->
        <div v-else-if="currentStep === 1" class="h-full overflow-y-auto">
          <div class="grid grid-cols-3 gap-3 p-4 pb-8">
            <button
              v-for="sido in sidoList"
              :key="sido.sidoCd"
              @click="selectSido(sido)"
              :class="[
                'py-3 px-4 border rounded-lg text-center transition-colors',
                selectedSido?.sidoCd === sido.sidoCd
                  ? 'bg-kb-yellow border-kb-yellow text-white'
                  : 'border-gray-300 text-gray-700 hover:border-kb-yellow hover:bg-kb-yellow/10'
              ]"
            >
              {{ sido.sidoNm }}
            </button>
          </div>
        </div>

        <!-- 시/군/구 선택 -->
        <div v-else-if="currentStep === 2" class="h-full overflow-y-auto">
          <div class="grid grid-cols-3 gap-3 p-4 pb-8">
            <button
              v-for="sigugun in sigugunList"
              :key="sigugun.sggCd"
              @click="selectSigugun(sigugun)"
              :class="[
                'py-3 px-4 border rounded-lg text-center transition-colors',
                selectedSigugun?.sggCd === sigugun.sggCd
                  ? 'bg-kb-yellow border-kb-yellow text-white'
                  : 'border-gray-300 text-gray-700 hover:border-kb-yellow hover:bg-kb-yellow/10'
              ]"
            >
              {{ sigugun.sggNm }}
            </button>
          </div>
        </div>

        <!-- 읍/면/동 선택 -->
        <div v-else-if="currentStep === 3" class="h-full overflow-y-auto">
          <div class="grid grid-cols-3 gap-3 p-4 pb-8">
            <button
              v-for="dong in dongList"
              :key="dong.umdCd"
              @click="selectDong(dong)"
              :class="[
                'py-3 px-4 border rounded-lg text-center transition-colors',
                selectedDong?.umdCd === dong.umdCd
                  ? 'bg-kb-yellow border-kb-yellow text-white'
                  : 'border-gray-300 text-gray-700 hover:border-kb-yellow hover:bg-kb-yellow/10'
              ]"
            >
              {{ dong.dongNm }}
            </button>
          </div>
        </div>

        <!-- 건물 선택 -->
        <div v-else-if="currentStep === 4" class="h-full overflow-y-auto">
          <div class="grid grid-cols-1 gap-3 p-4 pb-8">
            <button
              v-for="building in buildingList"
              :key="building"
              @click="selectBuilding(building)"
              :class="[
                'py-3 px-4 border rounded-lg text-left transition-colors',
                'border-gray-300 text-gray-700 hover:border-kb-yellow hover:bg-kb-yellow/10'
              ]"
            >
              {{ building }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Api } from '@/api/autoLoad/Api';
import type {
  SidoDto,
  SigugunDto,
  DongDto
} from '@/api/autoLoad/data-contracts';

const emit = defineEmits(['go-back', 'address-selected']);

// API 인스턴스
const api = new Api();

// 로딩 상태
const isLoading = ref(false);

// 현재 선택 단계 (1: 시/도, 2: 시/군/구, 3: 읍/면/동, 4: 건물 선택)
const currentStep = ref(1);

// 선택된 주소 정보
const selectedSido = ref<SidoDto | null>(null);
const selectedSigugun = ref<SigugunDto | null>(null);
const selectedDong = ref<DongDto | null>(null);

// 주소 목록
const sidoList = ref<SidoDto[]>([]);
const sigugunList = ref<SigugunDto[]>([]);
const dongList = ref<DongDto[]>([]);

// 건물 목록
const buildingList = ref<string[]>([]);

// 컴포넌트 마운트 시 시/도 목록 로드
onMounted(async () => {
  await loadSidoList();
});

// 시/도 목록 로드
async function loadSidoList() {
  try {
    isLoading.value = true;
    const response = await api.getSidoListUsingGet();

    if (response.data.success && response.data.data) {
      // "기타" 제외
      sidoList.value = response.data.data.filter(sido =>
        sido.sidoNm && sido.sidoNm !== '기타'
      );
    } else {
      console.error('시/도 목록 로드 실패:', response.data.message);
    }
  } catch (error) {
    console.error('시/도 목록 로드 중 오류:', error);
  } finally {
    isLoading.value = false;
  }
}

// 시/군/구 목록 로드
async function loadSigugunList(sidoCd: string) {
  try {
    isLoading.value = true;
    const response = await api.getSigugunListUsingGet(sidoCd);

    if (response.data.success && response.data.data) {
      // 첫 번째 원소를 제외하고 빈 칸도 필터링, 중복 제거
      const filteredData = response.data.data.slice(1).filter(sigugun =>
        sigugun.sggNm && sigugun.sggNm.trim() !== ''
      );

      // 중복 제거 (sggNm 기준)
      const uniqueData = filteredData.filter((sigugun, index, self) =>
        index === self.findIndex(s => s.sggNm === sigugun.sggNm)
      );

      sigugunList.value = uniqueData;
    } else {
      console.error('시/군/구 목록 로드 실패:', response.data.message);
      sigugunList.value = [];
    }
  } catch (error) {
    console.error('시/군/구 목록 로드 중 오류:', error);
    sigugunList.value = [];
  } finally {
    isLoading.value = false;
  }
}

// 읍/면/동 목록 로드
async function loadDongList(sidoCd: string, sggCd: string) {
  try {
    isLoading.value = true;
    const response = await api.getDongListUsingGet(sggCd,sidoCd);

    if (response.data.success && response.data.data) {
      // 첫 번째 원소 제외
      dongList.value = response.data.data.slice(1);
    } else {
      console.error('읍/면/동 목록 로드 실패:', response.data.message);
      dongList.value = [];
    }
  } catch (error) {
    console.error('읍/면/동 목록 로드 중 오류:', error);
    dongList.value = [];
  } finally {
    isLoading.value = false;
  }
}

// 건물 목록 로드
async function loadBuildingList(dongName: string, regionCode: string) {
  try {
    isLoading.value = true;
    const response = await api.getBuildingListUsingGet({
      dongName: dongName,
      regionCode: regionCode
    });

    if (response.data.success && response.data.data?.buildingNames) {
      buildingList.value = response.data.data.buildingNames;
    } else {
      console.error('건물 목록 로드 실패:', response.data.message);
      buildingList.value = [];
    }
  } catch (error) {
    console.error('건물 목록 로드 중 오류:', error);
    buildingList.value = [];
  } finally {
    isLoading.value = false;
  }
}

// 시/도 선택
async function selectSido(sido: SidoDto) {
  selectedSido.value = sido;

  // 선택된 시/도에 따른 시/군/구 목록 로드
  await loadSigugunList(sido.sidoCd || '');

  // 잠시 후 다음 단계로 이동 (선택 상태를 보여주기 위해)
  setTimeout(() => {
    currentStep.value = 2;
  }, 300);
}

// 시/군/구 선택
async function selectSigugun(sigugun: SigugunDto) {
  selectedSigugun.value = sigugun;

  // 선택된 시/도와 시/군/구에 따른 읍/면/동 목록 로드
  await loadDongList(selectedSido.value?.sidoCd || '', sigugun.sggCd || '');

  // 잠시 후 다음 단계로 이동 (선택 상태를 보여주기 위해)
  setTimeout(() => {
    currentStep.value = 3;
  }, 300);
}

// 읍/면/동 선택
async function selectDong(dong: DongDto) {
  selectedDong.value = dong;

  // 선택된 읍/면/동에 따른 건물 목록 로드
  const regionCode = `${selectedSido.value?.sidoCd}${selectedSigugun.value?.sggCd}`;
  await loadBuildingList(dong.dongNm || '', regionCode);

  // 잠시 후 다음 단계로 이동 (선택 상태를 보여주기 위해)
  setTimeout(() => {
    currentStep.value = 4;
  }, 300);
}

// 건물 선택
function selectBuilding(buildingName: string) {
  // 선택 완료 시 부모 컴포넌트에 주소 정보 전달
  const fullAddress = `${selectedSido.value?.sidoNm} ${selectedSigugun.value?.sggNm} ${selectedDong.value?.dongNm}`;
  emit('address-selected', {
    sido: selectedSido.value?.sidoNm,
    sigugun: selectedSigugun.value?.sggNm,
    dong: selectedDong.value?.dongNm,
    buildingName: buildingName,
    fullAddress: fullAddress,
    sidoCd: selectedSido.value?.sidoCd,
    sggCd: selectedSigugun.value?.sggCd,
    umdCd: selectedDong.value?.umdCd
  });
}

// 단계 이동
async function goToStep(step: number) {
  if (step === 1) {
    currentStep.value = 1;
    selectedSido.value = null;
    selectedSigugun.value = null;
    selectedDong.value = null;
    sigugunList.value = [];
    dongList.value = [];
    buildingList.value = [];
  } else if (step === 2 && selectedSido.value) {
    currentStep.value = 2;
    selectedSigugun.value = null;
    selectedDong.value = null;
    dongList.value = [];
    buildingList.value = [];
    // 시/군/구 목록 다시 로드
    await loadSigugunList(selectedSido.value.sidoCd || '');
  } else if (step === 3 && selectedSigugun.value) {
    currentStep.value = 3;
    selectedDong.value = null;
    buildingList.value = [];
    // 읍/면/동 목록 다시 로드
    await loadDongList(selectedSido.value?.sidoCd || '', selectedSigugun.value.sggCd || '');
  } else if (step === 4 && selectedDong.value) {
    currentStep.value = 4;
    // 건물 목록 다시 로드
    const regionCode = `${selectedSido.value?.sidoCd}${selectedSigugun.value?.sggCd}`;
    await loadBuildingList(selectedDong.value.dongNm || '', regionCode);
  }
}

function goBack() {
  emit('go-back');
}
</script>

<style scoped>
.select-address-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  background: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>

