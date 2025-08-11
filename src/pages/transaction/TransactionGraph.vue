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

const hasData = computed(() => {
  return props.graphData && props.graphData.length > 0;
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
  console.log(" [그래프 데이터 확인]", props.graphData);
  const filtered =
    props.selectedType === "전체"
      ? props.graphData
      : props.graphData.filter((item) => item.type === props.selectedType);

  filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const allDates = [...new Set(filtered.map((item) => item.date))].sort();

  const grouped = filtered.reduce(
    (acc, cur) => {
      if (!acc[cur.type]) acc[cur.type] = {};
      let price = 0;
      if (cur.type === "매매") {
        price = cur.dealAmount ?? 0;
      } else if (cur.type === "전세") {
        price = cur.deposit ?? 0; // 전세는 보증금 중심
      } else if (cur.type === "월세") {
        price = cur.monthlyRent ?? 0; // 월세는 월세금액 중심
      }
      acc[cur.type][cur.date] = price;
      return acc;
    },
    {} as Record<string, Record<string, number>>,
  );

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

  const datasets = Object.entries(grouped).map(([type, dateMap]) => {
    const borderColor = colorMap[type as OutputDealType] ?? "#000000";
    const backgroundColor = bgColorMap[type as OutputDealType] ?? "rgba(0,0,0,0.1)";
    return {
      label: type,
      data: allDates.map((date) => dateMap[date] ?? null),
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

// tooltip 콜백에 보증금 같이 표기
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
    // 1억 이상 (10000만원)
    unit = 10000;
    unitLabel = "억";
  } else if (maxPrice >= 1000) {
    // 1천만원 이상 (1000만원)
    unit = 1000;
    unitLabel = "천만";
  } else if (maxPrice >= 100) {
    // 100만원 이상
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
            const item = props.graphData[tooltipItem.dataIndex];
            const rawValue = tooltipItem.raw as number | null;

            if (rawValue === null || rawValue === undefined)
              return `${tooltipItem.dataset.label}: 데이터 없음`;

            let priceLabel = "";
            const price = formatAmount(rawValue);

            if (item.type === "매매") {
              priceLabel = `${price}`;
            } else if (item.type === "전세") {
              priceLabel = ` ${price}`;
            } else if (item.type === "월세") {
              const deposit = item.deposit !== undefined ? formatAmount(item.deposit) : "-";
              priceLabel = `${price}, 보증금: ${deposit}`;
            }

            return `${tooltipItem.dataset.label} ${priceLabel}`;
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
