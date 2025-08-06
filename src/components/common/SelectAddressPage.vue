<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Api } from '@/api/autoLoad/Api';
import type {
  SidoDto,
  SigugunDto,
  DongDto,
  BuildingInfoDto
} from '@/api/autoLoad/data-contracts';

interface AddressData {
  sido: string | undefined;
  sigugun: string | undefined;
  dong: string | undefined;
  buildingName: string | undefined;
  fullAddress: string;
  sidoCd: string | undefined;
  sggCd: string | undefined;
  umdCd: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  jibunAddr: string | undefined;
}

interface Props {
  // 건물 선택 후 처리 방식 ('safereport' | 'map'
  // safereport: 안심 레포트에서 처리
  // map: 지도에서 사용하실 경우 사용
  handleBuildingSelection?: 'safereport' | 'map';
}

const props = withDefaults(defineProps<Props>(), {
  handleBuildingSelection: 'safereport'
});

const emit = defineEmits(['go-back', 'address-selected', 'building-selected']);

const STEPS = {
  SIDO: 1,
  SIGUGUN: 2,
  DONG: 3,
  BUILDING: 4
} as const;

// 예외 필터링해야 하는 경기도, 전북 코드드
const SIDO_CODES = {
  GYEONGGI: '41',
  JEONBUK: '52'
} as const;

const api = new Api();

const createAddressData = (): AddressData => ({
  sido: selectedSido.value?.sidoNm,
  sigugun: selectedSigugun.value?.sggNm,
  dong: selectedDong.value?.dongNm,
  buildingName: '',
  fullAddress: '',
  sidoCd: selectedSido.value?.sidoCd,
  sggCd: selectedSigugun.value?.sggCd,
  umdCd: selectedDong.value?.umdCd,
  latitude: undefined,
  longitude: undefined,
  jibunAddr: undefined
});

const buildFullAddress = (): string => {
  return `${selectedSido.value?.sidoNm || ''} ${selectedSigugun.value?.sggNm || ''} ${selectedDong.value?.dongNm || ''}`.trim();
};

const shouldFilterSigugun = (sggNm: string, sidoCd: string, allData?: SigugunDto[]): boolean => {
  if (sidoCd === SIDO_CODES.GYEONGGI) {
    // 시 뒤에 읍/면/동이 붙은 경우 제외
    if (sggNm.includes('시') && (sggNm.includes('읍') || sggNm.includes('면') || sggNm.includes('동'))) {
      return true;
    }

    // "시"로 끝나는 경우, 같은 시에 구가 있는지 확인
    if (sggNm.endsWith('시')) {
      if (allData) {
        const hasGu = allData.some(item =>
          item.sggNm &&
          item.sggNm.includes(sggNm) &&
          item.sggNm.includes('구')
        );
        // 같은 시에 구가 있으면 시만 있는 항목 제외
        if (hasGu) {
          return true;
        }
      }
    }
  }

  if (sidoCd === SIDO_CODES.JEONBUK) {
    // 시/군 뒤에 읍/면/동이 붙은 경우 제외 (기본 시/군만 남기기 위해)
    if ((sggNm.includes('시') || sggNm.includes('군')) && (sggNm.includes('읍') || sggNm.includes('면') || sggNm.includes('동'))) {
      return true;
    }
  }

  return false;
};

const shouldFilterBuilding = (buildingName: string): boolean => {
  // 건물명이 없거나 빈 문자열인 경우 제외
  if (!buildingName || buildingName.trim() === '') {
    return true;
  }

  // 숫자와 특수문자만으로 구성된 경우 제외 (예: "640-2", "123", "A-1" 등)
  const numericOnly = /^[\d\-\s\(\)]+$/.test(buildingName.trim());
  return numericOnly;
};

// 로딩 상태
const isLoading = ref(false);

// 현재 선택 단계
const currentStep = ref<number>(STEPS.SIDO);

// 선택된 주소 정보
const selectedSido = ref<SidoDto | null>(null);
const selectedSigugun = ref<SigugunDto | null>(null);
const selectedDong = ref<DongDto | null>(null);

// 주소 목록
const sidoList = ref<SidoDto[]>([]);
const sigugunList = ref<SigugunDto[]>([]);
const dongList = ref<DongDto[]>([]);

// 건물 목록
const buildingList = ref<BuildingInfoDto[]>([]);

onMounted(async () => {
  await loadSidoList();
});

