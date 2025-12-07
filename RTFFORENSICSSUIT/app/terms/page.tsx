import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Scale, Lock, AlertTriangle, Database, FileText, RefreshCw, Ban } from "lucide-react"
import { APP_CONFIG } from "@/lib/constants"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Terms & Conditions of Use</h1>
              <p className="text-muted-foreground">
                {APP_CONFIG.name} v{APP_CONFIG.version}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{APP_CONFIG.edition} | Effective: December 08, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Section 1: Authorized Access */}
        <Card className="border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-500" />
              </div>
              1. Authorized Access Only
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              This system is restricted to{" "}
              <strong className="text-foreground">authorized Bangladesh Law Enforcement personnel only</strong>.
            </p>
            <p>
              Unauthorized access is strictly prohibited and subject to legal action under the Bangladesh ICT Act, 2006
              and relevant national security laws.
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Data Privacy */}
        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-500" />
              </div>
              2. Data Privacy & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>
                All data processed through this system must comply with the{" "}
                <strong className="text-foreground">Bangladesh Personal Data Protection Act</strong> and
                Telecommunication Regulations.
              </li>
              <li>User data must be lawfully obtained with proper judicial authorization.</li>
              <li>No personal data may be used for unauthorized surveillance or personal gain.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 3: System Security */}
        <Card className="border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-emerald-500" />
              </div>
              3. System Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>
                Users must <strong className="text-foreground">not share login credentials</strong>.
              </li>
              <li>Passwords must be kept confidential and changed periodically as per internal policy.</li>
              <li>All sessions are logged and monitored for security auditing.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 4: Legal Use */}
        <Card className="border-indigo-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-500" />
              </div>
              4. Legal Use of Outputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>
                Reports generated are for{" "}
                <strong className="text-foreground">official investigation purposes only</strong>.
              </li>
              <li>Findings must be corroborated with additional evidence before judicial submission.</li>
              <li>Misuse of forensic outputs for harassment, defamation, or unauthorized disclosure is prohibited.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 5: Data Retention */}
        <Card className="border-teal-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-teal-500" />
              </div>
              5. Data Retention & Deletion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>
                All forensic cases are stored <strong className="text-foreground">permanently</strong> in the system
                unless deleted by Super Administrator.
              </li>
              <li>Data retention follows Bangladesh Cyber Security Agency guidelines.</li>
              <li>Expired or legally invalid data must be flagged for review and secure deletion.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 6: Liability Disclaimer */}
        <Card className="border-amber-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              6. Liability Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              The system provides analysis based on uploaded data and{" "}
              <strong className="text-foreground">does not guarantee absolute accuracy</strong>.
            </p>
            <p>RTF Forensics Suite and its administrators are not liable for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Misinterpretation of reports</li>
              <li>Unauthorized data uploads</li>
              <li>Legal consequences arising from improper use</li>
            </ul>
            <p className="mt-3">Users are solely responsible for lawful and ethical application of forensic results.</p>
          </CardContent>
        </Card>

        {/* Section 7: Updates */}
        <Card className="border-sky-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-sky-500" />
              </div>
              7. Updates & Modifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>The system may be updated without prior notice.</li>
              <li>Continued use constitutes acceptance of updated terms.</li>
              <li>Major changes will be communicated via official channels.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 8: Breach of Terms */}
        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-500" />
              </div>
              8. Breach of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>Violation of these terms may result in:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Immediate account suspension</li>
              <li>Legal investigation</li>
              <li>Disciplinary action under police conduct rules</li>
              <li>Criminal prosecution if applicable</li>
            </ul>
          </CardContent>
        </Card>

        {/* Security Notes */}
        <Card className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-primary">
              <Shield className="w-6 h-6" />
              Security Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li>Use only authorized credentials.</li>
              <li>Do not share passwords.</li>
              <li>All sessions are monitored and logged.</li>
              <li>
                System is <strong className="text-foreground">100% secure and live</strong> as of December 08, 2025.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center pt-8 pb-4 border-t border-border space-y-4">
          <p className="text-sm text-muted-foreground">
            By using this system, you acknowledge that you have read, understood, and agreed to all terms and conditions
            outlined above.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/">
              <Button variant="outline">Return to Login</Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            {APP_CONFIG.name} v{APP_CONFIG.version} | Super Administrator: rifat_admin | {APP_CONFIG.copyright}
          </p>
        </div>
      </div>
    </div>
  )
}
