import type React from "react"
import { AwsCredentialsForm } from "@/components/awscredentials"
import AwsResourceList from "@/components/awsResourceList"
import { Settings, Cloud, Shield } from "lucide-react"

const AwsPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800">
    {/* Background decorative elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl" />
    </div>

    <main className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="relative mb-12">
          {/* Header background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-purple-600/10 rounded-2xl blur-xl" />

          <div className="relative bg-gradient-to-r from-zinc-800/50 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 mr-4 shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  Configuración de
                  <span className="text-orange-400 ml-2">AWS</span>
                </h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center text-gray-300">
                    <Cloud className="w-4 h-4 mr-1" />
                    Credenciales y recursos
                  </span>
                  <span className="flex items-center text-gray-300">
                    <Shield className="w-4 h-4 mr-1" />
                    Configuración segura
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
              Configura tus credenciales y recursos de tu cuenta de AWS para el despliegue de los laboratorios de
              seguridad cloud.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative mb-24">
          {/* Content background */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl" />

          <div className="relative p-8">
            <AwsCredentialsForm />
            <div className="my-8 border-t border-white/10" />
            <AwsResourceList />
          </div>
        </div>
      </div>
    </main>
  </div>
)

export default AwsPage