// 시/도 목록 로드
async function loadSidoList() {
  try {
    isLoading.value = true;
    const response = await api.getSidoListUsingGet();

    if (response.data.success && response.data.data) {
      // "기타" 제외하고 가나다순 정렬
      sidoList.value = response.data.data.filter(sido =>
        sido.sidoNm && sido.sidoNm !== '기타'
      ).sort((a, b) => (a.sidoNm || '').localeCompare(b.sidoNm || '', 'ko'));
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

    console.log(`🔍 시/군/구 API 응답 (sidoCd: ${sidoCd}):`, response.data);

          if (response.data.success && response.data.data) {
        console.log('📋 전체 시/군/구 데이터:', response.data.data);
        // 충북(sidoCd: '43')의 경우 첫 번째 원소도 포함, 다른 지역은 첫 번째 원소 제외
        const startIndex = sidoCd === '43' ? 0 : 1;
        const allData = response.data.data.slice(startIndex);
        const filteredData = allData.filter(sigugun => {
          const sggNm = sigugun.sggNm?.trim() || '';

          // 빈 값 제외
          if (!sggNm) return false;

          // 필터링 조건 확인
          return !shouldFilterSigugun(sggNm, sidoCd, allData);
        });

        console.log('✅ 필터링된 시/군/구 데이터:', filteredData);

      // 중복 제거 (sggNm 기준)
      const uniqueData = filteredData.filter((sigugun, index, self) =>
        index === self.findIndex(s => s.sggNm === sigugun.sggNm)
      );

        console.log('🔄 중복 제거된 시/군/구 데이터:', uniqueData);

      // 가나다순 정렬
      sigugunList.value = uniqueData.sort((a, b) => (a.sggNm || '').localeCompare(b.sggNm || '', 'ko'));

        console.log('📝 최종 시/군/구 목록:', sigugunList.value);
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
      // 첫 번째 원소 제외하고 가나다순 정렬
      dongList.value = response.data.data.slice(1).sort((a, b) => (a.dongNm || '').localeCompare(b.dongNm || '', 'ko'));
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

    if (response.data.success && response.data.data?.buildingInfos) {
      // 건물명 필터링
      const filteredBuildings = response.data.data.buildingInfos.filter(building =>
        !shouldFilterBuilding(building.buildingName || '')
      );

      buildingList.value = filteredBuildings;
      console.log('🏢 필터링된 건물 목록:', buildingList.value);
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

  currentStep.value = STEPS.SIGUGUN;
}

// 시/군/구 선택
async function selectSigugun(sigugun: SigugunDto) {
  selectedSigugun.value = sigugun;

  // 선택된 시/도와 시/군/구에 따른 읍/면/동 목록 로드
  await loadDongList(selectedSido.value?.sidoCd || '', sigugun.sggCd || '');

  currentStep.value = STEPS.DONG;
}

// 읍/면/동 선택
async function selectDong(dong: DongDto) {
  selectedDong.value = dong;

  // 선택된 읍/면/동에 따른 건물 목록 로드
  const regionCode = `${selectedSido.value?.sidoCd}${selectedSigugun.value?.sggCd}`;
  await loadBuildingList(dong.dongNm || '', regionCode);

  currentStep.value = STEPS.BUILDING;
}

// 건물 선택
function selectBuilding(building: BuildingInfoDto) {
  // 주소 데이터 생성
  const addressData: AddressData = {
    ...createAddressData(),
    buildingName: building.buildingName,
    fullAddress: buildFullAddress(),
    latitude: building.latitude,
    longitude: building.longitude,
    jibunAddr: building.jibunAddr
  };

  console.log("🏢 SelectAddressPage에서 전달하는 건물 데이터:", addressData);

  if (props.handleBuildingSelection === 'map') {
    // 수동 처리: 부모 컴포넌트에서 처리하도록 이벤트만 발생
    emit('building-selected', addressData);
  } else {
    // 안심 레포트 처리: 안심 레포트에서 사용
    emit('address-selected', addressData);
  }
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

<template>
  <div class="select-address-page">
    <!-- 헤더-->
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
      <div class="w-6"></div>
    </div>


    <div class="flex flex-col bg-white flex-1 overflow-hidden">

              <div class="px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div class="flex items-center text-base text-gray-600">
          <span class="mr-2 text-gray-600">📍</span>
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
              :key="building.buildingName"
              @click="selectBuilding(building)"
              :class="[
                'py-3 px-4 border rounded-lg text-left transition-colors',
                'border-gray-300 text-gray-700 hover:border-kb-yellow hover:bg-kb-yellow/10'
              ]"
            >
              {{ building.buildingName }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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



