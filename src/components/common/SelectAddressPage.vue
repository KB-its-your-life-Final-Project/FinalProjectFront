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

// 필터링이 필요한 시/도 코드
const SIDO_CODES = {
  GYEONGGI: '41',
  JEONBUK: '52',
  GYEONGNAM: '48',
  GYEONGBUK: '47',
  JEONNAM: '46',
  CHUNGBUK: '43',
  CHUNGNAM: '44',
  JEJU: '50',
  SEJONG: '36'
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
  // 세종시의 경우 읍/면/동 없이 주소 생성
  if (selectedSido.value?.sidoCd === SIDO_CODES.SEJONG) {
    return `${selectedSido.value?.sidoNm || ''} ${selectedSigugun.value?.sggNm || ''}`.trim();
  }
  return `${selectedSido.value?.sidoNm || ''} ${selectedSigugun.value?.sggNm || ''} ${selectedDong.value?.dongNm || ''}`.trim();
};

const shouldFilterSigugun = (sggNm: string, sidoCd: string, allData?: SigugunDto[]): boolean => {
  // 광역시/특별시/특별자치도 이름 제거
  const metropolitanCityNames = [
    '광주광역시',
    '대구광역시',
    '대전광역시',
    '부산광역시',
    '서울특별시',
    '세종특별자치시',
    '울산광역시',
    '인천광역시',
    '제주특별자치도'
  ];

  if (metropolitanCityNames.includes(sggNm)) {
    return true;
  }

  // 특정 지역들에 대한 추가 필터링 로직
  const filteringCodes = ['41', '52', '48', '47', '46', '43', '44', '50'];
  const needsFiltering = filteringCodes.includes(sidoCd);

  if (needsFiltering) {
    // 기본적으로 시/군/구가 포함되지 않은 경우 제외
    const hasCityCountyGu = sggNm.includes('시') || sggNm.includes('군') || sggNm.includes('구');
    if (!hasCityCountyGu) {
      return true;
    }

    // 시/군/구 뒤에 읍/면/동이 붙은 경우 제외 (예: "거제시 남부면" → 제외)
    if ((sggNm.includes('시') || sggNm.includes('군') || sggNm.includes('구')) &&
        (sggNm.includes('읍') || sggNm.includes('면') || sggNm.includes('동'))) {
      return true;
    }

    // 경기도, 경남, 경북의 경우 추가 로직: "시"만 있는데 같은 시에 "구"가 있으면 제외
    if (sidoCd === SIDO_CODES.GYEONGGI || sidoCd === SIDO_CODES.GYEONGNAM || sidoCd === SIDO_CODES.GYEONGBUK) {
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

    // 제주도의 경우 추가 로직: "시 + 읍/면" 형태 제외
    if (sidoCd === SIDO_CODES.JEJU) {
      // "제주시 구좌읍", "서귀포시 대정읍" 같은 형태 제외, "제주시", "서귀포시"만 남김
      if (sggNm.includes('시') && (sggNm.includes('읍') || sggNm.includes('면'))) {
        return true;
      }
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

          if (response.data.success && response.data.data) {
        // 모든 데이터 사용 (첫 번째 요소 제거하지 않음)
        const allData = response.data.data;
        const filteredData = allData.filter(sigugun => {
          const sggNm = sigugun.sggNm?.trim() || '';

          // 빈 값 제외
          if (!sggNm) return false;

          // 필터링 조건 확인
          return !shouldFilterSigugun(sggNm, sidoCd, allData);
        });
      // 중복 제거 (sggNm 기준)
      const uniqueData = filteredData.filter((sigugun, index, self) =>
        index === self.findIndex(s => s.sggNm === sigugun.sggNm)
      );
      // 가나다순 정렬
      sigugunList.value = uniqueData.sort((a, b) => (a.sggNm || '').localeCompare(b.sggNm || '', 'ko'));

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
    } else {
      console.error('❌ 건물 목록 로드 실패:', response.data.message);
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

  // 세종시의 경우 바로 건물 목록으로 이동
  if (selectedSido.value?.sidoCd === SIDO_CODES.SEJONG) {
    // 세종시는 읍/면/동 단계를 건너뛰고 바로 건물 목록 로드
    const regionCode = `${selectedSido.value?.sidoCd}${sigugun.sggCd}`;
    await loadBuildingList('', regionCode); // 동 이름 없이 지역 코드만으로 검색
    currentStep.value = STEPS.BUILDING;
  } else {
    // 다른 지역은 기존처럼 읍/면/동 목록 로드
    await loadDongList(selectedSido.value?.sidoCd || '', sigugun.sggCd || '');
    currentStep.value = STEPS.DONG;
  }
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
          <!-- 세종시가 아닌 경우에만 읍/면/동 표시 -->
          <template v-if="selectedSido?.sidoCd !== '36'">
            <span class="mx-2" :class="selectedSigugun ? 'text-gray-800' : 'text-gray-400'"> > </span>
            <span
              class="cursor-pointer hover:text-gray-800"
              :class="selectedDong ? 'font-semibold text-gray-800' : 'text-gray-400'"
              @click="goToStep(3)"
            >
              {{ selectedDong?.dongNm || '읍/면/동' }}
            </span>
          </template>
          <!-- 세종시의 경우 시/군/구 선택 후 바로 건물 선택, 다른 지역은 읍/면/동 선택 후 건물 선택 -->
          <span v-if="buildingList.length > 0 && (selectedSido?.sidoCd === '36' ? selectedSigugun : selectedDong)" class="mx-2 text-gray-400"> > </span>
          <span
            v-if="buildingList.length > 0 && (selectedSido?.sidoCd === '36' ? selectedSigugun : selectedDong)"
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
          <!-- 건물 목록이 있는 경우 -->
          <div v-if="buildingList.length > 0" class="grid grid-cols-1 gap-3 p-4 pb-8">
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

          <!-- 건물 목록이 비어있는 경우 -->
          <div v-else class="flex flex-col items-center justify-center py-16 px-4">
            <div class="text-gray-500 text-center">
              <div class="text-lg mb-2">🏢</div>
              <div class="text-base font-medium mb-1">해당하는 위치에 건물이 없습니다</div>
              <div class="text-sm text-gray-400">다른 지역을 선택해보세요</div>
            </div>
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



