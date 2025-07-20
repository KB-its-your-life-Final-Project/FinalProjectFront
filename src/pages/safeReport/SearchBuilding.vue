<script setup lang="ts">
import { ref, onMounted } from 'vue'
const props = defineProps({ formData: Object })
const emit = defineEmits(['update','next','prev'])

const buildingName = ref(props.formData.buildingName)
const roadAddress = ref(props.formData.roadAddress)
const jibunAddress = ref(props.formData.jibunAddress)
const dongName = ref(props.formData.dongname)

// 주소 api 로드
onMounted(() => {
  if (!window.daum) {
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    document.head.appendChild(script);
  }
});
// 주소 자동 완성 api
function search() {
  if (!(window as any).daum) return;

  const postcode = new (window as any).daum.Postcode({
    oncomplete(data: any) {
      // (window as any).__DAUM_ADDR__=data;
      // alert("데이터 저장됨!");

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
        class="flex-1 border border-gray-300 rounded-full py-2 pl-4 focus:outline-none cursor-not-allowed"
        disabled
      />
      <button
        @click="search"
        class="px-4 py-2 border border-gray-300 rounded-full text-gray-600 disabled:opacity-50"
      >
        주소 찾기
      </button>
    </div>

    <div class="fixed z-10 inset-x-0 bottom-6 flex justify-end px-6 pb-24">
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
