<script setup lang="ts"></script>

<template>
  <header class="bg-kb-yellow w-full h-[6rem]">
    <h1 class="text-2xl font-pretendard-bold">회원가입</h1>
  </header>
  <div class="flex flex-col items-center">
    <form action="" method="post" class="w-5/6 h-auto flex flex-col gap-3">
      <div>
        <label for="username"> 이메일 주소 </label>
        <div class="flex flex-row w-full h-auto">
          <input class="flex-grow rounded-l-md h-11 min-w-0" type="email" placeholder="이메일을 입력하세요" />
          <button class="submit-btn rounded-r-md w-24 h-11 text-white whitespace-nowrap">인증</button>
        </div>
      </div>
      <div>
        <label for="verification-code"> 인증 번호 </label>
        <input class="w-full h-11 rounded-md" type="email" placeholder="인증번호를 입력하세요" />
      </div>
      <div>
        <label for="password"> 비밀번호 </label>
        <input
          class="w-full h-11 rounded-md"
          type="password"
          placeholder="비밀번호를 입력하세요"
          id="password1"
        />
      </div>
      <div>
        <label for="password"> 비밀번호 확인 </label>
        <input
          class="w-full h-11 rounded-md"
          type="password"
          placeholder="비밀번호 확인"
          id="password2"
        />
      </div>
      <button class="submit-btn w-full h-12 rounded-xl text-white" type="submit">확인</button>
    </form>
  </div>
</template>

<style scoped>
header {
  padding: 2rem;
}
input {
  border: 1px solid #c2c2c2;
  padding: 0.7rem;
}
.submit-btn {
  background-color: #ffbc00;
}
form {
  margin-top: 3rem;
}
</style>
