// 공백 여부
export const isEmpty = (input: string | null | undefined): boolean => {
  return !input || input.trim() === "";
};

// 이메일 유효성 검사
export const isValidEmailFormat = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// 비밀번호 유효성 검사
export const isValidPasswordFormat = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
};

// 비밀번호 일치 여부 확인
export const isValidPasswordChk = (password1: string, password2: string): boolean => {
  return password1 === password2;
};

// 이름 유효성 검사
export const isValidName = (name: string): boolean => {
  const regex = /^[가-힣a-zA-Z]{2,20}$/;
  return regex.test(name.trim());
};
