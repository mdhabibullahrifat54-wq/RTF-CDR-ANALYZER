"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import CDRAnalyzer from "@/components/modules/cdr-analyzer"
import TowerDumpAnalyzer from "@/components/modules/tower-dump-analyzer"
import DriveTestAnalyzer from "@/components/modules/drive-test-analyzer"
import MutualAnalyzer from "@/components/modules/mutual-analyzer"
import GeoIntelligence from "@/components/modules/geo-intelligence"
import ReportingEngine from "@/components/modules/reporting-engine"
import DashboardHome from "@/components/dashboard-home"

export type ModuleType = "home" | "cdr" | "tower" | "drive" | "mutual" | "geo" | "reports"

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState<ModuleType>("home")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderModule = () => {
    switch (activeModule) {
      case "cdr":
        return <CDRAnalyzer />
      case "tower":
        return <TowerDumpAnalyzer />
      case "drive":
        return <DriveTestAnalyzer />
      case "mutual":
        return <MutualAnalyzer />
      case "geo":
        return <GeoIntelligence />
      case "reports":
        return <ReportingEngine />
      default:
        return <DashboardHome onSelectModule={setActiveModule} />
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`flex-1 transition-all duration-300 min-h-screen ${sidebarCollapsed ? "ml-[72px]" : "ml-72"}`}>
        {renderModule()}
      </main>
    </div>
  )
}
