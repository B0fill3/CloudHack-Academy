"use client"

import { useState, useEffect } from "react"
import { BookOpen, FlaskConical, CheckCircle, Lock, Play, Check, Route, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LearningStep {
  id: number
  type: "reading" | "lab"
  title: string
  section: string
  link: string
  completed?: boolean
  locked?: boolean
}

interface SectionColors {
  [key: string]: {
    gradient: string
    border: string
    badge: string
    text: string
    glow: string
  }
}

export default function LearningPath() {
  // 🎨 Variable para definir colores por sección (adaptado al tema oscuro)
  const sectionColors: SectionColors = {
    S3: {
      gradient: "from-emerald-600 to-green-600",
      border: "border-emerald-500/50",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/25",
    },
    Cognito: {
      gradient: "from-purple-600 to-violet-600",
      border: "border-purple-500/50",
      badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      text: "text-purple-400",
      glow: "shadow-purple-500/25",
    },
    IAM: {
      gradient: "from-red-600 to-rose-600",
      border: "border-red-500/50",
      badge: "bg-red-500/20 text-red-300 border-red-500/30",
      text: "text-red-400",
      glow: "shadow-red-500/25",
    },
    EC2: {
      gradient: "from-orange-600 to-amber-600",
      border: "border-orange-500/50",
      badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      text: "text-orange-400",
      glow: "shadow-orange-500/25",
    },
    GetStarted: {
      gradient: "from-cyan-600 to-sky-600",
      border: "border-cyan-500/50",
      badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/25",
    },
  }

  // 🎯 Variable JSON para definir los pasos del Learning Path
  const initialSteps: LearningStep[] = [
    {
      id: 1,
      type: "reading",
      title: "Introducción a AWS y primeros pasos CloudHack Academy",
      section: "GetStarted",
      link: "/get-started",
    },
    {
      id: 2,
      type: "reading",
      title: "Introducción a S3 Buckets",
      section: "S3",
      link: "/topics/S3 Buckets/Introducción",
    },
    {
      id: 3,
      type: "reading",
      title: "Cómo funcionan los permisos en S3",
      section: "S3",
      link: "/topics/S3 Buckets/1_Permisos en S3",
    },
    {
      id: 4,
      type: "reading",
      title: "Cómo usar AWS CLI para interactuar con buckets de Amazon S3",
      section: "S3",
      link: "/topics/S3 Buckets/2_Comandos CLI",
      
    },
    {
      id: 5,
      type: "lab",
      title: "Bucket de S3 expuesto",
      section: "S3",
      link: "/labs/1",
     
    },
    {
      id: 6,
      type: "reading",
      title: "Qué son las URLs pre-firmadas de S3",
      section: "S3",
      link: "/topics/S3 Buckets/3_Presigned URLs",
    },
    {
      id: 7,
      type: "lab",
      title: "Bucket de S3 con integración incorrecta de URLs prefirmadas",
      section: "S3",
      link: "/labs/3",
    },
    {
      id: 8,
      type: "reading",
      title: "Introducción a AWS Identity and Access Management (IAM)",
      section: "IAM",
      link: "/topics/IAM/Introducción",
    },
    {
      id: 9,
      type: "reading",
      title: "Fundamentos de IAM",
      section: "IAM",
      link: "/topics/IAM/1_Fundamentos de IAM",
    },
    {
      id: 10,
      type: "reading",
      title: "Entidades de IAM",
      section: "IAM",
      link: "/topics/IAM/2_Entidades de IAM",
    },
    {
      id: 11,
      type: "reading",
      title: "Políticas de IAM",
      section: "IAM",
      link: "/topics/IAM/3_Políticas de IAM",
    },
    {
      id: 12,
      type: "reading",
      title: "Otras tipos de políticas a tener en cuenta (fuera de IAM)",
      section: "IAM",
      link: "/topics/IAM/4_Otras Políticas",
    },
    {
      id: 13,
      type: "reading",
      title: "Enumeración de permisos de IAM",
      section: "IAM",
      link: "/topics/IAM/5_Enumeración de Permisos",
    },
    {
      id: 14,
      type: "reading",
      title: "Escalada de privilegios en IAM",
      section: "IAM",
      link: "/topics/IAM/6_Escalada de Privilegios",
    },
    {
      id: 15,
      type: "lab",
      title: "Escalada de Privilegios a través de AccessKey",
      section: "IAM",
      link: "/labs/4",
    },
    {
      id: 16,
      type: "lab",
      title: "Escalada de Privilegios a través de una nueva versión de una política",
      section: "IAM",
      link: "/labs/5",
    },
    {
      id: 17,
      type: "reading",
      title: "Introducción a Elastic Compute Cloud (EC2)",
      section: "EC2",
      link: "/topics/EC2/Introducción",
    },
    {
      id: 18,
      type: "reading",
      title: "Credenciales Temporales y el Servicio de Metadatos en AWS",
      section: "EC2",
      link: "/topics/EC2/1_Servicio de Metadatos",
    },
    {
      id: 19,
      type: "lab",
      title: "Exfiltración de credenciales desde EC2 mediante SSRF al servicio de metadatos",
      section: "EC2",
      link: "/labs/2",
    },
    {
      id:20,
      type: "lab",
      title: "Escalada de Privilegios a través del permiso de \"iam:PassRole\"",
      section: "IAM",
      link: "/labs/6",
    },
    {
      id: 21,
      type: "reading",
      title: "Introducción a Amazon Cognito",
      section: "Cognito",
      link: "/topics/Amazon Cognito/Introducción",
    },
    {
      id: 22,
      type: "reading",
      title: "Cómo funcionan los User Pools de Amazon Cognito",
      section: "Cognito",
      link: "/topics/Amazon Cognito/1_User Pools",
    },
    {
      id: 23,
      type: "reading",
      title: "Abuso de malas prácticas en la integración de User Pools",
      section: "Cognito",
      link: "/topics/Amazon Cognito/2_Malas prácticas con User Pools",
    },
    {
      id: 24,
      type: "lab",
      title: "Acceso no autorizado y escalada de privilegios en Amazon Cognito",
      section: "Cognito",
      link: "/labs/7",
    },
    {
      id: 25,
      type: "lab",
      title: "Ataque de colisión a Amazon Cognito",
      section: "Cognito",
      link: "/labs/8",
    },
    {
      id: 26,
      type: "reading",
      title: "Cómo funcionan los Identity Pools de Amazon Cognito",
      section: "Cognito",
      link: "/topics/Amazon Cognito/3_Identity Pools",
    },
    {
      id: 27,
      type: "reading",
      title: "Abuso de malas prácticas en la integración de Identity Pools",
      section: "Cognito",
      link: "/topics/Amazon Cognito/4_Malas prácticas con Identity Pools",
    },
    {
      id: 28,
      type: "lab",
      title: "Identity Pool Mal Configurado en Amazon Cognito",
      section: "Cognito",
      link: "/labs/9",
    },
    
    
    
    
  ]

  const [learningSteps, setLearningSteps] = useState<LearningStep[]>(initialSteps)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  // Cargar progreso desde localStorage al montar el componente
  useEffect(() => {
    const savedProgress = localStorage.getItem("learning-path-progress")
    if (savedProgress) {
      try {
        const completedSteps = JSON.parse(savedProgress)
        setLearningSteps((prev) =>
          prev.map((step) => ({
            ...step,
            completed: completedSteps.includes(step.id),
          })),
        )
      } catch (error) {
        console.error("Error loading progress:", error)
      }
    }
  }, [])

  // Guardar progreso en localStorage
  const saveProgress = (steps: LearningStep[]) => {
    const completedSteps = steps.filter((step) => step.completed).map((step) => step.id)
    localStorage.setItem("learning-path-progress", JSON.stringify(completedSteps))
  }

  // Marcar/desmarcar como completado
  const toggleCompleted = (stepId: number) => {
    setLearningSteps((prev) => {
      const updatedSteps = prev.map((step) => (step.id === stepId ? { ...step, completed: !step.completed } : step))
      saveProgress(updatedSteps)
      return updatedSteps
    })
  }

  const getStepIcon = (type: string, completed: boolean, locked: boolean) => {
    if (locked) return <Lock className="w-5 h-5 text-gray-400" />
    if (completed) return <CheckCircle className="w-5 h-5 text-emerald-300" />
    if (type === "reading") return <BookOpen className="w-5 h-5 text-white" />
    return <FlaskConical className="w-5 h-5 text-white" />
  }

  const getStepColors = (section: string, completed: boolean, locked: boolean) => {
    if (locked) return "from-gray-600 to-gray-700 border-gray-500/50"
    if (completed) return "from-emerald-600 to-green-600 border-emerald-500/50"
    return sectionColors[section]
      ? `${sectionColors[section].gradient} ${sectionColors[section].border}`
      : "from-gray-600 to-gray-700 border-gray-500/50"
  }

  const getBadgeColor = (type: string) => {
    return type === "reading"
      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
      : "bg-purple-500/20 text-purple-300 border-purple-500/30"
  }

  const getSectionBadgeColor = (section: string) => {
    return sectionColors[section]?.badge || "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 pb-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="relative mb-12">
          {/* Header background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-600/10 rounded-2xl blur-xl" />

          <div className="relative bg-gradient-to-r from-zinc-800/50 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 mr-4 shadow-lg">
                  <Route className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    Ruta de
                    <span className="text-purple-400 ml-2">Aprendizaje</span>
                  </h1>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <span className="flex items-center text-gray-300">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Progresión estructurada
                    </span>
                    <span className="flex items-center text-gray-300">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Aprendizaje guiado
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                Sigue el camino recomendado para aprender hacking ético en Amazon Web Services desde cero hasta nivel
                avanzado.
              </p>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="relative">
          {/* Connecting Path Line */}
          <div className="absolute left-8 top-16 bottom-0 w-1 bg-gradient-to-b from-purple-500/60 via-violet-500/60 to-rose-500/60 rounded-full shadow-lg"></div>

          {learningSteps.map((step, index) => (
            <div key={step.id} className="relative mb-8 last:mb-0">
              {/* Step Container */}
              <div
                className={`flex items-start space-x-6 transition-all duration-300 ${
                  hoveredStep === step.id ? "transform scale-[1.02]" : ""
                }`}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Step Icon Circle */}
                <div
                  className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${getStepColors(step.section, step.completed || false, step.locked || false)} border-2 shadow-lg transition-all duration-300 ${
                    hoveredStep === step.id && !step.locked
                      ? `shadow-xl ${sectionColors[step.section]?.glow || "shadow-purple-500/25"}`
                      : ""
                  }`}
                >
                  {getStepIcon(step.type, step.completed || false, step.locked || false)}

                  {/* Glow Effect */}
                  {hoveredStep === step.id && !step.locked && (
                    <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
                  )}
                </div>

                {/* Step Content Card */}
                <Card
                  className={`flex-1 bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-300 ${
                    hoveredStep === step.id
                      ? `shadow-2xl border-purple-500/30 ${sectionColors[step.section]?.glow || "shadow-purple-500/25"}`
                      : ""
                  } ${step.locked ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className={`${getBadgeColor(step.type)} border backdrop-blur-sm`}>
                          {step.type === "reading" ? "📚 Lectura" : "🧪 Laboratorio"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${getSectionBadgeColor(step.section)} border backdrop-blur-sm`}
                        >
                          {step.section}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-400 font-mono bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                        #{step.id.toString().padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300">
                      {step.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {step.completed && (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 backdrop-blur-sm">
                            ✓ Completado
                          </Badge>
                        )}
                        {step.locked && (
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 backdrop-blur-sm">
                            🔒 Bloqueado
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Botón para marcar como completado */}
                        {!step.locked && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCompleted(step.id)}
                            className={`${
                              step.completed
                                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30"
                                : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                            } transition-all duration-300 backdrop-blur-sm`}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            {step.completed ? "Completado" : "Marcar"}
                          </Button>
                        )}

                        {/* Botón principal */}
                        <Button
                          variant={step.completed ? "secondary" : "default"}
                          size="sm"
                          className={`${
                            step.locked
                              ? "opacity-50 cursor-not-allowed bg-gray-600/50 text-gray-400"
                              : step.completed
                                ? "bg-white/10 hover:bg-white/20 text-gray-300 border border-white/20"
                                : sectionColors[step.section]
                                  ? `bg-gradient-to-r ${sectionColors[step.section].gradient} hover:opacity-90 text-white shadow-lg hover:${sectionColors[step.section].glow}`
                                  : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white shadow-lg hover:shadow-purple-500/25"
                          } transition-all duration-300 border-0`}
                          disabled={step.locked}
                          onClick={() => !step.locked && window.open(step.link, "_blank")}
                        >
                          {step.locked ? (
                            <Lock className="w-4 h-4 mr-2" />
                          ) : step.completed ? (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          {step.locked ? "Bloqueado" : step.completed ? "Revisar" : "Comenzar"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="relative mt-12 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-zinc-800/50 backdrop-blur-sm border border-white/10" />
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 mr-3 shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Progreso del Camino</h3>
              </div>
              <span className="text-purple-400 font-mono font-bold text-lg bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/30">
                {learningSteps.filter((s) => s.completed).length}/{learningSteps.length}
              </span>
            </div>

            <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden border border-slate-600/50 mb-4">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-violet-500 to-cyan-500 transition-all duration-700 ease-out shadow-lg"
                style={{
                  width: `${(learningSteps.filter((s) => s.completed).length / learningSteps.length) * 100}%`,
                }}
              ></div>
            </div>

            <p className="text-gray-300 leading-relaxed">
              Completa cada paso para desbloquear el siguiente nivel de tu aventura en ciberseguridad cloud. Cada módulo
              te acerca más a convertirte en un experto en hacking ético.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-xl" />
        </div>
      </div>
    </div>
  )
}
3