const transactionPeriodOptions = [
  { label: "전체", value: "전체" },
  { label: "1년", value: "1" },
  { label: "3년", value: "3" },
  { label: "5년", value: "5" },
];

type TransactionPeriodType = (typeof transactionPeriodOptions)[number];

export { transactionPeriodOptions };
export type { TransactionPeriodType };
