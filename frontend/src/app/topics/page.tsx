import Topics from "@/components/Topics"
import { BookOpen, Layers, TrendingUp } from "lucide-react"

export default function TopicsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 pb-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl" />
      </div>

      <header className="relative pt-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="relative mb-12">
            {/* Header background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-600/10 rounded-2xl blur-xl" />

            <div className="relative bg-gradient-to-r from-zinc-800/50 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 mr-4 shadow-lg">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                      Tópicos
                      <span className="text-purple-400 ml-2">Disponibles</span>
                    </h1>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <span className="flex items-center text-gray-300">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Contenido educativo
                      </span>
                      <span className="flex items-center text-gray-300">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Progresión estructurada
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                  Explora nuestros tópicos de seguridad cloud organizados de forma progresiva. Cada tópico incluye
                  contenido teórico y laboratorios prácticos para una experiencia de aprendizaje completa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Topics />
      </main>
    </div>
  )
}
