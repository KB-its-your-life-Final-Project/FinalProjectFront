<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  visible: boolean;
  returnFields?: Array<"roadAddress" | "jibunAddress" | "buildingName" | "dongName">;
  fullscreen?: boolean; // 전체 화면 모드 여부
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "complete",
    payload: Partial<{
      roadAddress: string;
      jibunAddress: string;
      buildingName: string;
      dongName: string;
    }>,
  ): void;
}>();

const layerContent = ref<HTMLElement | null>(null);

const ensureScript = () => {
  return new Promise<void>((resolve) => {
    if (window.daum?.Postcode) return resolve();
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

watch(
  () => props.visible,
  async (val) => {
    if (val && layerContent.value) {
      await ensureScript();
      const postcodeRef = new window.daum.Postcode({
        oncomplete: (data: any) => {
          console.log("📍 Daum Postcode oncomplete 호출됨, 원본 데이터:", data);

          const fullAddressPayload = {
            roadAddress: data.roadAddress || data.autoRoadAddress || "",
            jibunAddress: data.jibunAddress || data.autoJibunAddress || "",
            buildingName: data.buildingName || "",
            dongName: data.bname && /[동|로|가]$/g.test(data.bname) ? data.bname : "",
            umdNm: data.bname || "",
            jibunAddr: data.jibunAddress || data.autoJibunAddress || "",
          };

          console.log("📍 fullAddressPayload 생성됨:", fullAddressPayload);
          console.log("📍 roadAddress 값:", fullAddressPayload.roadAddress);

          const filteredPayload = props.returnFields
            ? props.returnFields.reduce(
                (acc, key) => {
                  acc[key] = fullAddressPayload[key];
                  return acc;
                },
                {} as Record<string, string>,
              )
            : fullAddressPayload;

          console.log("📍 최종 emit할 payload:", filteredPayload);
          console.log("📍 최종 roadAddress 값:", filteredPayload.roadAddress);

          emit("complete", filteredPayload);
          emit("close");
        },
        width: "100%",
        height: "100%",
      });

      postcodeRef.embed(layerContent.value);

      // iframe 내부 스타일 주입 (글자 크기 조정)
      setTimeout(() => {
        const iframe = layerContent.value?.querySelector("iframe");
        if (iframe) {
          try {
            // iframe 로드 완료 후 스타일 주입
            iframe.onload = () => {
              try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (doc) {
                  const style = doc.createElement("style");
                  style.textContent = `
                    * { font-size: 16px !important; }
                    body { font-size: 16px !important; }
                    input { font-size: 16px !important; }
                    button { font-size: 16px !important; }
                    .tip { font-size: 14px !important; }
                    .example { font-size: 14px !important; }
                    .search_tip { font-size: 14px !important; }
                    .postcode_search { font-size: 16px !important; }
                    .postcode_search input { font-size: 16px !important; }
                    .postcode_search button { font-size: 16px !important; }
                  `;
                  doc.head.appendChild(style);
                }
              } catch (e) {
                console.log("iframe 스타일 주입 실패:", e);
              }
            };
          } catch (e) {
            console.log("iframe 접근 실패:", e);
          }
        }
      }, 200);
    }
  },
  { immediate: true },
);

function closeLayer() {
  emit("close");
}
</script>

<template>
  <div
    v-show="visible"
    :class="[
      props.fullscreen
        ? 'fixed inset-0 z-[9999] bg-white'
        : 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white w-full h-full rounded-md',
    ]"
  >
    <div class="bg-kb-yellow h-12 flex items-center">
      <button class="px-5 py-3 text-lg cursor-pointer" @click="closeLayer">X</button>
    </div>
    <div
      ref="layerContent"
      :class="[props.fullscreen ? 'h-[calc(100vh-48px)]' : 'h-[calc(100%-48px)]']"
    >
      <!-- 여기에 postcode iframe이 embed 됩니다 -->
    </div>
  </div>
</template>
