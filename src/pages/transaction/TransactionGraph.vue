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
import { formatAmount } from "@/utils/numberUtils";
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

import type { GraphItemOutput, OutputDealType } from "@/utils/transactionUtils";

const props = defineProps<{
  graphData: GraphItemOutput[];
  selectedType: string;
}>();

const hasData = computed(() => props.graphData && props.graphData.length > 0);

// 1. groupedData : 날짜+타입별 { max, all[] } 형태로 그룹핑
const groupedData = computed(() => {
  const filtered =
    props.selectedType === "전체"
      ? props.graphData
      : props.graphData.filter((item) => item.type === props.selectedType);

  filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return filtered.reduce(
    (acc, cur) => {
      if (!acc[cur.type]) acc[cur.type] = {};

      const price =
        cur.type === "매매"
          ? (cur.dealAmount ?? 0)
          : cur.type === "전세"
            ? (cur.deposit ?? 0)
            : (cur.monthlyRent ?? 0);

      if (!acc[cur.type][cur.date]) {
        acc[cur.type][cur.date] = { max: price, all: [cur] };
      } else {
        acc[cur.type][cur.date].max = Math.max(acc[cur.type][cur.date].max, price);
        acc[cur.type][cur.date].all.push(cur);
      }
      return acc;
    },
    {} as Record<string, Record<string, { max: number; all: GraphItemOutput[] }>>,
  );
});

const formatDateShort = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
};

const chartData = computed(() => {
  const filtered =
    props.selectedType === "전체"
      ? props.graphData
      : props.graphData.filter((item) => item.type === props.selectedType);

  filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const allDates = [...new Set(filtered.map((item) => item.date))].sort();

  const colorMap: Record<OutputDealType, string> = {
    매매: "#4caf50",
    전세: "#ff9800",
    월세: "#3f51b5",
  };

  const bgColorMap: Record<OutputDealType, string> = {
    매매: "rgba(76, 175, 80, 0.1)",
    전세: "rgba(255, 152, 0, 0.1)",
    월세: "rgba(63, 81, 181, 0.1)",
  };

  const datasets = Object.entries(groupedData.value).map(([type, dateMap]) => {
    const borderColor = colorMap[type as OutputDealType] ?? "#000000";
    const backgroundColor = bgColorMap[type as OutputDealType] ?? "rgba(0,0,0,0.1)";
    return {
      label: type,
      data: allDates.map((date) => dateMap[date]?.max ?? null),
      borderColor,
      backgroundColor,
      fill: true,
      tension: 0.1,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 1,
      spanGaps: true,
    };
  });

  return {
    labels: allDates.map(formatDateShort),
    datasets,
  };
});

const chartOptions = computed(() => {
  const prices = props.graphData.map((item) => {
    if (item.type === "매매") return item.dealAmount ?? 0;
    if (item.type === "전세") return item.deposit ?? 0;
    if (item.type === "월세") return item.monthlyRent ?? 0;
    return 0;
  });

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  let unit = 1; // 기본 만원 단위 (1)
  let unitLabel = "만";

  if (maxPrice >= 10000) {
    unit = 10000;
    unitLabel = "억";
  } else if (maxPrice >= 1000) {
    unit = 1000;
    unitLabel = "천만";
  } else if (maxPrice >= 100) {
    unit = 100;
    unitLabel = "백만";
  }

  const minY = Math.floor(minPrice * 0.95);
  const maxY = Math.ceil(maxPrice * 1.05);

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
          label: (tooltipItem: TooltipItem<"line">) => {
            const type = tooltipItem.dataset.label as OutputDealType;
            const allDates = chartData.value.labels.map((label) => {
              // labels 는 yy.mm.dd 포맷이라 실제 날짜와 다름,
              // props.graphData에서 date 기준으로 찾자
              return (
                props.graphData.find((item) => formatDateShort(item.date) === label)?.date ?? ""
              );
            });
            const dateStr = allDates[tooltipItem.dataIndex];
            const allDeals = groupedData.value[type]?.[dateStr]?.all ?? [];

            // 모든 거래 내역을 줄바꿈으로 리턴 (tooltip은 문자열 배열도 지원)
            return allDeals.map((deal) => {
              if (deal.type === "매매") {
                return `${type} ${formatAmount(deal.dealAmount ?? 0)}`;
              } else if (deal.type === "전세") {
                return `${type} ${formatAmount(deal.deposit ?? 0)}`;
              } else {
                return `${type} ${formatAmount(deal.monthlyRent ?? 0)}, 보증금: ${formatAmount(deal.deposit ?? 0)}`;
              }
            });
          },
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
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        min: minY,
        max: maxY,
        ticks: {
          callback: function (value: string | number) {
            const numValue = typeof value === "string" ? parseFloat(value) : value;
            const displayValue = unit === 1 ? numValue : numValue / unit;
            const formattedValue =
              unit === 1 ? displayValue.toLocaleString() : displayValue.toFixed(1);
            return formattedValue + unitLabel;
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
