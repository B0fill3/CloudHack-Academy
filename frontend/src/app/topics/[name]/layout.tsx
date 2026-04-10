import type React from "react"
import fs from "fs"
import path from "path"
import Link from "next/link"
import { FlaskConical, ArrowLeft, BookOpen, PlayCircle, Layers } from "lucide-react"



interface Topic {
  number: number
  slug: string
  title: string
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)
  const topics = getTopics(name)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <main className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-80 sticky top-0 h-screen">
          {/* Background with gradient and blur effects */}
          <div className="w-80 h-full bg-gradient-to-b from-zinc-900 via-slate-900 to-zinc-900 border-r border-purple-500/20 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-xl" />

            {/* Content */}
            <div className="relative h-full flex flex-col p-6">
              {/* Header Section */}
              <div className="mb-8">
                {/* Back button */}
                <Link
                  href="/topics"
                  className="group flex items-center text-gray-300 hover:text-purple-300 mb-6 p-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  <div className="p-1 rounded-md bg-white/10 mr-3 group-hover:bg-purple-500/20 transition-colors duration-200">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Volver a tópicos</span>
                </Link>

                {/* Topic title */}
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 mr-3 shadow-lg">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-full">
                      <h1 className="text-xl font-bold text-white leading-tight">
                        {decodedName.charAt(0).toUpperCase() + decodedName.slice(1)}
                      </h1>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                        <span className="text-xs text-gray-400">{topics.length + 2} secciones disponibles</span>
                      </div>
                    </div>
                  </div>
                </div>

  
              </div>

              {/* Navigation Section */}
              <div className="flex-1 overflow-y-auto">
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Contenido del tópico
                  </h2>
                </div>

                <nav className="space-y-1">
                  {/* Introduction */}
                  <div className="group">
                    <Link
                      href={`/topics/${name}/Introducción`}
                      className="flex items-center p-3 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-all duration-200 border border-transparent hover:border-purple-500/30"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 border border-slate-600 mr-3 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-200">
                        <PlayCircle className="w-3 h-3 text-gray-400 group-hover:text-purple-300" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">Introducción</span>
                        <div className="text-xs text-gray-500 mt-0.5">Conceptos básicos</div>
                      </div>
                    </Link>
                  </div>

                  {/* Topics */}
                  {topics.map((topic) => (
                    <div key={topic.slug} className="group">
                      <Link
                        href={`/topics/${name}/${topic.slug}`}
                        className="flex items-center p-3 rounded-lg hover:bg-white/10 text-gray-200 hover:text-white transition-all duration-200 border border-transparent hover:border-purple-500/30"
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 border border-slate-600 mr-3 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-200">
                          <span className="text-xs font-semibold text-gray-400 group-hover:text-purple-300">
                            {topic.number}
                          </span>
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{topic.title}</span>
                          <div className="text-xs text-gray-500 mt-0.5">Sección {topic.number}</div>
                        </div>
                      </Link>
                    </div>
                  ))}

                  {/* Labs section */}
                  <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <div className="group">
                      <Link
                        href={`/topics/${name}/labs`}
                        className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-purple-500/10 text-gray-200 hover:text-white transition-all duration-200 border border-transparent hover:border-orange-500/30"
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-500/30 mr-3 group-hover:from-orange-500/30 group-hover:to-purple-500/30 transition-all duration-200">
                          <FlaskConical className="w-3 h-3 text-orange-300" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">Laboratorios</span>
                          <div className="text-xs text-gray-500 mt-0.5">Práctica hands-on</div>
                        </div>
                    
                      </Link>
                    </div>
                  </div>
                </nav>
              </div>


            </div>
          </div>
        </aside>

               <div className="flex-grow border-l-1 border-purple-500">{children}</div> 
      </main>
    </div>
  )
}
