"use client"
import { GlassCard } from '@/components/dashboard/GlassCard'
import { Button } from '@/components/ui/button'
import { Cpu, Activity, Zap, RefreshCw, Settings as SettingsIcon } from 'lucide-react'

const models = [
  {
    name: "Resume Parser",
    status: "active",
    uptime: "99.8%",
    lastTrained: "2 days ago",
    requests: "12.5K",
    accuracy: "94.2%"
  },
  {
    name: "Candidate Matching",
    status: "active",
    uptime: "99.5%",
    lastTrained: "5 days ago",
    requests: "8.3K",
    accuracy: "91.8%"
  },
  {
    name: "Interview Analyzer",
    status: "active",
    uptime: "99.9%",
    lastTrained: "1 day ago",
    requests: "3.2K",
    accuracy: "96.5%"
  },
  {
    name: "JD generator",
    status: "active",
    uptime: "98.2%",
    lastTrained: "1 day ago",
    requests: "5.1K",
    accuracy: "89.3%"
  },
  {
    name: "HR Chatbot",
    status: "active",
    uptime: "99.6%",
    lastTrained: "3 days ago",
    requests: "15.7K",
    accuracy: "92.7%"
  },
];

export default function AdminAiMonitorPage() {
    const handleRetrainModels = () => {
        alert('Retraining all AI models... This may take several minutes.')
    }

    const handleModelSettings = (modelName: string) => {
        alert(`Opening settings for ${modelName} model`)
    }

    const handleRefreshModel = (modelName: string) => {
        alert(`Refreshing ${modelName} model...`)
    }

    return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">AI Models</h2>
          <p className="text-muted-foreground">Monitor and manage AI model performance</p>
        </div>
        <Button className="gap-2" onClick={handleRetrainModels}>
          <RefreshCw className="h-4 w-4" />
          Retrain All Models
        </Button>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-400/10 border border-green-400/20">
              <Activity className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">System Status</p>
              <p className="text-2xl font-bold text-green-400">Operational</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.15}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">API Calls Today</p>
              <p className="text-2xl font-bold text-foreground">44.8K</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.2}>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
              <Cpu className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold text-foreground">124ms</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* AI Models List */}
      <GlassCard delay={0.3}>
        <h3 className="text-xl font-semibold text-foreground mb-4">Active AI Models</h3>
        <div className="space-y-4">
          {models.map((model, index) => (
            <div key={index} className="p-4 rounded-xl bg-muted/30 border border-glass-border hover:border-primary/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Cpu className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">{model.name}</h4>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mt-1 ${model.status === 'active'
                      ? 'bg-green-400/20 text-green-400'
                      : 'bg-yellow-400/20 text-yellow-400'
                      }`}>
                      <Activity className="h-3 w-3" />
                      {model.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-glass-border" onClick={() => handleModelSettings(model.name)}>
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-glass-border" onClick={() => handleRefreshModel(model.name)}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                  <p className="text-sm font-semibold text-foreground">{model.uptime}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Last Trained</p>
                  <p className="text-sm font-semibold text-foreground">{model.lastTrained}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Requests</p>
                  <p className="text-sm font-semibold text-foreground">{model.requests}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                  <p className="text-sm font-semibold text-primary">{model.accuracy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}


