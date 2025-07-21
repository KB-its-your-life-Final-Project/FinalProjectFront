<template>
  <div class="mt-4">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs"
import {
  Chart as ChartJS,
  Title, Tooltip, Legend, LineElement,
  CategoryScale, LinearScale, PointElement
} from "chart.js"
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

import { computed } from "vue"

const props = defineProps<{
  graphData: { date: string; price: number; type: string }[]
}>()

const chartData = computed(() => {
  const grouped = props.graphData.reduce((acc, cur) => {
    acc[cur.type] = acc[cur.type] || { labels: [], data: [] }
    acc[cur.type].labels.push(cur.date)
    acc[cur.type].data.push(cur.price)
    return acc
  }, {} as any)

  return {
    labels: grouped["매매"]?.labels || [],
    datasets: Object.entries(grouped).map(([type, d], idx) => ({
      label: type,
      data: d.data,
      borderColor: ["#4caf50", "#ff9800", "#2196f3"][idx],
      fill: false
    }))
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    tooltip: { enabled: true }
  },
  scales: {
    y: { beginAtZero: false }
  }
}
</script>
