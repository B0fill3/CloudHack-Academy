import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Cloud, Shield, Zap, Server, Code, Lock, ArrowRight, BookOpen, FlaskConical } from "lucide-react"
import Topics from "@/components/Topics"
import { AlertCircle, ShieldOff, UploadCloud, Link2Off, KeyRound, Users, Sparkles, Target } from "lucide-react"

interface Topic {
  title: string
  description: string
  icon: keyof typeof icons
}

const icons = {
  Cloud,
  Shield,
  Zap,
  Server,
  Code,
  Lock,
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <main className="flex-grow relative">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          {/* Enhanced background with multiple layers */}
          <div className="absolute inset-0 z-0">
            {/* Base image with better blur */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-md opacity-60"
              style={{ backgroundImage: "url('/head-wp.jpg')" }}
            />
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-violet-900/70 to-orange-900/80" />
            {/* Additional texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30" />
          </div>

          {/* Animated background elements */}
          <div className="absolute inset-0 z-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500" />
          </div>

          {/* Content */}
          <div className="relative z-20 container mx-auto text-center px-4">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4 mr-2" />
                Laboratorios prácticos de seguridad cloud
              </div>

              {/* Main title with enhanced styling */}
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Aprende Hacking
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                  en AWS
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Sumérgete en laboratorios prácticos y explora las técnicas más avanzadas en seguridad cloud. Mejora tus
                habilidades y conviértete en un experto en hacking ético en la nube.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <Link href="/get-started">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 group border-0"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Comienza ya
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/topics">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    <Target className="mr-2 h-5 w-5" />
                    Explorar tópicos
                  </Button>
                </Link>
              </div>

             
            </div>
          </div>
        </section>

        {/* Vulnerabilities Section */}
        <section className="relative py-24">
          <div className="container mx-auto px-6 max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-300 text-sm font-medium mb-6">
                <AlertCircle className="w-4 h-4 mr-2" />
                Amenazas reales en la nube
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                Vulnerabilidades comunes en
                <span className="text-orange-400 block">entornos cloud</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Descubre las vulnerabilidades más críticas que afectan a las infraestructuras cloud modernas
              </p>
            </div>

            {/* Vulnerabilities Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: UploadCloud,
                  title: "S3 Buckets Públicos",
                  description:
                    "Configuraciones incorrectas pueden dejar archivos sensibles expuestos al público. Esto incluye `.env`, backups y credenciales.",
                  color: "from-red-600 to-rose-600",
                  bgColor: "from-red-500/20 to-rose-500/20",
                  borderColor: "border-red-500/30",
                },
                {
                  icon: Link2Off,
                  title: "Explotación de SSRF en EC2",
                  description:
                    "El acceso al servidor de metadatos puede permitir a un atacante obtener credenciales IAM temporales desde dentro de una instancia EC2.",
                  color: "from-orange-600 to-amber-600",
                  bgColor: "from-orange-500/20 to-amber-500/20",
                  borderColor: "border-orange-500/30",
                },
                {
                  icon: Users,
                  title: "Privilegios mal gestionados en IAM",
                  description:
                    "El uso excesivo de permisos o políticas mal diseñadas permite la escalada de privilegios y acceso no autorizado a recursos críticos.",
                  color: "from-purple-600 to-violet-600",
                  bgColor: "from-purple-500/20 to-violet-500/20",
                  borderColor: "border-purple-500/30",
                },
                {
                  icon: ShieldOff,
                  title: "URLs prefirmadas mal integradas",
                  description:
                    "Una mala implementación de PreSigned URLs puede facilitar el acceso a archivos sensibles sin autenticación adecuada.",
                  color: "from-cyan-600 to-blue-600",
                  bgColor: "from-cyan-500/20 to-blue-500/20",
                  borderColor: "border-cyan-500/30",
                },
                {
                  icon: KeyRound,
                  title: "Fugas de claves y secretos",
                  description:
                    "Archivos mal gestionados, errores en frontend o código fuente expuesto pueden contener claves de acceso a servicios cloud.",
                  color: "from-emerald-600 to-green-600",
                  bgColor: "from-emerald-500/20 to-green-500/20",
                  borderColor: "border-emerald-500/30",
                },
                {
                  icon: AlertCircle,
                  title: "IAM Trust Policy mal configurada",
                  description:
                    "Trust policies mal definidas pueden permitir que roles sean asumidos por identidades no autorizadas, comprometiendo toda la cuenta.",
                  color: "from-pink-600 to-rose-600",
                  bgColor: "from-pink-500/20 to-rose-500/20",
                  borderColor: "border-pink-500/30",
                },
              ].map((vuln, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 items-stretch"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r opacity-20 group-hover:opacity-40 transition-all duration-500 rounded-xl blur" />

                  {/* Card */}
                  <div className="relative h-full bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl group-hover:shadow-xl group-hover:border-white/20 transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-center mb-4">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${vuln.color} mr-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <vuln.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-gray-100 transition-colors duration-300">
                        {vuln.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                      {vuln.description}
                    </p>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-xl" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-lg" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom description */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-zinc-800/50 backdrop-blur-sm border border-white/10" />
              <div className="relative p-8 text-center">
                <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
                  Estas vulnerabilidades son solo una muestra del panorama real al que se enfrentan los profesionales de
                  ciberseguridad en entornos cloud. A través de nuestros{" "}
                  <span className="text-purple-400 font-semibold">laboratorios prácticos</span> aprenderás a
                  detectarlas, explotarlas y proteger tus infraestructuras de manera efectiva.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Topics Section */}
        <section id="topics" className="relative py-24">
          {/* Background with different gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/30 to-transparent" />

          <div className="relative container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 text-purple-300 text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4 mr-2" />
                Contenido educativo
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                Todos los tópicos
                <span className="text-purple-400 block">disponibles</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explora nuestro catálogo completo de tópicos organizados de forma progresiva para tu aprendizaje
              </p>
            </div>

            {/* Topics Component */}
            <Topics />
          </div>
        </section>
      </main>
    </div>
  )
}
