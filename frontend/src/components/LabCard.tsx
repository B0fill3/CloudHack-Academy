"use client"

import Link from "next/link"
import { Book, ArrowRight, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Lab {
  id: string
  title: string
  description: string
  difficulty: "begginer" | "intermediate" | "advanced"
  recommendedReadings: string[]
  note?: string
}

interface LabCardProps {
  lab: Lab
  decodedName: string
}

export default function LabCard({ lab, decodedName }: LabCardProps) {

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "begginer":
        return {
          bg: "bg-gradient-to-r from-emerald-500/20 to-green-500/20",
          border: "border-emerald-500/30",
          text: "text-emerald-300",
          icon: "🌱",
          label: "Principiante",
        }
      case "intermediate":
        return {
          bg: "bg-gradient-to-r from-amber-500/20 to-orange-500/20",
          border: "border-amber-500/30",
          text: "text-amber-300",
          icon: "⚡",
          label: "Intermedio",
        }
      case "advanced":
        return {
          bg: "bg-gradient-to-r from-red-500/20 to-rose-500/20",
          border: "border-red-500/30",
          text: "text-red-300",
          icon: "🔥",
          label: "Avanzado",
        }
      default:
        return {
          bg: "bg-gradient-to-r from-gray-500/20 to-slate-500/20",
          border: "border-gray-500/30",
          text: "text-gray-300",
          icon: "📚",
          label: "Desconocido",
        }
    }
  }

  const difficultyConfig = getDifficultyConfig(lab.difficulty)

  return (
    <div
      className="group relative h-full"
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-white rounded-xl blur opacity-10 transition-all duration-500 group-hover:blur-md" />

      {/* Main card */}
      <div className="relative flex flex-col h-full bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-purple-500/25 group-hover:border-purple-500/30">
        {/* Header with animated background */}
        <div className="relative overflow-hidden flex-shrink-0">
          {/* Base gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-violet-900" />

          {/* Animated overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/20 to-pink-500/10 opacity-60" />

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

          <div className="relative px-6 py-5 flex items-center justify-between">
            <div className="flex items-center">
              {/* Icon container with enhanced effects */}
              <div className="relative mr-4">
                <div className="relative p-2.5 rounded-lg bg-white/20 backdrop-blur-sm border border-white/20 group-hover:bg-white/30 group-hover:border-white/30 transition-all duration-300">
                  <FlaskConical className="h-6 w-6 text-white drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>

              {/* Title with enhanced typography */}
              <h2 className="text-xl font-bold text-white drop-shadow-sm group-hover:text-orange-100 transition-colors duration-300 tracking-tight">
                {lab.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow space-y-6">
          {/* Difficulty badge */}
          <div className="flex items-center justify-start flex-shrink-0">
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${difficultyConfig.bg} ${difficultyConfig.border} backdrop-blur-sm`}
            >
              <span className="text-sm">{difficultyConfig.icon}</span>
              <span className={`text-sm font-semibold ${difficultyConfig.text}`}>{difficultyConfig.label}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 flex-shrink-0">
            <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors duration-300 line-clamp-3">
              {lab.description}
            </p>
          </div>

          {/* Recommended readings - with flex-grow to push button to bottom */}
          <div className="flex-grow">
            {lab.recommendedReadings.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-md bg-blue-500/20 border border-blue-500/30">
                    <Book className="h-4 w-4 text-blue-300" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-200">Lecturas Recomendadas</h3>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 p-4">
                  <ul className="space-y-3">
                    {lab.recommendedReadings.map((reading, index) => (
                      <li key={index} className="flex items-start space-x-3 group/item">
                        <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0 group-hover/item:bg-purple-300 transition-colors duration-200" />
                        <Link
                          href={`/topics/${decodedName}/${reading}`}
                          className="text-sm text-gray-300 hover:text-purple-300 hover:underline transition-all duration-200 font-medium flex-1 group-hover/item:text-purple-200"
                        >
                          {reading.includes("_") ? reading.split("_")[1] : reading}
                        </Link>
                      </li>
                    ))}
                   
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Action button - always at bottom */}
          <div className="pt-4 flex-shrink-0 mt-auto">
            <Link href={`/labs/${lab.id}`} className="block">
              <Button className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 border-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                <div className="relative flex items-center justify-center space-x-2">
                  <span>Iniciar Laboratorio</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-xl" />
      </div>
    </div>
  )
}
