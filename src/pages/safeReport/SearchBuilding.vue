<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = defineProps({ formData: Object })
const emit = defineEmits(['update','next','prev'])

const buildingName = ref(props.formData.buildingName)
const roadAddress = ref(props.formData.roadAddress)
const jibunAddress = ref(props.formData.jibunAddress)
const dongName = ref(props.formData.dongname)
const lat = ref(props.formData.lat)
const lng = ref(props.formData.lng)
const naverReady = ref(false)

// DAUM 우편 번호 API + Naver Maps API 호출
onMounted(() => {
  // Daum 우편번호 API
  if (!window.daum) {
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    document.head.appendChild(script);
  }
  // Naver Maps API 호출
  if (!window.naver?.maps) {
    const naverScript = document.createElement("script")
    naverScript.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=55s76chbvh&submodules=geocoder"
    naverScript.async = true
    naverScript.onload = () => {
      naverReady.value = true
    }
    document.head.appendChild(naverScript)
  } else {
    naverReady.value = true
  }
});

// 주소 검색
function search() {
  if (!(window as any).daum) return;

  const postcode = new (window as any).daum.Postcode({
    oncomplete(data: any) {
      console.log('선택된 주소 데이터: ',data);

      roadAddress.value = data.roadAddress||'';
      jibunAddress.value =
        data.jibunAddress && data.jibunAddress.trim() !== ''
          ? data.jibunAddress
          : data.userSelectedType === 'R'
            ? '(지번 주소 없음)'
            : '';
      dongName.value = /[동|로|가]$/.test(data.bname)?data.bname:'';
      buildingName.value = data.buildingName||'';

      //도로명 주소 -> 위/경도로
      if(roadAddress.value&&naverReady.value){
        searchAddressToCoordinate(jibunAddress.value);
      }
      emit('update', {
        roadAddress: roadAddress.value,
        jibunAddress: jibunAddress.value,
        buildingName: buildingName.value,
        dongName: dongName.value
      });
    }
  });
  postcode.open();
}

// 지번 주소 -> 위도/경도
function searchAddressToCoordinate(address: string) {
  if (!window.naver?.maps?.Service) {
    alert("네이버 지도 API가 아직 로드되지 않았습니다.");
    return;
  }

  naver.maps.Service.geocode(
    {
      query: address,
    },
    function (status, response) {
      if (status !== naver.maps.Service.Status.OK) {
        alert("주소를 좌표로 변환하는 데 실패했습니다.");
        return;
      }

      const result = response.v2;
      if (result.meta.totalCount === 0) {
        alert("결과가 없습니다.");
        return;
      }

      const { x, y } = result.addresses[0];
      const latVal = parseFloat(y);
      const lngVal = parseFloat(x);

      console.log("✅ 위도:", lat, "경도:", lng);

      Object.assign(props.formData, {
        lat: latVal,
        lng: lngVal,
      });

      emit("update", {
        ...props.formData,  // 여기서 완전한 최신값을 emit
      });
    }
  );
}


function next(){
  emit('next')
}


</script>

<template>
  <div class="relative flex flex-col flex-1 px-6 gap-6">
    <div>
      <h1 class="text-2xl font-pretendard-bold mb-1">
        진단받고자 하는 곳이 어디인가요?
      </h1>
      <p class="text-kb-ui-05">
        건물명을 입력해주세요.
      </p>
    </div>

    <div class="w-full max-w-lg mx-auto flex gap-4 items-center space-x-2">
      <input
        v-model="buildingName"
        type="text"
        placeholder="주소 찾기로 입력"
        class="flex-1 border accent-kb-ui-05 rounded-full py-2 pl-4 focus:outline-none cursor-not-allowed"
        disabled
      />
      <button
        @click="search"
        class="px-4 py-2 border accent-kb-ui-05 rounded-full text-kb-ui-03 disabled:opacity-50"
      >
        주소 찾기
      </button>
    </div>

    <div class="fixed z-auto inset-x-0 bottom-6 flex justify-end px-6 pb-24">
      <button
        @click="next"
        :disabled="!buildingName.trim()"
        class="px-4 py-2 bg-kb-yellow rounded text-kb-ui-11 disabled:opacity-50"
      >
        다음
      </button>
    </div>

  </div>

</template>

<style scoped>

</style>
