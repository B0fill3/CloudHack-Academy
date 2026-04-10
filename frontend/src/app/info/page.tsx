import { Linkedin, Youtube, ExternalLink, Sparkles, Terminal, Cloud } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function InfoPage() {
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

        {/* Hero */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-md opacity-40"
              style={{ backgroundImage: "url('/head-wp.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-violet-900/70 to-orange-900/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/30" />
          </div>

          <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Proyecto de Fin de Grado
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Por qué existe
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                CloudHack Academy
              </span>
            </h1>

         
          </div>
        </section>

        {/* Main content */}
        <section className="relative py-20">
          <div className="container mx-auto px-6 max-w-3xl space-y-24">

            {/* Origin story */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium tracking-wider uppercase">
                <Terminal className="w-3 h-3 mr-2" />
                El origen
              </div>

              <div className="space-y-5 text-gray-300 text-lg leading-relaxed">
                <p>
                  Estaba viendo una entrevista a un gran hacker español en YouTube y habló sobre algo que nunca había visto: una vulnerabilidad SSRF para llegar al{" "}
                  <span className="text-purple-300 font-semibold">servicio de metadatos de EC2</span>.
                </p>

                <p>
                  En un primer momemento no entendí ni si quiera cual era el riesgo de todo eso o qué era lo que un hacker podía llegar a conseguir.
                </p>

                <p >
                  Pero ver que pagaban absolutas barbaridades por fallos de este tipo hizo que me picara la curiosidad. Empecé a investigar y a aprender sobre AWS y este tipo de vulnerabilidades.
                </p>

                <p>
                  Y lo que empezó como curiosidad acabó convirtiéndose en este proyecto.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* About the project */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium tracking-wider uppercase">
                <Cloud className="w-3 h-3 mr-2" />
                El proyecto
              </div>

              <div className="space-y-5 text-gray-300 text-lg leading-relaxed">
                <p>
                  <span className="text-white font-semibold">CloudHack Academy</span> es mi Trabajo de Fin de Grado.
                  Una academia de hacking ético enfocada exclusivamente en AWS.
                </p>

                <p>
                  No es teoría en PDF. Son laboratorios reales donde tú despliegas la infraestructura vulnerable,
                  la atacas, y entiendes exactamente qué falló y por qué.
                </p>

                <p>
                  S3 con acceso público. SSRF hacia el metadata service. Escalada de privilegios en IAM. Cognito
                  con malas configuraciones que dan acceso a roles que no te corresponden.
                </p>

                <p>
                  Todo lo que un atacante real buscaría en una cuenta AWS mal configurada.
                </p>

                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-orange-500/5" />
                  <p className="relative text-gray-200 italic leading-relaxed text-center">
                    "La mejor forma de aprender a defender algo es saber cómo se ataca. Y la mejor forma de aprender
                    a atacarlo es hacerlo de verdad."
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* About the author */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium tracking-wider uppercase">
                Quién hay detrás
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Author card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm p-8 flex-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />

                  <div className="relative space-y-4">
                    <div className="flex items-center gap-5">
                      <div className="relative flex-shrink-0 mb-3">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full opacity-50 blur-sm" />
                        <Image
                          src="/profile-owner.jpg"
                          alt="Bofill"
                          width={800}
                          height={800}
                          className="relative rounded-full object-cover w-36 h-36 border-2 border-white/10"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Alejandro Bofill</h2>
                        <p className="text-purple-300 text-sm font-medium">Ingeniero de Software · Hacker · Creador de contenido</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-gray-300 leading-relaxed">
                      <p>
                        Me gusta romper cosas, entender cómo funcionan y luego compartirlo con los demás. Este proyecto es el resultado de esa pasión por la seguridad en la nube y el hacking ético.
                      </p>

                      <p>
                        Además de este proyecto, tengo mi propio{" "}
                        <span className="text-red-400 font-semibold">canal de YouTube</span> donde enseño hacking.
                        Sin filtros. Sin relleno. Solo técnica real y conceptos que puedas aplicar.
                      </p>

                      <p>
                        Si te interesa el mundo del hacking y la seguridad, sígueme. Hay mucho más por venir.
                      </p>
                    </div>

                    {/* Social links */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link
                        href="https://www.linkedin.com/in/bofill3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-medium hover:bg-blue-600/30 hover:border-blue-400/50 hover:text-blue-200 transition-all duration-300"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </Link>

                      <Link
                        href="https://www.youtube.com/@b0fill3"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-300 text-sm font-medium hover:bg-red-600/30 hover:border-red-400/50 hover:text-red-200 transition-all duration-300"
                      >
                        <Youtube className="w-4 h-4" />
                        Canal de YouTube
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* YouTube embed */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium tracking-wider uppercase">
                  <Youtube className="w-3 h-3 mr-2" />
                  Mi canal
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Esto no tiene nada que ver con AWS.
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Pero si quieres ver lo que hago, de qué va mi contenido y si te encaja seguirme, aquí tienes
                  una muestra.
                </p>
              </div>

              {/* Video embed */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
                <div className="absolute inset-0 bg-gradient from-red-500/5 to-transparent pointer-events-none z-10 " />
                <div className="aspect-video">
                  <iframe
                    src="https://www.youtube.com/embed/qXb7Vy7_S5w"
                    title="Vídeo del canal de Bofill"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full "
                  />
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 via-zinc-900/60 to-violet-900/20 backdrop-blur-sm p-10 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-orange-500/5" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

              <div className="relative space-y-4">
                <h3 className="text-2xl font-bold text-white">
                  Ya sabes de dónde viene esto.
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto">
                  Ahora te toca a ti. Entra en los laboratorios, rompe cosas y aprende cómo funciona realmente la
                  seguridad en AWS.
                </p>
                <div className="pt-2">
                  <Link
                    href="/labs"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <Terminal className="w-4 h-4" />
                    Ir a los labs
                  </Link>
                </div>
              </div>
            </div>

            <div className="pb-8" />
          </div>
        </section>
      </main>
    </div>
  )
}
