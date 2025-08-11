const transactionPeriodOptions = [
  { label: "6개월", value: "6" },
  { label: "1년", value: "12" },
  { label: "3년", value: "36" },
  { label: "5년", value: "60" },
];

type TransactionPeriodType = (typeof transactionPeriodOptions)[number];

export { transactionPeriodOptions };
export type { TransactionPeriodType };
