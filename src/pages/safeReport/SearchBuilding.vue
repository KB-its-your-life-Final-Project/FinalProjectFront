<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
const props = defineProps({ formData: Object })
const emit = defineEmits(['update','next','prev'])

const buildingName = ref(props.formData.buildingName)
const roadAddress = ref(props.formData.roadAddress)
const jibunAddress = ref(props.formData.jibunAddress)
const dongName = ref(props.formData.dongname)
const naverReady = ref(false)
const showPostcode = ref(false)

// DAUM 우편 번호 API + Naver Maps API 호출
onMounted(() => {
  if (!window.daum) {
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    document.head.appendChild(script);
  }
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

function search() {
  showPostcode.value = true;

  nextTick(() => {
    const container = document.getElementById('postcodeContainer');
    if (!container || !(window as any).daum?.Postcode) return;

    const postcode = new (window as any).daum.Postcode({
      oncomplete(data: any) {
        console.log('선택된 주소 데이터: ', data);

        roadAddress.value = data.roadAddress || '';
        jibunAddress.value = data.jibunAddress || '';
        dongName.value = /[동|로|가]$/.test(data.bname) ? data.bname : '';
        buildingName.value = data.buildingName || '';
        showPostcode.value = false;

        if (jibunAddress.value && naverReady.value) {
          searchAddressToCoordinate(jibunAddress.value);
        }

        emit('update', {
          roadAddress: roadAddress.value,
          jibunAddress: jibunAddress.value,
          buildingName: buildingName.value,
          dongName: dongName.value,
        });
      },
      onclose: () => {
        showPostcode.value = false;
      },
      width: '100%',
      height: '100%',
    });

    postcode.embed(container);
  });
}

function searchAddressToCoordinate(address: string) {
  if (!window.naver?.maps?.Service) {
    alert("네이버 지도 API가 아직 로드되지 않았습니다.");
    return;
  }

  naver.maps.Service.geocode(
    { query: address },
    function (status, response) {
      if (status !== naver.maps.Service.Status.OK) {
        alert("주소를 좌표로 변환하는 데 실패했습니다.");
        return;
      }

      const result = response.v2;
      if (result.meta.totalCount === 0) {
        alert("DB에 해당하는 주소 데이터가 없습니다.");
        return;
      }

      const { x, y } = result.addresses[0];
      const latVal = parseFloat(y);
      const lngVal = parseFloat(x);

      console.log("✅ 위도:", latVal, "경도:", lngVal);

      Object.assign(props.formData, {
        lat: latVal,
        lng: lngVal,
      });

      emit("update", {
        ...props.formData,
      });
    }
  );
}

function next() {
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
        class="flex-1 border accent-kb-ui-05 rounded-full py-2 pl-4 focus:outline-none"
        readonly
        @click="search"
      />
      <button
        @click="search"
        class="px-4 py-2 border accent-kb-ui-05 rounded-full text-kb-ui-03 disabled:opacity-50"
      >
        주소 찾기
      </button>
    </div>

  <!--    주소 검색 창 -->
    <teleport to="body">
      <div
        v-if="showPostcode"
        class="fixed left-0 top-0 w-screen h-screen z-[9999] bg-white flex items-center justify-center"
      >
        <div id="postcodeContainer" class="w-full h-full" style="min-height: 400px"></div>
        <button
          class="absolute top-2 right-2 z-[10000] bg-white text-sm border px-2 py-1 rounded"
          @click="showPostcode = false"
        >
          닫기
        </button>
      </div>
    </teleport>

    <div class="fixed z-0 inset-x-0 bottom-6 flex justify-end px-6 pb-24">
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
