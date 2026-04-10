"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Book, ArrowRight, Beaker, FlaskConical, AlertCircle } from "lucide-react"
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

export default function TopicLabsPage() {
  const params = useParams()
  const decodedName = decodeURIComponent(params.name as string)

  const [labs, setLabs] = useState<Lab[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_GATEWAY_URL}/labs/available-labs`)
      .then((res) => setLabs(res.data[decodedName] ?? []))
      .finally(() => setLoading(false))
  }, [decodedName])

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
                        {decodedName} <span className="text-purple-400 ml-2">Labs</span>
                      </h1>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-gray-300">
                          <Beaker className="w-4 h-4 mr-1" />{labs.length} laboratorios disponibles
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                    Explora los laboratorios prácticos disponibles para este tópico y mejora tus habilidades en
                    seguridad cloud a través de experiencias hands-on.
                  </p>
                </div>
                <div className="hidden lg:block ml-8">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 min-w-[200px]">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">{labs.length}</div>
                      <div className="text-sm text-gray-400">Laboratorios</div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Principiante</span>
                        <span>{labs.filter((l) => l.difficulty === "begginer").length}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Intermedio</span>
                        <span>{labs.filter((l) => l.difficulty === "intermediate").length}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Avanzado</span>
                        <span>{labs.filter((l) => l.difficulty === "advanced").length}</span>
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
          ) : labs.length > 0 ? (
            <div className="space-y-12">
              {labs.map((lab, index) => (
                <div key={lab.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <LabCard lab={lab} decodedName={decodedName} />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/5 to-slate-600/5 rounded-2xl blur-xl" />
              <div className="relative bg-gradient-to-br from-zinc-800/30 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-600/20 to-slate-600/20 border border-gray-500/20 mb-6">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">No hay laboratorios disponibles</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Actualmente no hay laboratorios disponibles para{" "}
                    <span className="text-white font-medium">{decodedName}</span>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/topics">
                      <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" />Explorar otros tópicos
                      </Button>
                    </Link>
                    <Link href="/learning-path">
                      <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0">
                        <Book className="w-4 h-4 mr-2" />Ver ruta de aprendizaje
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
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
