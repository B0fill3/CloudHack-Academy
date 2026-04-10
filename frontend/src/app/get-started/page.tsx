import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cloud,
  AlertTriangle,
  UserPlus,
  Key,
  Server,
  Target,
  Globe,
  BookOpen,
  Play,
  ExternalLink,
  Route,
  Lock,
  FlaskConical,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function AWSHackingIntro() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* ¿Qué es AWS? */}
      <section className="relative py-24 overflow-hidden">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0 z-0">
          {/* Base image with better blur */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30"
            style={{ backgroundImage: "url('/patrongeo.jpg')" }}
          />
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-red-900/70 to-rose-900/80" />
          {/* Additional texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30" />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-red-500/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
              <BookOpen className="w-4 h-4 mr-2" />
              Fundamentos de AWS
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
                ¿Qué es Amazon
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-rose-400 bg-clip-text text-transparent">
                Web Services?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl leading-relaxed">
              Amazon Web Services (AWS) es la plataforma de computación en la
              nube más adoptada del mundo. Ofrece cientos de servicios que
              permiten construir y escalar infraestructuras digitales de forma
              flexible, rápida y segura.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 items-stretch">
            {[
              {
                icon: Cloud,
                title: "Infraestructura Global",
                description:
                  "AWS está presente en múltiples regiones y zonas de disponibilidad, lo que garantiza baja latencia y alta disponibilidad para usuarios en todo el mundo.",
                color: "from-cyan-600 to-blue-600",
              },
              {
                icon: Server,
                title: "Servicios Potentes",
                description:
                  "EC2, S3, Lambda, IAM, RDS y muchos otros servicios conforman un ecosistema robusto que cubre desde computación hasta inteligencia artificial.",
                color: "from-purple-600 to-violet-600",
              },
              {
                icon: Globe,
                title: "Adopción Masiva",
                description:
                  "Adoptado por startups, empresas globales y gobiernos, AWS es la piedra angular del entorno digital moderno y un objetivo clave en seguridad.",
                color: "from-orange-600 to-red-600",
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r opacity-20 group-hover:opacity-40 transition-all duration-500 rounded-xl blur" />

                {/* Card */}
                <Card className="h-full relative bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border border-white/10 shadow-2xl group-hover:shadow-xl group-hover:border-white/20 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white text-lg font-medium">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${item.color} mr-3 shadow-lg`}
                      >
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300 leading-relaxed">
                    {item.description}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Bottom description */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20" />
            <div className="relative p-8">
              <p className="text-lg text-gray-200 leading-relaxed">
                AWS no solo proporciona herramientas potentes, sino que redefine
                cómo se concibe la infraestructura digital moderna. Gracias a su
                enfoque modular y escalable, es posible automatizar tareas,
                integrar soluciones de terceros y ejecutar aplicaciones en
                cualquier parte del mundo con tan solo unos clics. Este nivel de
                flexibilidad y disponibilidad ha revolucionado el desarrollo,
                pero también ha creado un nuevo terreno que tanto
                desarrolladores como expertos en seguridad deben comprender en
                profundidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vulnerabilidades en la nube */}
      <section className="relative py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Section Header */}
          <div className="mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-300 text-sm font-medium mb-8">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Amenazas en la nube
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white leading-tight">
              ¿Cómo surgen las vulnerabilidades
              <span className="text-red-400 block">en la nube?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-6xl leading-relaxed">
              La nube introduce nuevos desafíos de seguridad, donde errores de
              configuración, gestión de identidades y exposición innecesaria de
              servicios pueden convertirse en puertas de entrada para atacantes.
            </p>
          </div>

          {/* Vulnerabilities Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 items-stretch">
            {[
              {
                icon: AlertTriangle,
                title: "Configuración Incorrecta",
                description:
                  "Buckets públicos, grupos de seguridad abiertos, políticas IAM con permisos excesivos o recursos sin cifrado son errores comunes que generan brechas críticas.",
                color: "from-red-600 to-rose-600",
              },
              {
                icon: Key,
                title: "Gestión de Identidades",
                description:
                  "Claves expuestas, credenciales hardcodeadas o falta de autenticación multifactor pueden permitir acceso no autorizado o escalado de privilegios.",
                color: "from-amber-600 to-orange-600",
              },
              {
                icon: Target,
                title: "Superficie de Ataque",
                description:
                  "Servicios sin monitoreo, APIs expuestas públicamente o falta de auditoría incrementan significativamente el riesgo de explotación en entornos cloud.",
                color: "from-purple-600 to-violet-600",
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r opacity-20 group-hover:opacity-40 transition-all duration-500 rounded-xl blur" />

                {/* Card */}
                <Card className="relative h-full bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border border-white/10 shadow-2xl group-hover:shadow-xl group-hover:border-white/20 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white text-lg font-medium">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${item.color} mr-3 shadow-lg`}
                      >
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300 leading-relaxed">
                    {item.description}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Description sections */}
          <div className="space-y-8">
            <p className="text-lg text-gray-300 leading-relaxed">
              Estas vulnerabilidades no siempre son fruto de una mala intención,
              sino de una falta de conocimiento o controles adecuados. El reto
              de asegurar la nube radica en conocer bien cómo funciona su modelo
              compartido de seguridad y en adoptar una mentalidad de
              "configuración segura por defecto". Es ahí donde el pentester
              tiene un rol clave: entender cómo se exponen involuntariamente los
              servicios y cómo detectar configuraciones peligrosas antes que lo
              haga un atacante.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              A continuación, te mostramos una charla introductoria
              extremadamente interesante sobre vulnerabilidades que pueden
              surgir en la nube de AWS. Sirva como inspiración y motivación para
              entender la importancia de la seguridad en este entorno y cómo los
              atacantes pueden aprovecharse de configuraciones incorrectas o
              servicios expuestos.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Agradecer a los dos interlocutores,{" "}
              <span className="text-purple-400 font-semibold">NahamSec</span>{" "}
              (divulgador de ciberseguridad y bug bounty hunter) y{" "}
              <span className="text-purple-400 font-semibold">
                Carlos Polop
              </span>{" "}
              (cofundador de Hacktricks), por ser las mayores fuentes de
              inspiración para el desarrollo de este proyecto.
            </p>
          </div>
          {/* Video Section */}
          <iframe
            src="https://www.youtube.com/embed/Gq4QLy1-jcc?si=BqqhwBSShIJT046C"
            title="YouTube video player"
            className="w-full aspect-video rounded-xl shadow-2xl shadow-white/20 mx-auto my-20"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      {/* Crear cuenta de AWS */}
      <section className="relative py-24 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Section Header */}
          <div className="mb-16 text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-sm font-medium mb-8">
              <UserPlus className="w-4 h-4 mr-2" />
              Configuración inicial
            </div>
            <h2 className="flex text-4xl md:text-5xl font-bold mb-8 text-slate-900 leading-tight">
              Crea tu cuenta de
              <span className="text-orange-600 block ml-2">AWS</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-6xl mx-auto leading-relaxed">
              Para comenzar con los laboratorios de la academia, necesitas una
              cuenta de AWS. El proceso es gratuito y sencillo.
            </p>
          </div>

          {/* Registration Card */}
          <div className="relative mb-16">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200 via-rose-200 to-red-200 rounded-2xl blur opacity-30" />
            <Card className="relative bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800 text-xl font-medium">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-600 mr-3 shadow-lg">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  Registro paso a paso
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <ol className="list-decimal list-inside space-y-4 text-lg">
                  <li className="flex items-start">
                    <span className="mr-3 font-semibold text-orange-600">
                      1.
                    </span>
                    <span>
                      Visita{" "}
                      <a
                        href="https://aws.amazon.com/free"
                        className="text-orange-600 hover:text-orange-700 font-bold underline decoration-orange-600/50 hover:decoration-orange-700 transition-all duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        aws.amazon.com/free
                        <ExternalLink className="inline w-4 h-4 ml-1" />
                      </a>{" "}
                      y haz click sobre "Create a Free Account".
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-semibold text-orange-600">
                      2.
                    </span>
                    <span>
                      Introduce tu dirección de email, contraseña y nombre de
                      cuenta.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-semibold text-orange-600">
                      3.
                    </span>
                    <span>
                      Proporciona tu número de teléfono y método de pago
                      (requerido para validación).
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-semibold text-orange-600">
                      4.
                    </span>
                    <span>Verifica tu identidad.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-semibold text-orange-600">
                      5.
                    </span>
                    <span>Selecciona un plan (elige capa gratuita)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 font-semibold text-orange-600">
                      6.
                    </span>
                    <span>Accede a la consola de AWS.</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Description and Video */}
          <div className="space-y-8">
            
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Tener una cuenta en AWS es necesario para poder desplegar e
                interactuar con la mayoría de los laboratorios de la academia.
                Estos laboratorios están diseñados para desplegarse usando los
                servicios disponibles en la capa gratuita, por lo que no
                deberías incurrir en costos adicionales para poder practicar tus
                habilidades de ciberseguridad.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                A continuación se muestra un breve video que te guiará de una
                forma más detallada a través del proceso de creación de una
                cuenta de AWS.
              </p>
            

            
          </div>
            {/* Video Section */}
            
                <iframe
                  src="https://www.youtube.com/embed/Q6eMTgUDPXg?si=n6sh1Z5K2X8rGIoY"
                  title="YouTube video player"
                  className="w-full aspect-video my-20 rounded-xl shadow-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              
        </div>
      </section>

      {/* Configurar credenciales básicas */}
      <section className="relative py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Section Header */}
          <div className="mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
              <Key className="w-4 h-4 mr-2" />
              Configuración de seguridad
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
              Configurar credenciales
              <span className="text-purple-400 block">básicas</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl leading-relaxed">
              Crea un usuario IAM con permisos adecuados para usar en los
              laboratorios de la academia.
            </p>
          </div>

          {/* IAM User Creation Card */}
          <div className="relative mb-16">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl blur opacity-20" />
            <Card className="relative bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-xl font-medium">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 mr-3 shadow-lg">
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  Crear usuario IAM
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ol className="list-decimal list-inside space-y-4 text-md">
                  <li>Accede a IAM → Users → Add user.</li>
                  <li>
                    Asigna un nombre como{" "}
                    <code className="bg-slate-800/50 border border-slate-700/50 px-3 py-1 rounded text-purple-300">
                      lab-deployment
                    </code>{" "}
                    y habilita acceso programático.
                  </li>
                  <li>
                    Adjunta la política{" "}
                    <code className="bg-slate-800/50 border border-slate-700/50 px-3 py-1 rounded text-purple-300">
                      AdministratorAccess
                    </code>
                    .
                  </li>
                  <li>
                    Finaliza el proceso de creación de usuario
                    <div className="my-6 relative rounded-xl overflow-hidden shadow-2xl">
                      <img
                        src="/images/get-started/lab-deployment-user-step3.png"
                        alt="Creación de usuario IAM paso 3"
                        className="w-full rounded-xl border border-white/10"
                      />
                    </div>
                  </li>
                  <li>
                    Pulsa sobre el usuario recién creado → Security Credentials
                    → Create Access Key
                  </li>
                  <li>
                    Selecciona el caso de uso{" "}
                    <code className="bg-slate-800/50 border border-slate-700/50 px-3 py-1 rounded text-purple-300">
                      Other
                    </code>
                  </li>
                  <li>
                    Otorga un nombre descriptivo a la clave como{" "}
                    <code className="bg-slate-800/50 border border-slate-700/50 px-3 py-1 rounded text-purple-300">
                      Hacking Academy Key
                    </code>
                  </li>
                  <li>
                    Finaliza el proceso de creación de clave y guarda las
                    credenciales
                    <div className="my-6 relative rounded-xl overflow-hidden shadow-2xl">
                      <img
                        src="/images/get-started/lab-deployment-user-key.png"
                        alt="Creación de clave de acceso"
                        className="w-full rounded-xl border border-white/10"
                      />
                    </div>
                    <div className="relative overflow-hidden rounded-xl mt-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-sm border border-red-500/30" />
                      <div className="relative p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-1 rounded-full bg-red-500/20 border border-red-500/30 flex-shrink-0 mt-0.5">
                            <AlertTriangle className="h-4 w-4 text-red-300" />
                          </div>
                          <p className="text-red-200 font-medium leading-relaxed">
                            Las claves de acceso solo se muestran una vez.
                            Guárdalas de forma segura.
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    Configura las credenciales en el apartado de{" "}
                    <a
                      href="/aws"
                      className="text-purple-400 hover:text-purple-300 font-semibold underline decoration-purple-400/50 hover:decoration-purple-300 transition-all duration-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      configuración de AWS
                      <ExternalLink className="inline w-4 h-4 ml-1" />
                    </a>
                    .
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Final description */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-zinc-800/50 backdrop-blur-sm border border-white/10" />
            <div className="relative p-8">
              <p className="text-lg text-gray-300 leading-relaxed">
                Los laboratorios de la academia crean todo tipo de recursos en
                AWS, desde servicios como S3 o Cognito, hasta cuentas de IAM y
                claves de acceso. Por ello, es necesario que configures un
                usuario IAM con permisos amplios (como{" "}
                <code className="bg-slate-800/50 border border-slate-700/50 px-3 py-1 rounded text-purple-300">
                  AdministratorAccess
                </code>
                ) para que puedas desplegar y gestionar todos los recursos
                necesarios para completar los laboratorios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Enhanced background with multiple layers - Blue theme */}
        <div className="absolute inset-0 z-0">
          {/* Base image with better blur */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30"
            style={{ backgroundImage: "url('/head-wp-2.jpg')" }}
          />
          {/* Enhanced gradient overlay - Blue theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-cyan-900/70 to-indigo-900/80" />
          {/* Additional texture overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30" />
        </div>

        {/* Animated background elements - Blue theme */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative z-20 container mx-auto px-6 max-w-6xl">
          {/* Section Header */}
          <div className="mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8">
              <Route className="w-4 h-4 mr-2" />
              Siguiente paso
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Sigue tu ruta de
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                aprendizaje
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl leading-relaxed">
              Ahora que tienes tu cuenta de AWS configurada, es momento de seguir un camino estructurado de aprendizaje
              que te llevará desde los conceptos básicos hasta técnicas avanzadas de hacking ético en la nube.
            </p>
          </div>

          {/* Learning Path Preview */}
          <div className="relative mb-16">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-20" />
            <Card className="relative bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left side - Content */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 mr-4 shadow-lg">
                        <Route className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Ruta de Aprendizaje Estructurada</h3>
                        <p className="text-gray-400">Progresión paso a paso</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse" />
                        <span>Módulos organizados por dificultad</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse" />
                        <span>Combinación de teoría y práctica</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse" />
                        <span>Seguimiento de progreso automático</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse" />
                        <span>Laboratorios prácticos incluidos</span>
                      </div>
                    </div>

                    <Link href="/learning-path">
                      <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-lg px-8 py-4">
                        <Route className="mr-2 h-5 w-5" />
                        Comenzar Ruta de Aprendizaje
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>

                  {/* Right side - Visual representation */}
                  <div className="relative">
                    {/* Learning path visualization */}
                    <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center shadow-lg">
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-emerald-500/30 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 w-full"></div>
                            </div>
                            <p className="text-sm text-emerald-300 mt-1">Fundamentos completados</p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center shadow-lg">
                            <FlaskConical className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-purple-500/30 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 w-3/4"></div>
                            </div>
                            <p className="text-sm text-purple-300 mt-1">Laboratorios en progreso</p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center shadow-lg border border-gray-500/50">
                            <Lock className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="h-2 bg-gray-600/30 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-gray-600 to-gray-700 w-1/4"></div>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Técnicas avanzadas</p>
                          </div>
                        </div>
                      </div>

                      {/* Progress indicator */}
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Progreso general</span>
                          <span className="text-cyan-400 font-semibold">65%</span>
                        </div>
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-purple-500/20 to-violet-500/20 rounded-full blur-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Why follow the learning path */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 items-stretch">
            {[
              {
                icon: Target,
                title: "Progresión Estructurada",
                description:
                  "Cada módulo se basa en el anterior, asegurando una comprensión sólida antes de avanzar a conceptos más complejos.",
                color: "from-emerald-600 to-green-600",
              },
              {
                icon: FlaskConical,
                title: "Práctica Inmediata",
                description:
                  "Aplica inmediatamente lo aprendido con laboratorios prácticos que simulan escenarios reales de seguridad.",
                color: "from-purple-600 to-violet-600",
              },
              {
                icon: TrendingUp,
                title: "Seguimiento de Progreso",
                description:
                  "Mantén un registro de tu avance y desbloquea nuevos contenidos conforme completes cada etapa.",
                color: "from-cyan-600 to-blue-600",
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r opacity-20 group-hover:opacity-40 transition-all duration-500 rounded-xl blur" />

                {/* Card */}
                <Card className="h-full relative bg-gradient-to-br from-zinc-900/90 via-slate-900/90 to-zinc-800/90 backdrop-blur-xl border border-white/10 shadow-2xl group-hover:shadow-xl group-hover:border-white/20 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white text-lg font-medium">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color} mr-3 shadow-lg`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300 leading-relaxed">{item.description}</CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20" />
            <div className="relative p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">¿Listo para comenzar tu aventura?</h3>
              <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto leading-relaxed">
                La ruta de aprendizaje te guiará desde los conceptos básicos hasta técnicas avanzadas de hacking ético
                en AWS. Cada paso está diseñado para construir sobre el conocimiento anterior.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/learning-path">
                  <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 text-lg px-8 py-4">
                    <Route className="mr-2 h-5 w-5" />
                    Iniciar Ruta de Aprendizaje
                  </Button>
                </Link>
                <Link href="/topics">
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 text-lg px-8 py-4"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explorar Tópicos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
