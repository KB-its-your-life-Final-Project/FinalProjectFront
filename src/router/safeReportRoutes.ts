// src/router/safeReportRoutes.ts

import SearchBuilding from "@/pages/safeReport/SearchBuilding.vue";
import SelectBudget from "@/pages/safeReport/SelectBudget.vue";
import SafeReportResult from "@/pages/safeReport/SafeReportResult.vue";

import type { RouteRecordRaw } from "vue-router";

export const safeReportRoutes: RouteRecordRaw[] = [
  {
    path: "/safe-report",
    component: () => import("@/pages/safeReport/SafeReport.vue"), // RouterView용 래퍼
    redirect:"/safe-report/search",
    children: [
      {
        path: "search",
        name: "safeReportSearch",
        component: SearchBuilding,
      },
      {
        path: "budget",
        name: "safeReportBudget",
        component: SelectBudget,
      },
      {
        path: "result",
        name: "safeReportResult",
        component: SafeReportResult,
        props: route => ({
          formData: route.query.formData && JSON.parse(route.query.formData as string),
          resultData: route.query.resultData && JSON.parse(route.query.resultData as string)
        })
      },
    ]
  },
];
