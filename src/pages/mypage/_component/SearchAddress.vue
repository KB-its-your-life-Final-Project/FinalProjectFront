<template>
  <div class="border border-gray-300 mt-4 rounded-md">
    <div class="space-y-2">
      <input v-model="roadAddress" placeholder="도로명주소" class="p-2 w-full" readonly />
      <input
        v-model="jibunAddress"
        placeholder="지번주소"
        class="border-y border-gray-300 p-2 w-full"
        readonly
      />
      <div class="relative">
        <input v-model="extraAddress" placeholder="참고 항목" class="p-2" readonly />
        <button
          @click="openPostcode"
          class="bg-kb-yellow-positive text-white px-4 rounded-rb absolute right-0 h-1/1 cursor-pointer"
        >
          주소 찾기
        </button>
      </div>
    </div>
  </div>
  <div></div>
  <div
    ref="layerContainer"
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white w-full h-full rounded-md hidden"
  >
    <div class="bg-kb-yellow rounded-t-lg h-12">
      <button class="px-5 py-3 text-lg cursor-pointer" @click="closeLayer">X</button>
    </div>
    <div ref="layerContent" class="h-[calc(100%-48px)]">
      <!-- 여기에 postcode iframe이 embed 됩니다 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const roadAddress = ref("");
const jibunAddress = ref("");
const extraAddress = ref("");
const layerContainer = ref<HTMLElement | null>(null);
const layerContent = ref<HTMLElement | null>(null);
let postcodeRef: any = null;
function openLayer() {
  if (layerContainer.value) {
    layerContainer.value.classList.remove("hidden");
  }
}

function closeLayer() {
  if (layerContainer.value) {
    layerContainer.value.classList.add("hidden");
  }
}
onMounted(() => {
  if (!window.daum || !window.daum.postcode) {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = () => console.log("Daum postcode script loaded");
    document.head.appendChild(script);
  }
});

function openPostcode() {
  if (!window.daum || !window.daum.Postcode) return;

  postcodeRef = new window.daum.Postcode({
    oncomplete: (data: any) => {
      let extra = "";

      if (data.userSelectedType === "R") {
        if (data.bname && /[동|로|가]$/g.test(data.bname)) extra += data.bname;
        if (data.buildingName && data.apartment === "Y")
          extra += extra ? `, ${data.buildingName}` : data.buildingName;
        if (extra) extra = ` (${extra})`;
      }

      roadAddress.value = data.roadAddress;
      jibunAddress.value = data.jibunAddress;
      extraAddress.value = extra;

      closeLayer();
    },
    width: "100%",
    height: "100%",
    maxSuggestItems: 5,
  });
  if (layerContent.value) {
    postcodeRef.embed(layerContent.value);
  }
  openLayer();
}
</script>
<style>
.scrollbar-hide {
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
