<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";

const apiKey = import.meta.env.VITE_YOUTH_API_KEY;
const posts = ref<any[]>([]);
const errMsg = ref<string | null>(null);

const getYouthContent = async () => {
  const url = "https://www.youthcenter.go.kr/go/ythip/getContent";
  const params = {
    apiKey: apiKey,
    pageNum: 1,
    pageSize: 10,
    pstSeCd: "01",  // 게시물 구분 코드 (예: 01은 공지사항 등)
    rtnType: "json",
  };

  try {
    const response = await axios.get(url, { params });
    const contentList = response.data.youthPolicyList || [];
    posts.value = Array.isArray(contentList) ? contentList : [contentList];
  } catch (error: any) {
    errMsg.value = error.message || "API 호출 오류";
    console.error("getContent API 오류: ", error)
  }
}

onMounted(async () => {
  getYouthContent();
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center mt-6 min-h-[15.625rem]">
    <div class="content-list">
    <h2>청년정책 게시물 목록</h2>
    <ul v-if="posts.length">
      <li v-for="(post, index) in posts" :key="index">
        <h3>{{ post.pstTtl }}</h3>
        <p v-html="post.pstWholCn"></p>
        <small>작성자: {{ post.frstRgtrNm }} | 조회수: {{ post.pstInqCnt }}</small>
        <hr />
      </li>
    </ul>
    <p v-else-if="errMsg">{{ errMsg }}</p>
    <p v-else>불러오는 중...</p>
  </div>
  </div>
</template>

<style scoped>
  .HomeNews {

  }
</style>