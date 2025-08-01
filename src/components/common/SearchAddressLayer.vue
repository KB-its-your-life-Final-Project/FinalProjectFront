<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  visible: boolean;
  returnFields?: Array<"roadAddress" | "jibunAddress" | "buildingName" | "dongName">;
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
          const fullAddressPayload = {
            roadAddress: data.roadAddress,
            jibunAddress: data.jibunAddress,
            buildingName: data.buildingName && data.apartment === "Y" ? data.buildingName : "",
            dongName: data.bname && /[동|로|가]$/g.test(data.bname) ? data.bname : "",
          };

          const filteredPayload = props.returnFields
            ? props.returnFields.reduce(
                (acc, key) => {
                  acc[key] = fullAddressPayload[key];
                  return acc;
                },
                {} as Record<string, string>,
              )
            : fullAddressPayload;

          emit("complete", filteredPayload);
          emit("close");
        },
        width: "100%",
        height: "100%",
      });

      postcodeRef.embed(layerContent.value);
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
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white w-full h-full rounded-md"
  >
    <div class="bg-kb-yellow rounded-t-lg h-12">
      <button class="px-5 py-3 text-lg cursor-pointer" @click="closeLayer">X</button>
    </div>
    <div ref="layerContent" class="h-[calc(100%-48px)]">
      <!-- 여기에 postcode iframe이 embed 됩니다 -->
    </div>
  </div>
</template>
