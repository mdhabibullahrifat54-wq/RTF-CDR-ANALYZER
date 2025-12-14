"use client"

import { AuthProvider, useAuth } from "@/lib/auth-context"
import { DataStoreProvider } from "@/lib/data-store"
import LoginPage from "@/components/login-page"
import Dashboard from "@/components/dashboard"
import { LoadingScreen } from "@/components/loading-screen"
import { ErrorBoundary } from "@/components/error-boundary"

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen message="Initializing RTF Forensics Suite..." />
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <Dashboard />
}

export default function Home() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataStoreProvider>
          <AppContent />
        </DataStoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
