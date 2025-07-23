<template>
  <div class="mt-8 h-[400px]">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs"
import {
  Chart as ChartJS,
  Title, Tooltip, Legend, LineElement,
  CategoryScale, LinearScale, PointElement,Filler
} from "chart.js"
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement,Filler)

import { computed } from "vue"


const props = defineProps<{
  graphData: { date: string; price: number; type: string }[]
  selectedType: string
}>()


/*const chartData = computed(() => {
  const filteredData = props.selectedType === "전체"
    ? props.graphData
    : props.graphData.filter(item => item.type === props.selectedType)

  const grouped = filteredData.reduce((acc, cur) => {
    acc[cur.type] = acc[cur.type] || { labels: [], data: [] }
    acc[cur.type].labels.push(cur.date)
    acc[cur.type].data.push(cur.price)
    return acc
  }, {} as any)*/


const chartData = computed(() => {
  const filteredData =
    props.selectedType === "전체"
      ? props.graphData
      : props.graphData.filter((item) => item.type === props.selectedType)


  const grouped = filteredData.reduce((acc, cur) => {
    acc[cur.type] = acc[cur.type] || { labels: [], data: [] }
    acc[cur.type].labels.push(cur.date)
    acc[cur.type].data.push(cur.price)
    return acc
  }, {} as any)

  const firstGroup = Object.values(grouped)[0]
  const labels = firstGroup?.labels || []

  /*return {
    labels,
    datasets: Object.entries(grouped).map(([type, d], idx) => ({
      label: type,
      data: d.data,
      borderColor: ["#4caf50", "#ff9800", "#2196f3"][idx],
      fill: false
    }))
  }
})*/
  return {
    labels,
    datasets: Object.entries(grouped).map(([type, d], idx) => ({
      label: type,
      data: d.data,
      borderColor: ["#4caf50", "#ff9800", "#3f51b5"][idx],
      backgroundColor: [
        "rgba(76, 175, 80, 0.1)",
        "rgba(255, 152, 0, 0.1)",
        "rgba(63, 81, 181, 0.1)"
      ][idx],

    /*  fill: 'origin',*/
/*
      const baseColor = ["#4caf50", "#ff9800"][idx]
      return {
        label: type,
        data: d.data,
        borderColor: baseColor,
      backgroundColor: (ctx) => {
        const chart = ctx.chart
        const {ctx: canvasCtx, chartArea} = chart
        if (!chartArea) return null

        const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, baseColor + "4D")
        gradient.addColorStop(1, baseColor + "00")

        return gradient
      },*/

      fill: true,
      tension: 0.1,              // 곡선 라인
     /* fill: idx === 0 ? true : false,*/
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 1
    }))
  }
})


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      align: 'center',
      labels: {
        boxWidth: 12,
        padding: 20
      }
    },
    tooltip: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: (tooltipItem: any) => {
          return `${tooltipItem.dataset.label} ${tooltipItem.raw}`
        }
      }
    }

    /*    tooltip: { enabled: true }
  },
 scales: {
    y: { beginAtZero: false }
  },*/

  },
interaction: {
  mode: "index",
    intersect: false
},
scales: {
  y: {
    beginAtZero: true,
    min: 0,              // 최소값 (직접 지정 가능)
    max: 10,
    ticks: {
      stepSize: 0.5
    }
  }
}
}
</script>



















<!--
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
-->
