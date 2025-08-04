import { defineStore } from "pinia";
import { ref } from "vue";
import { getTransactionData } from "@/api/transactionApi";

export const useTransactionStore = defineStore("transaction", () => {
  const graphData = ref<{ date: string; price: number; type: string }[]>([]);

  const fetchGraphData = async (type: string, year: number) => {
    const res = await getTransactionData(type, year);
    graphData.value = res;
  };

  return {
    graphData,
    fetchGraphData,
  };
});
