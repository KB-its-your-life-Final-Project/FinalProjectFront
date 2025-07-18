<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
const props = defineProps({ formData: Object })
const emit = defineEmits(['update','next','prev'])

const BuildingName = ref(props.formData.buildingName)
const roadAddress = ref(props.formData.roadAddress)
const jibunAddress = ref(props.formData.jibunAddress)
const extraAddress = ref(props.formData.jibunAddress)

watch(BuildingName, val => {emit('update', { buildingName: val })})
watch(roadAddress,  val => emit('update', { roadAddress: val }));
watch(jibunAddress, val => emit('update', { jibunAddress: val }));
watch(extraAddress, val => emit('update', { extraAddress: val }));

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
  new (window as any).daum.Postcode({
    oncomplete(data: any) {
      // 주소 조합해서 건물명으로 바꾸기
      (window as any).__DAUM_ADDR__=data;
      alert("데이터 저장됨!");
      let roadAddr = data.roadAddress || '';
      let extraRoadAddr = '';


      if (data.bname && /[동|로|가]$/.test(data.bname)) extraRoadAddr += data.bname;
      if (data.buildingName && data.apartment === 'Y') {
        extraRoadAddr += (extraRoadAddr ? `, ${data.buildingName}` : data.buildingName);
      }
      extraRoadAddr = extraRoadAddr ? `(${extraRoadAddr})` : '';

      // 상태 업데이트
      roadAddress.value  = roadAddr;//도로명 주소
      jibunAddress.value = data.jibunAddress;//지번 주소
      extraAddress.value = extraRoadAddr;

      // 필요하다면 건물명 필드에도 반영
      BuildingName.value = data.buildingName || BuildingName.value;
    }
  }).open();
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
        v-model="BuildingName"
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
        :disabled="!BuildingName.trim()"
        class="px-4 py-2 bg-kb-yellow rounded text-kb-ui-11 disabled:opacity-50"
      >
        다음
      </button>
    </div>

  </div>

</template>

<style scoped>

</style>
