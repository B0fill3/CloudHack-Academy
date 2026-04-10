import fs from "fs"
import path from "path"
import Link from "next/link"
import {
  BookOpen,
  FlaskConical,
  PlayCircle,
  ArrowRight,
  Home,
  ChevronRight,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { API_GATEWAY_URL } from "@/lib/config"

interface Topic {
  number: number
  slug: string
  title: string
}

interface TopicOverviewPageProps {
    name: string
}

interface Lab {
  id: string
  title: string
  description: string
  difficulty: "begginer" | "intermediate" | "advanced"
  recommendedReadings: string[]
  note?: string
}


function getTopics(name: string): Topic[] {
  const topicsDirectory = path.join(process.cwd(), "src/topics", name)
  const urlDecoded = decodeURI(topicsDirectory)
  const filenames = fs.readdirSync(urlDecoded)

  const topics: Topic[] = filenames
    .filter((filename) => filename.endsWith(".md"))
    .filter((filename) => filename !== "Introducción.md")
    .map((filename) => {
      const [number, ...rest] = filename.replace(".md", "").split("_")
      const title = rest.join("_").replace(/-/g, " ")
      return {
        number: Number.parseInt(number),
        slug: filename.replace(".md", ""),
        title: title.charAt(0).toUpperCase() + title.slice(1),
      }
    })
    .sort((a, b) => a.number - b.number)

  return topics
}


export default async function TopicOverviewPage({ params }: { params: Promise<TopicOverviewPageProps> }) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  const topics = getTopics(name)


  
  
  const response = await axios.get(`${API_GATEWAY_URL}/labs/available-labs`)
  const labs: Lab[] = response.data[decodedName]

  // Calcular estadísticas del tópico
  const totalSections = topics.length + 1 + labs.length // + para introducción y labs
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 pb-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl" />
      </div>

      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <Link
              href="/"
              className="flex items-center text-gray-400 hover:text-purple-300 transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-1" />
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href="/topics" className="text-gray-400 hover:text-purple-300 transition-colors duration-200">
              Tópicos
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="text-gray-300 font-medium">{decodedName}</span>
          </nav>

          {/* Header Section */}
          <div className="relative mb-12">
            {/* Header background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-600/10 rounded-2xl blur-xl" />

            <div className="relative bg-gradient-to-r from-zinc-800/50 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 mr-4 shadow-lg">
                      <Layers className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        {decodedName.charAt(0).toUpperCase() + decodedName.slice(1)}
                      </h1>
                     
                    </div>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                    Explora todas las secciones disponibles para este tópico. Cada sección está diseñada para construir
                    sobre el conocimiento anterior y proporcionarte una comprensión completa del tema.
                  </p>
                </div>

                {/* Stats card */}
                <div className="hidden lg:block ml-8">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 min-w-[200px]">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">{totalSections}</div>
                      <div className="text-sm text-gray-400 mb-4">Recursos totales</div>
                    </div>
                    <div className="space-y-2 pt-4 border-t border-white/10">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Teoría</span>
                        <span>{topics.length + 1}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Laboratorios</span>
                        <span>{labs ? labs.length : 0} </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href={`/topics/${name}/Introducción`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border-0 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 text-lg py-6">
                <PlayCircle className="mr-2 h-5 w-5" />
                Comenzar desde el inicio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/topics/${name}/labs`}>
              <Button
                variant="outline"
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 text-lg py-6 px-8"
              >
                <FlaskConical className="mr-2 h-5 w-5" />
                Ver laboratorios
              </Button>
            </Link>
          </div>

          {/* Sections Grid */}
          <div className="space-y-8">
            {/* Introduction Section */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-xl blur opacity-20" />
              <Card className="relative bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <PlayCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">
                            Introducción
                          </h3>
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Inicio</Badge>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4 group-hover:text-gray-200 transition-colors duration-300">
                          Conceptos fundamentales y visión general del tópico.
                        </p>
                        
                      </div>
                    </div>
                    <Link href={`/topics/${name}/Introducción`}>
                      <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border-0 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Leer
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Sections */}
            {topics.map((topic, index) => {

              // Colores alternados para variedad visual
              const colorSchemes = [
                {
                  gradient: "from-purple-600 to-violet-600",
                  glow: "shadow-purple-500/25",
                  badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                  hover: "text-purple-300",
                },
                {
                  gradient: "from-cyan-600 to-blue-600",
                  glow: "shadow-cyan-500/25",
                  badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
                  hover: "text-cyan-300",
                },
                {
                  gradient: "from-orange-600 to-red-600",
                  glow: "shadow-orange-500/25",
                  badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
                  hover: "text-orange-300",
                },
              ]

              const colorScheme = colorSchemes[index % colorSchemes.length]

              return (
                <div key={topic.slug} className="relative">
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${colorScheme.gradient} rounded-xl blur opacity-20`}
                  />
                  <Card
                    className={`relative bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border border-white/10 shadow-2xl hover:${colorScheme.glow} transition-all duration-300 group`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-r ${colorScheme.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3
                                className={`text-xl font-bold text-white group-hover:${colorScheme.hover} transition-colors duration-300`}
                              >
                                {topic.title}
                              </h3>
                              <Badge className={colorScheme.badge}>Sección {topic.number}</Badge>
                            </div>
                            <p className="text-gray-300 leading-relaxed mb-4 group-hover:text-gray-200 transition-colors duration-300">
                              Contenido detallado sobre {topic.title.toLowerCase()}. 
                            </p>
                            
                          </div>
                        </div>
                        <Link href={`/topics/${name}/${topic.slug}`}>
                          <Button
                            className={`bg-gradient-to-r ${colorScheme.gradient} hover:opacity-90 text-white border-0 shadow-lg hover:${colorScheme.glow} transition-all duration-300`}
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Leer
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}

            {/* Labs Section */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 rounded-xl blur opacity-20" />
              <Card className="relative bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-rose-500/25 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FlaskConical className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors duration-300">
                            Laboratorios Prácticos
                          </h3>
                          <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30">Hands-on</Badge>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-4 group-hover:text-gray-200 transition-colors duration-300">
                          Pon en práctica todo lo aprendido con laboratorios interactivos. Experimenta con escenarios
                          reales y mejora tus habilidades técnicas.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <FlaskConical className="w-4 h-4 mr-1" />
                            Recursos Prácticos
                          </span>
                          
                        </div>
                      </div>
                    </div>
                    <Link href={`/topics/${name}/labs`}>
                      <Button className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white border-0 shadow-lg hover:shadow-rose-500/25 transition-all duration-300">
                        <FlaskConical className="mr-2 h-4 w-4" />
                        Explorar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          

          {/* Back to topics link */}
          <div className="mt-12 text-center">
            <Link
              href="/topics"
              className="inline-flex items-center text-gray-400 hover:text-purple-300 transition-colors duration-200 group"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" />
              Volver a todos los tópicos
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
