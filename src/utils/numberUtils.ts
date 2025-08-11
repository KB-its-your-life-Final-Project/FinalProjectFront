/**
 * 숫자를 한글 금액으로 변환
 * @param num - 변환할 숫자
 * @param removeUnit - 제거할 단위 (예: "만")
 * @returns 한글 금액 문자열
 */
export function numberToKorean(num: number, removeUnit = ""): string {
  if (num === 0) return removeUnit ? "" : "영원";

  const unitWords = ["", "만", "억"];
  const smallUnitWords = ["", "십", "백", "천"];
  const numberWords = ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  const result = [];
  let unitPos = 0;

  while (num > 0) {
    const part = num % 10000;
    if (part > 0) {
      let section = "";
      const digits = part.toString().padStart(4, "0").split("").map(Number);

      digits.forEach((digit, idx) => {
        if (digit !== 0) {
          if (!(digit === 1 && idx !== 3)) {
            section += numberWords[digit];
          }
          section += smallUnitWords[3 - idx];
        }
      });

      const unit = unitWords[unitPos];
      if (unit !== removeUnit) {
        result.unshift(section + unit);
      } else {
        result.unshift(section);
      }
    }
    unitPos++;
    num = Math.floor(num / 10000);
  }

  return result.join("");
}

/**
 * 숫자 입력값을 정리 (숫자만 허용)
 * @param value - 입력값
 * @returns 정리된 숫자 문자열
 */
export function sanitizeNumberInput(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

/**
 * 예산 입력값 검증
 * @param value - 검증할 값
 * @param maxValue - 최대값 (기본값: 999999)
 * @returns 검증 결과
 */
export function validateBudgetInput(value: string, maxValue = 999999) {
  const numericValue = Number(value);

  if (value === "") {
    return { isValid: true, value: "", error: null };
  }

  if (numericValue > maxValue) {
    return {
      isValid: false,
      value: maxValue.toString(),
      error: `최대 ${maxValue}까지 입력 가능합니다.`,
    };
  }

  return { isValid: true, value, error: null };
}

/**
 * 숫자를 억, 만원 단위로 변경
 * @param amount - 금액(만원 단위)
 * @returns x,xxx억 y,yyy만원
 */
export function formatAmount(amount?: number): string {
  if (amount === undefined || isNaN(amount)) return "-";

  const billion = Math.floor(amount / 10000);
  const million = amount % 10000;

  if (billion > 0 && million > 0) {
    return `${billion}억 ${million.toLocaleString()} 만원`;
  } else if (billion > 0) {
    return `${billion}억원`;
  } else {
    return `${million.toLocaleString()} 만원`;
  }
}
