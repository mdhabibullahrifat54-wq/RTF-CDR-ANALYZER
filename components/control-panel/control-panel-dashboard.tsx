"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Shield,
  Key,
  Settings,
  LogOut,
  UserPlus,
  Lock,
  Unlock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Trash2,
  Search,
  Download,
  Calendar,
  Database,
  FileText,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  AlertCircle,
  Power,
  Home,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ControlPanelDashboardProps {
  adminUser: {
    username: string
    role: string
    accessLevel: number
  }
  onLogout: () => void
}

interface UserAccount {
  id: string
  username: string
  fullName: string
  role: "user" | "content_manager" | "admin"
  status: "active" | "locked" | "expired"
  createdAt: string
  lastLogin: string | null
  passwordCreated: string
  passwordExpires: string
  failedAttempts: number
  thana?: string
  email?: string
}

interface AuditLog {
  id: number
  action: string
  user: string
  timestamp: string
  status: "success" | "failed" | "warning"
  ip: string
  details?: string
}

interface WebsiteSettings {
  maintenanceMode: boolean
  registrationEnabled: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  passwordExpiryDays: number
  minPasswordLength: number
  requireTwoFactor: boolean
}

// Generate password based on documentation algorithm
function generateMonthlyPassword(username: string): string {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const baseString = `${username}_${currentMonth}`

  // Simple hash simulation
  let hash = 0
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }

  const hashStr = Math.abs(hash).toString(36).slice(0, 4)
  const specials = "!@#$%^&*"
  const special = specials[Math.abs(hash) % specials.length]
  const nums = String(Math.abs(hash) % 100).padStart(2, "0")
  const upper = String.fromCharCode(65 + (Math.abs(hash) % 26))

  return `${hashStr}${upper}${special}${nums}${username.slice(0, 4)}`
}

