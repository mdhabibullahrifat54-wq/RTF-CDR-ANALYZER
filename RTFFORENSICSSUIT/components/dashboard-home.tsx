"use client"

import type { ModuleType } from "@/components/dashboard"
import { useAuth } from "@/lib/auth-context"
import { useDataStore } from "@/lib/data-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DeveloperCredit } from "@/components/developer-credit"
import {
  PhoneCall,
  Radio,
  Route,
  Users,
  Map,
  FileText,
  Upload,
  Clock,
  TrendingUp,
  Database,
  ArrowRight,
  Activity,
  MapPin,
  Building2,
  Shield,
  ExternalLink,
} from "lucide-react"

interface DashboardHomeProps {
  onSelectModule: (module: ModuleType) => void
}

const moduleCards = [
  {
    id: "cdr" as ModuleType,
    title: "RTF CDR Analyzer",
    description: "Analyze Call Detail Records with 27 forensic algorithms",
    icon: PhoneCall,
    color: "text-cyan-500 dark:text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    features: ["Full classified report", "Exact call locations", "Threat score & red flags", "15-45 sec analysis"],
  },
  {
    id: "tower" as ModuleType,
    title: "RTF Tower Dump Analyzer",
    description: "Cross-operator tower dump analysis for device identification",
    icon: Radio,
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    features: ["GP/Robi/BL/Teletalk", "Cross-operator matching", "Fake tower detection", "Merged intelligence"],
  },
  {
    id: "geo" as ModuleType,
    title: "Movement Road Map",
    description: "Generate complete travel routes with address-level details",
    icon: Map,
    color: "text-emerald-500 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    features: ["MSISDN/IMEI tracking", "Speed analysis", "Night movement alerts", "PDF/Excel export"],
  },
  {
    id: "drive" as ModuleType,
    title: "Drive Test Analyzer",
    description: "Overlay CDR data onto operator drive test routes",
    icon: Route,
    color: "text-teal-500 dark:text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
    features: ["Route visualization", "Signal analysis", "Coverage zones", "GPS sync"],
  },
  {
    id: "mutual" as ModuleType,
    title: "Mutual Communication",
    description: "Detect communication clusters and interactions",
    icon: Users,
    color: "text-sky-500 dark:text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
    features: ["Cluster analysis", "Communication tree", "Time windows", "Link strength"],
  },
  {
    id: "reports" as ModuleType,
    title: "Reporting Engine",
    description: "Generate official legal-ready reports",
    icon: FileText,
    color: "text-indigo-500 dark:text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    features: ["PDF export", "Excel export", "Case number", "Legal format"],
  },
]

export default function DashboardHome({ onSelectModule }: DashboardHomeProps) {
  const { user } = useAuth()
  const { stats, sessions } = useDataStore()

  const recentSessions = sessions.slice(-5).reverse()

  const displayName = user?.thanaDetails?.thana ? `${user.thanaDetails.thana} PS` : user?.username

  const locationInfo = user?.thanaDetails?.district
    ? `${user.thanaDetails.district}, ${user.thanaDetails.division?.replace(" Division", "")}`
    : null

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header with Admin Panel Button */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-primary/30 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome, <span className="text-primary">{displayName}</span>
              </h1>
              {locationInfo && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{locationInfo}</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-muted-foreground mt-3">Select a module below to begin your telecom analysis</p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => window.open("/control-panel", "_blank")}
            className="h-12 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold shadow-lg shadow-red-500/30 border border-red-500/50"
          >
            <Shield className="w-5 h-5 mr-2" />
            ADMINISTRATOR PANEL
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <Card className="bg-card/50 border-primary/20 px-4 py-3">
            <p className="text-xs text-muted-foreground">Session started</p>
            <p className="text-sm font-medium text-primary">
              {user?.loginTime ? new Date(user.loginTime).toLocaleString() : "Now"}
            </p>
          </Card>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-blue-500/20 hover:border-blue-500/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Records Processed</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {stats.totalRecordsProcessed.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-teal-500/20 hover:border-teal-500/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Modules Used</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.modulesUsed.length}</p>
              </div>
              <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-teal-500 dark:text-teal-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-sky-500/20 hover:border-sky-500/40 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reports Generated</p>
                <p className="text-3xl font-bold text-foreground mt-1">0</p>
              </div>
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-sky-500 dark:text-sky-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Module cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            Analysis Modules
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {moduleCards.map((module) => {
              const Icon = module.icon
              return (
                <Card
                  key={module.id}
                  className={`bg-card border ${module.borderColor} hover:border-primary/50 transition-all cursor-pointer group`}
                  onClick={() => onSelectModule(module.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`w-11 h-11 ${module.bgColor} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${module.color}`} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardTitle className="text-base mt-3">{module.title}</CardTitle>
                    <CardDescription className="text-sm">{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {module.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs px-2 py-1 bg-secondary/80 rounded-md text-muted-foreground border border-border"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent sessions and Quick Start */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            Recent Sessions
          </h2>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              {recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Upload className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{session.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.module.toUpperCase()} - {session.data.rows.length} records
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-primary/70">{new Date(session.uploadedAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-10 h-10 mx-auto text-primary/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No recent sessions</p>
                  <p className="text-xs text-muted-foreground mt-1">Upload a file to start analyzing</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Operational Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-medium text-white shrink-0">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">CDR Forensic Analysis</p>
                  <p className="text-xs text-muted-foreground">
                    Upload CDR file, click START FORENSIC ANALYSIS (15-45 sec)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-medium text-white shrink-0">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Tower Dump Analysis</p>
                  <p className="text-xs text-muted-foreground">Upload files for GP/Robi/BL/Teletalk, click MERGE ALL</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-medium text-white shrink-0">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Movement Road Map</p>
                  <p className="text-xs text-muted-foreground">Enter MSISDN/IMEI, select date range, generate path</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-xs font-medium text-white shrink-0">
                  4
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Create Official Report</p>
                  <p className="text-xs text-muted-foreground">Generate PDF/Excel with case number & legal format</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Developer credit card */}
          <DeveloperCredit variant="full" />
        </div>
      </div>
    </div>
  )
}
