<template>
  <div class="space-y-2 mt-4 w-4/5">
    <input v-model="roadAddress" placeholder="도로명주소" class="border p-2 w-full" readonly />
    <input v-model="jibunAddress" placeholder="지번주소" class="border p-2 w-full" readonly />
    <div class="flex">
      <input v-model="extraAddress" placeholder="참고 항목" class="border p-2 flex-[3]" readonly />
      <button
        @click="openPostcode"
        class="bg-blue-500 text-white px-4 rounded flex-[1] cursor-pointer"
      >
        주소 찾기
      </button>
    </div>
    <div ref="layer" class="fixed hidden z-50 bg-white rounded-lg">
      <div class="flex justify-start p-2 border-b">
        <button class="text-lg px-3 py-1 cursor-pointer" @click="closeLayer">X</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const roadAddress = ref("");
const jibunAddress = ref("");
const extraAddress = ref("");
const layer = ref<HTMLElement | null>(null);
let postcodeRef: any = null;
function closeLayer() {
  if (layer.value) {
    layer.value.style.display = "none";
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

      layer.value!.style.display = "none";
    },
    width: "100%",
    height: "100%",
    maxSuggestItems: 5,
  });
  postcodeRef.embed(layer.value!);

  setTimeout(() => {
    if (layer.value) {
      const width = 400;
      const height = 500;
      const borderWidth = 1;

      layer.value.style.display = "block";
      layer.value.style.width = width + "px";
      layer.value.style.height = height + "px";
      layer.value.style.border = borderWidth + "px solid #333";
      layer.value.style.left =
        ((window.innerWidth || document.documentElement.clientWidth) - width) / 2 -
        borderWidth +
        "px";
      layer.value.style.top =
        ((window.innerHeight || document.documentElement.clientHeight) - height) / 2 -
        borderWidth +
        "px";
    }
  }, 100); // 레이어 위치 조정을 위한 딜레이
}
</script>