export default function ControlPanelDashboard({ adminUser, onLogout }: ControlPanelDashboardProps) {
  const [users, setUsers] = useState<UserAccount[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [settings, setSettings] = useState<WebsiteSettings>({
    maintenanceMode: false,
    registrationEnabled: true,
    sessionTimeout: 15,
    maxLoginAttempts: 5,
    passwordExpiryDays: 30,
    minPasswordLength: 12,
    requireTwoFactor: false,
  })

  // Dialog states
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null)
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [newUser, setNewUser] = useState<{
    username: string
    fullName: string
    email: string
    role: "user" | "content_manager" | "admin"
    thana: string
  }>({
    username: "",
    fullName: "",
    email: "",
    role: "user",
    thana: "",
  })

  const currentDate = new Date()

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("rtf_website_users")
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      // Initialize with sample users
      const sampleUsers: UserAccount[] = [
        {
          id: "1",
          username: "jsmith_gulshan01",
          fullName: "John Smith",
          email: "jsmith@rtf.gov",
          role: "user",
          status: "active",
          createdAt: "2024-11-01",
          lastLogin: "2024-12-01T10:30:00",
          passwordCreated: "2024-11-15",
          passwordExpires: "2024-12-15",
          failedAttempts: 0,
          thana: "Gulshan PS",
        },
        {
          id: "2",
          username: "arahman_mirpur02",
          fullName: "Abdul Rahman",
          email: "arahman@rtf.gov",
          role: "user",
          status: "active",
          createdAt: "2024-10-15",
          lastLogin: "2024-11-30T14:22:00",
          passwordCreated: "2024-11-20",
          passwordExpires: "2024-12-20",
          failedAttempts: 1,
          thana: "Mirpur PS",
        },
        {
          id: "3",
          username: "mkhan_kotwali03",
          fullName: "Mohammad Khan",
          email: "mkhan@rtf.gov",
          role: "content_manager",
          status: "locked",
          createdAt: "2024-09-01",
          lastLogin: "2024-11-25T09:15:00",
          passwordCreated: "2024-10-25",
          passwordExpires: "2024-11-25",
          failedAttempts: 5,
          thana: "Kotwali PS",
        },
        {
          id: "4",
          username: "fhasan_airport04",
          fullName: "Fatima Hasan",
          email: "fhasan@rtf.gov",
          role: "user",
          status: "expired",
          createdAt: "2024-08-10",
          lastLogin: "2024-10-30T11:45:00",
          passwordCreated: "2024-10-01",
          passwordExpires: "2024-10-31",
          failedAttempts: 0,
          thana: "Airport PS",
        },
      ]
      setUsers(sampleUsers)
      localStorage.setItem("rtf_website_users", JSON.stringify(sampleUsers))
    }

    const savedLogs = localStorage.getItem("rtf_admin_audit_logs")
    if (savedLogs) {
      setAuditLogs(JSON.parse(savedLogs))
    }

    const savedSettings = localStorage.getItem("rtf_website_settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save users whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("rtf_website_users", JSON.stringify(users))
    }
  }, [users])

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem("rtf_website_settings", JSON.stringify(settings))
  }, [settings])

  // Stats calculations
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    lockedUsers: users.filter((u) => u.status === "locked").length,
    expiredPasswords: users.filter((u) => u.status === "expired").length,
    expiringIn5Days: users.filter((u) => {
      const expiry = new Date(u.passwordExpires)
      const diff = (expiry.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      return diff <= 5 && diff > 0 && u.status === "active"
    }).length,
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.thana?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const logAuditAction = (action: string, user: string, status: "success" | "failed" | "warning", details?: string) => {
    const newLog: AuditLog = {
      id: Date.now(),
      action,
      user,
      timestamp: new Date().toISOString(),
      status,
      ip: "192.168.1.1",
      details,
    }
    const updatedLogs = [newLog, ...auditLogs].slice(0, 500)
    setAuditLogs(updatedLogs)
    localStorage.setItem("rtf_admin_audit_logs", JSON.stringify(updatedLogs))
  }

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.fullName) return

    const now = new Date()
    const expiryDate = new Date(now)
    expiryDate.setDate(expiryDate.getDate() + settings.passwordExpiryDays)

    const password = generateMonthlyPassword(newUser.username)
    setGeneratedPassword(password)

    const user: UserAccount = {
      id: String(Date.now()),
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      status: "active",
      createdAt: now.toISOString().split("T")[0],
      lastLogin: null,
      passwordCreated: now.toISOString().split("T")[0],
      passwordExpires: expiryDate.toISOString().split("T")[0],
      failedAttempts: 0,
      thana: newUser.thana,
    }

    setUsers((prev) => [...prev, user])
    logAuditAction("User Created", adminUser.username, "success", `Created user: ${newUser.username}`)

    setNewUser({ username: "", fullName: "", email: "", role: "user", thana: "" })
    setIsCreateUserOpen(false)
    setIsResetPasswordOpen(true)
    setSelectedUser(user)
  }

  const handleLockUser = (user: UserAccount) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: "locked" as const } : u)))
    logAuditAction("Account Locked", adminUser.username, "warning", `Locked user: ${user.username}`)
  }

  const handleUnlockUser = (user: UserAccount) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: "active" as const, failedAttempts: 0 } : u)))
    logAuditAction("Account Unlocked", adminUser.username, "success", `Unlocked user: ${user.username}`)
  }

  const handleResetPassword = (user: UserAccount) => {
    const now = new Date()
    const expiryDate = new Date(now)
    expiryDate.setDate(expiryDate.getDate() + settings.passwordExpiryDays)

    const password = generateMonthlyPassword(user.username)
    setGeneratedPassword(password)
    setSelectedUser(user)

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              status: "active" as const,
              passwordCreated: now.toISOString().split("T")[0],
              passwordExpires: expiryDate.toISOString().split("T")[0],
              failedAttempts: 0,
            }
          : u,
      ),
    )

    logAuditAction("Password Reset", adminUser.username, "success", `Reset password for: ${user.username}`)
    setIsResetPasswordOpen(true)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id))
    logAuditAction("User Deleted", adminUser.username, "warning", `Deleted user: ${selectedUser.username}`)
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const handleMassPasswordReset = () => {
    const now = new Date()
    const expiryDate = new Date(now)
    expiryDate.setDate(expiryDate.getDate() + settings.passwordExpiryDays)

    setUsers((prev) =>
      prev.map((u) => ({
        ...u,
        passwordCreated: now.toISOString().split("T")[0],
        passwordExpires: expiryDate.toISOString().split("T")[0],
        status: "active" as const,
        failedAttempts: 0,
      })),
    )

    logAuditAction(
      "Mass Password Reset",
      adminUser.username,
      "success",
      `Reset passwords for all ${users.length} users`,
    )
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    return Math.ceil((expiry.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getStatusBadge = (status: UserAccount["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
      case "locked":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Locked</Badge>
      case "expired":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Expired</Badge>
    }
  }

  const getRoleBadge = (role: UserAccount["role"]) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Administrator</Badge>
      case "content_manager":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Content Manager</Badge>
      case "user":
        return <Badge className="bg-secondary text-muted-foreground border-border">User</Badge>
    }
  }

  const getLogStatusBadge = (status: AuditLog["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Success</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>
      case "warning":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Warning</Badge>
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const currentMonth = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">RTF Control Panel</h1>
                <p className="text-xs text-cyan-400">Website Administration</p>
              </div>
            </div>
            <div className="h-8 w-px bg-border hidden md:block" />
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground hidden md:flex"
              onClick={() => window.open("/", "_blank")}
            >
              <ExternalLink className="w-4 h-4" />
              View Main Website
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{adminUser.username}</p>
              <p className="text-xs text-cyan-400">{adminUser.role}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent border-border hover:border-red-500/50 hover:text-red-400"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="bg-card border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold text-emerald-400 mt-1">{stats.activeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-red-500/20 hover:border-red-500/40 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Locked</p>
                  <p className="text-3xl font-bold text-red-400 mt-1">{stats.lockedUsers}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-amber-500/20 hover:border-amber-500/40 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                  <p className="text-3xl font-bold text-amber-400 mt-1">{stats.expiredPasswords}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-blue-500/20 hover:border-blue-500/40 transition-colors col-span-2 md:col-span-1">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-3xl font-bold text-blue-400 mt-1">{stats.expiringIn5Days}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="dashboard" className="gap-2 data-[state=active]:bg-card">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-card">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">User Management</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-card">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security Logs</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-card">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Website Controls</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Password Expiry Warnings */}
              <Card className="lg:col-span-2 bg-card border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Key className="w-5 h-5 text-cyan-400" />
                    Password Expiry Alerts
                  </CardTitle>
                  <CardDescription>Users with passwords expiring within 5 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {users
                      .filter((u) => {
                        const days = getDaysUntilExpiry(u.passwordExpires)
                        return days <= 5 && days > 0 && u.status === "active"
                      })
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                              <Clock className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{user.fullName}</p>
                              <p className="text-xs text-muted-foreground">{user.username}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-medium text-amber-400">
                                {getDaysUntilExpiry(user.passwordExpires)} days left
                              </p>
                              <p className="text-xs text-muted-foreground">Expires: {user.passwordExpires}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent border-amber-500/30 hover:bg-amber-500/10 text-amber-400"
                              onClick={() => handleResetPassword(user)}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    {users.filter((u) => {
                      const days = getDaysUntilExpiry(u.passwordExpires)
                      return days <= 5 && days > 0 && u.status === "active"
                    }).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-500/50" />
                        <p>No passwords expiring in the next 5 days</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Summary */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Monthly Summary
                  </CardTitle>
                  <CardDescription>{currentMonth}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Password Resets</span>
                    <span className="font-medium">{auditLogs.filter((l) => l.action.includes("Password")).length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Failed Logins</span>
                    <span className="font-medium text-amber-400">
                      {auditLogs.filter((l) => l.status === "failed").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Accounts Locked</span>
                    <span className="font-medium text-red-400">{stats.lockedUsers}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">New Users</span>
                    <span className="font-medium text-emerald-400">
                      {auditLogs.filter((l) => l.action === "User Created").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Active Sessions</span>
                    <span className="font-medium text-cyan-400">{stats.activeUsers}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400"
                    onClick={() => setIsCreateUserOpen(true)}
                  >
                    <UserPlus className="w-4 h-4" />
                    Create New User
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent border-amber-500/30 hover:bg-amber-500/10 text-amber-400"
                    onClick={handleMassPasswordReset}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Mass Password Reset
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent border-border">
                    <Download className="w-4 h-4" />
                    Export User List
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent border-border">
                    <FileText className="w-4 h-4" />
                    Compliance Report
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent border-blue-500/30 hover:bg-blue-500/10 text-blue-400"
                  >
                    <Database className="w-4 h-4" />
                    Backup Database
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest 5 system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            log.status === "success"
                              ? "bg-emerald-500"
                              : log.status === "failed"
                                ? "bg-red-500"
                                : "bg-amber-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">by {log.user}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                        {getLogStatusBadge(log.status)}
                      </div>
                    </div>
                  ))}
                  {auditLogs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-400" />
                      User Accounts
                    </CardTitle>
                    <CardDescription>Manage all RTF Forensics Suite users</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-64 bg-secondary/50"
                      />
                    </div>
                    <Button
                      className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                      onClick={() => setIsCreateUserOpen(true)}
                    >
                      <UserPlus className="w-4 h-4" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Password Expires</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-secondary/20">
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.fullName}</p>
                              <p className="text-xs text-muted-foreground">{user.username}</p>
                              {user.thana && <p className="text-xs text-cyan-400">{user.thana}</p>}
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{user.passwordExpires}</p>
                              {user.status === "active" && (
                                <p
                                  className={`text-xs ${
                                    getDaysUntilExpiry(user.passwordExpires) <= 5
                                      ? "text-amber-400"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {getDaysUntilExpiry(user.passwordExpires) > 0
                                    ? `${getDaysUntilExpiry(user.passwordExpires)} days left`
                                    : "Expired"}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin ? (
                              new Date(user.lastLogin).toLocaleDateString()
                            ) : (
                              <span className="text-muted-foreground">Never</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-cyan-400"
                                onClick={() => handleResetPassword(user)}
                                title="Reset Password"
                              >
                                <Key className="w-4 h-4" />
                              </Button>
                              {user.status === "locked" ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-emerald-400"
                                  onClick={() => handleUnlockUser(user)}
                                  title="Unlock Account"
                                >
                                  <Unlock className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-amber-400"
                                  onClick={() => handleLockUser(user)}
                                  title="Lock Account"
                                >
                                  <Lock className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-400"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setIsDeleteDialogOpen(true)
                                }}
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No users found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Logs Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="w-5 h-5 text-cyan-400" />
                      Security Audit Logs
                    </CardTitle>
                    <CardDescription>Complete system activity trail</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2 bg-transparent border-border">
                    <Download className="w-4 h-4" />
                    Export Logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.slice(0, 50).map((log) => (
                        <TableRow key={log.id} className="hover:bg-secondary/20">
                          <TableCell className="font-mono text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{log.action}</p>
                              {log.details && <p className="text-xs text-muted-foreground">{log.details}</p>}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.user}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
                          <TableCell>{getLogStatusBadge(log.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {auditLogs.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No audit logs available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Website Controls Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* System Status */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Power className="w-5 h-5 text-cyan-400" />
                    System Status
                  </CardTitle>
                  <CardDescription>Website operation controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          settings.maintenanceMode ? "bg-amber-500/20" : "bg-emerald-500/20"
                        }`}
                      >
                        {settings.maintenanceMode ? (
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-xs text-muted-foreground">
                          {settings.maintenanceMode
                            ? "Website is offline for maintenance"
                            : "Website is fully operational"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => {
                        setSettings((prev) => ({ ...prev, maintenanceMode: checked }))
                        logAuditAction(
                          checked ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled",
                          adminUser.username,
                          "warning",
                        )
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          settings.registrationEnabled ? "bg-emerald-500/20" : "bg-red-500/20"
                        }`}
                      >
                        <UserPlus
                          className={`w-5 h-5 ${settings.registrationEnabled ? "text-emerald-400" : "text-red-400"}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">User Registration</p>
                        <p className="text-xs text-muted-foreground">
                          {settings.registrationEnabled ? "New users can be registered" : "Registration is disabled"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.registrationEnabled}
                      onCheckedChange={(checked) => {
                        setSettings((prev) => ({ ...prev, registrationEnabled: checked }))
                        logAuditAction(
                          checked ? "Registration Enabled" : "Registration Disabled",
                          adminUser.username,
                          "success",
                        )
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">
                          {settings.requireTwoFactor ? "Required for all users" : "Optional for users"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.requireTwoFactor}
                      onCheckedChange={(checked) => {
                        setSettings((prev) => ({ ...prev, requireTwoFactor: checked }))
                        logAuditAction(
                          checked ? "2FA Requirement Enabled" : "2FA Requirement Disabled",
                          adminUser.username,
                          "success",
                        )
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Configure security policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm">Session Timeout (minutes)</Label>
                    <Select
                      value={String(settings.sessionTimeout)}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, sessionTimeout: Number(value) }))}
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Max Login Attempts Before Lock</Label>
                    <Select
                      value={String(settings.maxLoginAttempts)}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, maxLoginAttempts: Number(value) }))}
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Password Expiry (days)</Label>
                    <Select
                      value={String(settings.passwordExpiryDays)}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, passwordExpiryDays: Number(value) }))}
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Minimum Password Length</Label>
                    <Select
                      value={String(settings.minPasswordLength)}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, minPasswordLength: Number(value) }))}
                    >
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8 characters</SelectItem>
                        <SelectItem value="10">10 characters</SelectItem>
                        <SelectItem value="12">12 characters</SelectItem>
                        <SelectItem value="16">16 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Password Policy Info */}
            <Card className="bg-card border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="w-5 h-5 text-cyan-400" />
                  Password Policy Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Minimum Length</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{settings.minPasswordLength}</p>
                    <p className="text-xs text-muted-foreground">characters</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Expiry Period</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{settings.passwordExpiryDays}</p>
                    <p className="text-xs text-muted-foreground">days</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">History Check</p>
                    <p className="text-2xl font-bold text-foreground mt-1">5</p>
                    <p className="text-xs text-muted-foreground">previous passwords</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Lockout Duration</p>
                    <p className="text-2xl font-bold text-foreground mt-1">30</p>
                    <p className="text-xs text-muted-foreground">minutes</p>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Password Requirements:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>At least 1 uppercase letter</li>
                        <li>At least 1 lowercase letter</li>
                        <li>At least 1 number</li>
                        <li>At least 1 special character (!@#$%^&*)</li>
                        <li>Cannot reuse last 5 passwords</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Create User Dialog */}
      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              Create New User
            </DialogTitle>
            <DialogDescription>Add a new user account to the RTF Forensics Suite</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="John Smith"
                value={newUser.fullName}
                onChange={(e) => setNewUser((prev) => ({ ...prev, fullName: e.target.value }))}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                placeholder="jsmith_thana01"
                value={newUser.username}
                onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value.toLowerCase() }))}
                className="bg-secondary/50 font-mono"
              />
              <p className="text-xs text-muted-foreground">Format: [firstinitial][lastname]_[thana][number]</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="jsmith@rtf.gov"
                value={newUser.email}
                onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Police Station (Thana)</Label>
              <Input
                placeholder="Gulshan PS"
                value={newUser.thana}
                onChange={(e) => setNewUser((prev) => ({ ...prev, thana: e.target.value }))}
                className="bg-secondary/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value: "user" | "content_manager" | "admin") =>
                  setNewUser((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="content_manager">Content Manager</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={!newUser.username || !newUser.fullName}
              className="bg-gradient-to-r from-cyan-600 to-blue-600"
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              Password Generated
            </DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `New password for ${selectedUser.fullName} (${selectedUser.username})`
                : "New temporary password generated"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <Label className="text-xs text-muted-foreground">Temporary Password</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={generatedPassword}
                  readOnly
                  type={showPassword ? "text" : "password"}
                  className="font-mono bg-background"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="shrink-0"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(generatedPassword)}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  User must change this password on first login. Password expires in {settings.passwordExpiryDays} days.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsResetPasswordOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Delete User Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the user account for{" "}
              <span className="font-medium text-foreground">{selectedUser?.fullName}</span> ({selectedUser?.username})?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteUser}>
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
