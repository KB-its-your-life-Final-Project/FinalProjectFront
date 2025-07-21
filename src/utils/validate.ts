// 공백 여부
export const isEmpty = (input: string | null | undefined): boolean => {
  return !input || input.trimEnd() === "";
};

// 이메일 유효성 검사
export const isValidEmailFormat = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email);
};

// 비밀번호 유효성 검사
export const isValidPasswordFormat = (password: string): boolean => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
};

// 비밀번호 일치 여부 확인
export const isValidPasswordChk = (password1: string, password2: string): boolean => {
  return password1 === password2;
};
