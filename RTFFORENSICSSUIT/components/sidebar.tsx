"use client"

import { useAuth } from "@/lib/auth-context"
import { useDataStore } from "@/lib/data-store"
import type { ModuleType } from "@/components/dashboard"
import { cn } from "@/lib/utils"
import Logo from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { APP_CONFIG } from "@/lib/constants"
import { VersionBadge } from "@/components/version-badge"
import {
  PhoneCall,
  Radio,
  Route,
  Users,
  Map,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Database,
  MapPin,
  Building2,
  ExternalLink,
  Code2,
} from "lucide-react"

interface SidebarProps {
  activeModule: ModuleType
  onSelectModule: (module: ModuleType) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const modules = [
  { id: "home" as ModuleType, label: "Dashboard", icon: LayoutDashboard, description: "Overview & statistics" },
  { id: "cdr" as ModuleType, label: "CDR Analyzer", icon: PhoneCall, description: "Call detail records" },
  { id: "tower" as ModuleType, label: "Tower Dump", icon: Radio, description: "Cell tower analysis" },
  { id: "drive" as ModuleType, label: "Drive Test", icon: Route, description: "Route analysis" },
  { id: "mutual" as ModuleType, label: "Mutual Comm", icon: Users, description: "Link analysis" },
  { id: "geo" as ModuleType, label: "GEO Intelligence", icon: Map, description: "Map visualization" },
  { id: "reports" as ModuleType, label: "Reports", icon: FileText, description: "Generate reports" },
]

export default function Sidebar({ activeModule, onSelectModule, collapsed, onToggleCollapse }: SidebarProps) {
  const { user, logout } = useAuth()
  const { stats } = useDataStore()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-[72px]" : "w-72",
      )}
    >
      <div className="p-4 border-b border-sidebar-border relative">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        {collapsed ? <Logo size="sm" showText={false} className="mx-auto" /> : <Logo size="md" />}
      </div>

      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-colors shadow-sm"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-primary" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-primary" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 py-2 text-xs font-medium text-primary/70 uppercase tracking-wider">Modules</p>
        )}
        {modules.map((module) => {
          const Icon = module.icon
          const isActive = activeModule === module.id

          return (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              title={collapsed ? module.label : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group",
                isActive
                  ? "bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
              {!collapsed && (
                <div className="flex-1 text-left">
                  <span className="block font-medium">{module.label}</span>
                  <span className="block text-xs text-muted-foreground group-hover:text-muted-foreground">
                    {module.description}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {!collapsed && stats.totalSessions > 0 && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 text-xs text-primary/70 mb-2">
              <Database className="w-3 h-3" />
              <span>Session Data</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-foreground font-medium">{stats.totalSessions}</p>
                <p className="text-muted-foreground">Sessions</p>
              </div>
              <div>
                <p className="text-foreground font-medium">{stats.totalRecordsProcessed.toLocaleString()}</p>
                <p className="text-muted-foreground">Records</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {!collapsed && (
          <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-foreground truncate">
                {user?.thanaDetails?.thana ? `${user.thanaDetails.thana} PS` : user?.username}
              </p>
            </div>
            {user?.thanaDetails?.district && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Building2 className="w-3 h-3" />
                <span className="truncate">
                  {user.thanaDetails.district}, {user.thanaDetails.division?.replace(" Division", "")}
                </span>
              </div>
            )}
            <p className="text-xs text-primary/70 mt-1">{user?.role}</p>
          </div>
        )}

        {collapsed && (
          <div className="flex justify-center py-2" title={user?.username}>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
          </div>
        )}

        {!collapsed && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary transition-all">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Settings className="w-5 h-5 shrink-0" />
              <span>Theme</span>
            </div>
            <ThemeToggle />
          </div>
        )}

        {collapsed && (
          <div className="flex justify-center py-2">
            <ThemeToggle />
          </div>
        )}

        {!collapsed && (
          <button
            onClick={() => window.open("/control-panel", "_blank")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all text-sm border border-transparent hover:border-primary/20"
          >
            <ExternalLink className="w-5 h-5 shrink-0" />
            <span>Control Panel</span>
          </button>
        )}

        {collapsed && (
          <button
            onClick={() => window.open("/control-panel", "_blank")}
            title="Control Panel"
            className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={logout}
          title={collapsed ? "Sign Out" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all text-sm"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {!collapsed && (
          <div className="mt-2 pt-2 border-t border-sidebar-border">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-primary/10">
              <Code2 className="w-4 h-4 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground">Developer</p>
                <p className="text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent truncate">
                  {APP_CONFIG.developer}
                </p>
              </div>
              <VersionBadge />
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mt-2 pt-2 border-t border-sidebar-border flex justify-center">
            <VersionBadge />
          </div>
        )}
      </div>
    </aside>
  )
}
