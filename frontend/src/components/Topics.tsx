import Link from "next/link"
import {  ArrowRight, BookOpen, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import path from "path"
import fs from "fs"


interface Topic {
  title: string
  description: string
  logo: string
}

function getTopics(): Topic[] {
  const topicsDirectory = path.join(process.cwd(), "src", "topics")
  const dirnames = fs.readdirSync(topicsDirectory)
  console.log(dirnames)

  const topics: Topic[] = dirnames.map((dirname) => {
    const filePath = path.join(topicsDirectory, dirname, "description.txt")
    console.log(filePath)
    const fileContents = fs.readFileSync(filePath, "utf8")

    return {
      title: dirname,
      description: fileContents ? fileContents : "No description available.",
      logo: "/images/logos/" + dirname + ".png",
    }
  })

  // Ordenar topicos inversamente por título
  topics.sort((a, b) => a.title.localeCompare(b.title))
  // Invertir el orden de los temas
  topics.reverse()
  return topics
}

export default function Topics() {
  const topics = getTopics()

  return (
    <div className="min-h-screen ">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl" />
      </div>

      {/* Topics Section */}
      <main className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="space-y-32">
          {topics.map((topic, index) => {
            const isEven = index % 2 === 0

            return (
              <div key={topic.title} className="group relative">
                {/* Glow effect for the entire card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />

                <Card className="relative overflow-hidden shadow-2xl shadow-white/10 border border-white/10 bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl hover:shadow-purple-500/25 transition-all duration-500 group-hover:scale-[1.02]">
                  <CardContent className="p-0">
                    <div className={`grid lg:grid-cols-2 min-h-[500px] ${!isEven ? "lg:grid-flow-col-dense" : ""}`}>
                      {/* Image Section */}
                      <div
                        className={`relative bg-gradient-to-br ${
                          index % 3 === 2
                            ? "from-indigo-600 via-purple-600 to-violet-600"
                            : index % 3 === 0
                              ? "from-emerald-600 via-teal-600 to-cyan-600"
                              : "from-orange-600 via-red-600 to-rose-600"
                        } flex items-center justify-center overflow-hidden ${!isEven ? "lg:col-start-2" : ""}`}
                      >
                        {/* Animated background patterns */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
                          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-1000" />
                        </div>

                        {/* Main image container with protruding effect */}
                        <div
                          className={`relative z-10 transform transition-all duration-700 group-hover:scale-105 mx-auto${
                            isEven ? "lg:translate-x-12" : "lg:-translate-x-12"
                          }`}
                        >
                          <div className="mx-auto">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-white/30 rounded-3xl blur-2xl scale-110 animate-pulse" />

                            {/* Image container */}
                            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                              {/* Placeholder image */}
                              <div className="relative">
                                <img
                                  src={topic.logo || "/placeholder.svg"}
                                  alt={topic.title}
                                  className="w-72 h-72 object-contain"
                                />
                                {/* Image overlay effect */}
                                <div className="absolute inset-0  rounded-2xl" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div
                        className={`flex flex-col justify-center p-8 lg:p-16 space-y-8 ${!isEven ? "lg:col-start-1 lg:row-start-1" : ""}`}
                      >
                        {/* Topic number */}
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-r shadow-lg ${
                              index % 3 === 2
                                ? "from-indigo-600 to-purple-600"
                                : index % 3 === 0
                                  ? "from-emerald-600 to-teal-600"
                                  : "from-orange-600 to-red-600"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>
                          <div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent" />
                        </div>

                        {/* Title */}
                        <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight group-hover:text-purple-300 transition-colors duration-300">
                          {topic.title}
                        </h2>

                        {/* Description */}
                        <p className="text-lg lg:text-xl text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                          {topic.description}
                        </p>

                        {/* CTA Section */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Link href={`/topics/${topic.title}/Introducción`} className="flex-1">
                            <Button
                              size="lg"
                              className={`w-full bg-gradient-to-r text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn border-0 ${
                                index % 3 === 2
                                  ? "from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-purple-500/50"
                                  : index % 3 === 0
                                    ? "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/50"
                                    : "from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 hover:shadow-orange-500/50"
                              }`}
                            >
                              <BookOpen className="mr-2 h-5 w-5" />
                              Comenzar
                              <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>

                          <Link href={`/topics/${topic.title}/labs`}>
                            <Button
                              size="lg"
                              variant="outline"
                              className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-zinc-400 hover:border-white/30 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn"
                            >
                              <FlaskConical className="mr-2 h-5 w-5" />
                              Laboratorios
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
