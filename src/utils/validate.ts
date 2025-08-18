/**
 * 공백 여부 확인
 * @param input - 검사할 문자열
 * @returns 문자열이 null, undefined 이거나 공백이면 true, 아니면 false
 */
export const isEmpty = (input: string | null | undefined): boolean => {
  return !input || input.trim() === "";
};

/**
 * 이메일 형식 유효성 검사
 * @param email - 검사할 이메일 문자열
 * @returns 형식이 올바르면 true, 아니면 false
 */
export const isValidEmailFormat = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

/**
 * 비밀번호 형식 유효성 검사
 * 최소 8자 이상, 대문자 1개 이상, 소문자 1개 이상, 숫자 1개 이상, 특수문자 1개 이상
 * @param password - 검사할 비밀번호 문자열
 * @returns 조건 만족 시 true, 아니면 false
 */
export const isValidPasswordFormat = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
};

/**
 * 비밀번호 일치 여부 확인
 * @param password1 - 첫 번째 비밀번호
 * @param password2 - 두 번째 비밀번호
 * @returns 두 비밀번호가 같으면 true, 아니면 false
 */
export const isValidPasswordChk = (password1: string, password2: string): boolean => {
  return password1 === password2;
};

/**
 * 이름 유효성 검사
 * 한글 또는 영문 2~20자
 * @param name - 검사할 이름 문자열
 * @returns 조건 만족 시 true, 아니면 false
 */
export const isValidName = (name: string): boolean => {
  const regex = /^[가-힣a-zA-Z]{2,20}$/;
  return regex.test(name.trim());
};
