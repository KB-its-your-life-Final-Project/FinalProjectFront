<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { computed } from "vue";
import type { TooltipItem } from "chart.js";
import TransactionNotFound from "./_component/TransactionNotFound.vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  zoomPlugin,
);

const props = defineProps<{
  graphData: { date: string; price: number; type: string }[];
  selectedType: string;
}>();

const hasData = computed(() => {
  return props.graphData && props.graphData.length > 0;
});

const chartData = computed(() => {
  console.log(" [그래프 데이터 확인]", props.graphData);
  const filtered =
    props.selectedType === "전체"
      ? props.graphData
      : props.graphData.filter((item) => item.type === props.selectedType);
  // 날짜순으로 나열
  filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  //모든 날짜들 구하기
  const allDates = [...new Set(filtered.map((item) => item.date))].sort();

  const grouped = filtered.reduce(
    (acc, cur) => {
      if (!acc[cur.type]) acc[cur.type] = {};
      acc[cur.type][cur.date] = cur.price;
      return acc;
    },
    {} as Record<string, Record<string, number>>,
  );

  // 모든 거래 유형에 대해 가격 데이터 정리
  const datasets = Object.entries(grouped).map(([type, dateMap], idx) => ({
    label: type,
    data: allDates.map((date) => dateMap[date] ?? null),
    borderColor: ["#4caf50", "#ff9800", "#3f51b5"][idx],
    backgroundColor: ["rgba(76, 175, 80, 0.1)", "rgba(255, 152, 0, 0.1)", "rgba(63, 81, 181, 0.1)"][
      idx
    ],
    fill: true,
    tension: 0.1, // 곡선
    pointRadius: 4,
    pointHoverRadius: 6,
    borderWidth: 1,
    spanGaps: true,
  }));

  return {
    labels: allDates,
    datasets: datasets,
  };
});

// y축 + 줌인 기능
const chartOptions = computed(() => {
  const prices = props.graphData.map((item) => item.price);
  const minY = Math.floor(Math.min(...prices) * 0.95);
  const maxY = Math.ceil(Math.max(...prices) * 1.05);

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        align: "center" as const,
        labels: {
          boxWidth: 12,
          padding: 20,
        },
        onClick: () => {},
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (tooltipItem: TooltipItem<"line">) =>
            `${tooltipItem.dataset.label} ${tooltipItem.raw}`,
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x" as const,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x" as const,
        },
      },
    },
    interaction: {
      //타입충돌예방
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        min: minY,
        max: maxY,
        ticks: {
          stepSize: Math.ceil((maxY - minY) / 5),
          callback: function (value: string | number) {
            const numValue = typeof value === "string" ? parseFloat(value) : value;
            return (numValue / 10000).toFixed(1) + "억";
          },
        },
      },
    },
  };
});
</script>

<template>
  <div class="mt-8 h-[400px]">
    <TransactionNotFound v-if="!hasData" />
    <Line v-else :data="chartData" :options="chartOptions" />
  </div>
</template>
