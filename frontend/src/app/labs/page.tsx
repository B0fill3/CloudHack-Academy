"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Book, ArrowRight, Beaker, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { API_GATEWAY_URL } from "@/lib/config"
import LabCard from "@/components/LabCard"

interface Lab {
  id: string
  title: string
  description: string
  difficulty: "begginer" | "intermediate" | "advanced"
  recommendedReadings: string[]
  note?: string
}

interface TopicLabs {
  [topic: string]: Lab[]
}

function TopicSummaryCard({ topicName, labs }: { topicName: string; labs: Lab[] }) {
  const difficultyCount = {
    begginer: labs.filter((lab) => lab.difficulty === "begginer").length,
    intermediate: labs.filter((lab) => lab.difficulty === "intermediate").length,
    advanced: labs.filter((lab) => lab.difficulty === "advanced").length,
  }

  const getDifficultyConfig = (difficulty: string, count: number) => {
    switch (difficulty) {
      case "begginer":
        return { color: "text-emerald-300", bg: "bg-emerald-500/20", border: "border-emerald-500/30", icon: "🌱", label: "Principiante", count }
      case "intermediate":
        return { color: "text-amber-300", bg: "bg-amber-500/20", border: "border-amber-500/30", icon: "⚡", label: "Intermedio", count }
      case "advanced":
        return { color: "text-red-300", bg: "bg-red-500/20", border: "border-red-500/30", icon: "🔥", label: "Avanzado", count }
      default:
        return { color: "text-gray-300", bg: "bg-gray-500/20", border: "border-gray-500/30", icon: "📚", label: "Desconocido", count: 0 }
    }
  }

  return (
    <div className="group relative mb-8">
      <div className="absolute -inset-0.5 bg-white rounded-xl blur opacity-10 transition-all duration-500" />
      <div className="relative bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 text-white" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="relative px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <h2 className="text-xl font-bold drop-shadow-sm text-white">{topicName}</h2>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  <span className="text-xs text-white">{labs.length} laboratorios disponibles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.entries(difficultyCount).map(([difficulty, count]) => {
              const config = getDifficultyConfig(difficulty, count)
              return (
                <div key={difficulty} className={`flex items-center justify-center p-3 rounded-lg border ${config.bg} ${config.border} backdrop-blur-sm`}>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-sm mr-1">{config.icon}</span>
                      <span className={`text-lg font-bold ${config.color}`}>{count}</span>
                    </div>
                    <span className={`text-xs ${config.color}`}>{config.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-xl" />
      </div>
    </div>
  )
}

export default function TopicLabsPage() {
  const [topicLabs, setTopicLabs] = useState<TopicLabs>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_GATEWAY_URL}/labs/available-labs`)
      .then((res) => setTopicLabs(res.data))
      .finally(() => setLoading(false))
  }, [])

  const topics = Object.entries(topicLabs).sort(([a], [b]) => b.localeCompare(a))
  const totalLabs = Object.values(topicLabs).flat().length
  const totalTopics = topics.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 pb-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl" />
      </div>

      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-600/10 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-r from-zinc-800/50 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 mr-4 shadow-lg">
                      <FlaskConical className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        Todos los <span className="text-purple-400 ml-2">Laboratorios</span>
                      </h1>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-gray-300">
                          <Beaker className="w-4 h-4 mr-1" />{totalLabs} laboratorios totales
                        </span>
                        <span className="flex items-center text-gray-300">
                          <Book className="w-4 h-4 mr-1" />{totalTopics} tópicos
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                    Explora todos los laboratorios disponibles organizados por tópico. Cada laboratorio está diseñado
                    para proporcionarte experiencia práctica en seguridad cloud.
                  </p>
                </div>
                <div className="hidden lg:block ml-8">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 min-w-[200px]">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">{totalLabs}</div>
                      <div className="text-sm text-gray-400 mb-4">Laboratorios Totales</div>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-white/10">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Tópicos</span><span>{totalTopics}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : topics.length === 0 ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/5 to-slate-600/5 rounded-2xl blur-xl" />
              <div className="relative bg-gradient-to-br from-zinc-800/30 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-600/20 to-slate-600/20 border border-gray-500/20 mb-6">
                    <FlaskConical className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">No hay laboratorios disponibles</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Asegúrate de que el backend está en ejecución.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/topics">
                      <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                        <Book className="w-4 h-4 mr-2" />Explorar tópicos
                      </Button>
                    </Link>
                    <Link href="/learning-path">
                      <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0">
                        <ArrowRight className="w-4 h-4 mr-2" />Ver ruta de aprendizaje
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {topics.map(([topicName, labs]) => (
                <section key={topicName}>
                  <TopicSummaryCard topicName={topicName} labs={labs} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {labs.map((lab, index) => (
                      <div key={lab.id} className="animate-fade-in-up h-full" style={{ animationDelay: `${index * 100}ms` }}>
                        <LabCard lab={lab} decodedName={topicName} />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/topics" className="inline-flex items-center text-gray-400 hover:text-purple-300 transition-colors duration-200 group">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
              Volver a todos los tópicos
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
