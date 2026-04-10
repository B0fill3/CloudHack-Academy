"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  PlayCircle,
  StopCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  FlaskConical,
  AlertTriangle,
  User,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Shield,
  Info,
} from "lucide-react"
import axios from "axios"
import { API_GATEWAY_URL } from "@/lib/config"
import { useParams } from "next/navigation"
import { AwsCredentialsForm } from "@/components/awscredentials"
import { AwsDeleteButton } from "@/components/awsDeleteButton"

interface Lab {
  id: string
  title: string
  description: string
  difficulty: string
  recommendedReadings: string[]
  hints: string[]
  note?: string
  credentialsNeeded: boolean
}

export default function LabPage() {
  const { id } = useParams()
  console.log(id)

  const [labStatus, setLabStatus] = useState<"idle" | "deploying" | "running" | "stopping" | "error" | "stopped">(
    "idle",
  )
  const [currentHint, setCurrentHint] = useState(0)
  const [runningURL, setRunningURL] = useState("")
  const [labInfo, setLabInfo] = useState<Lab>()
  const [showHints, setShowHints] = useState(false)
  const [hints, setHints] = useState([])

  const getLabInfo = async () => {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/labs/${id}`)
      // Process the lab info as needed
      return response.data
    } catch (error) {
      console.error("Error fetching lab info:", error)
    }
  }

  useEffect(() => {
    const fetchLabInfo = async () => {
      const info = await getLabInfo()
      setLabInfo(info)
      console.log(info)
      setHints(info.hints)

      // Comprobar si está desplegado el laboratorio
      const running = await axios.get(`${API_GATEWAY_URL}/labs/running-labs`)
      console.log(running.data)
      for (let i = 0; i < running.data.length; i++) {
        if (running.data[i].lab_id === id) {
          setRunningURL("http://localhost:5001")
          setLabStatus("running")
          return
        }
      }
    }
    fetchLabInfo()
  }, [])

  const deployLab = async () => {
    // Here you would typically call an API to deploy the lab
    setLabStatus("deploying")
    try {
      if (labInfo?.credentialsNeeded) {
        const response = await axios.post(API_GATEWAY_URL + "/labs/start-lab-on-aws/" + id, {
          access_key: localStorage.getItem("awsAccessKeyId"),
          secret_key: localStorage.getItem("awsSecretAccessKey"),
          //sessionToken: localStorage.getItem("awsSessionToken"),
          region: localStorage.getItem("awsRegion"),
        })
      } else {
        axios.post(API_GATEWAY_URL + "/labs/start-lab/" + id)
      }

      let running = false
      while (!running) {
        const response = await axios.get(API_GATEWAY_URL + "/labs/is-active/" + id)
        running = response.data.active
        await new Promise((resolve) => setTimeout(resolve, 3000)) // Esperar 3 segundos entre cada iteración
      }

      setRunningURL("http://localhost:5001")
      setLabStatus("running")
    } catch (error) {
      alert("Error deploying lab:" + error)
    }
  }

  const stopLab = async () => {
    setLabStatus("stopping") // Estado intermedio para indicar la espera

    try {
      axios.delete(API_GATEWAY_URL + "/labs/" + id)

      let running = true
      while (running) {
        const response = await axios.get(API_GATEWAY_URL + "/labs/is-active/" + id)
        running = response.data.active
        await new Promise((resolve) => setTimeout(resolve, 3000)) // Esperar 3 segundos entre cada iteración
      }
      setRunningURL("")
      setLabStatus("stopped")
    } catch (error) {
      alert("Error stopping lab: " + error)
      setLabStatus("error") // Indicar error si ocurre
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-emerald-300"
      case "deploying":
        return "text-amber-300"
      case "stopping":
        return "text-orange-300"
      case "error":
        return "text-red-300"
      case "stopped":
        return "text-gray-400"
      default:
        return "text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "idle":
        return "Inactivo"
      case "deploying":
        return "Desplegando"
      case "running":
        return "Ejecutándose"
      case "stopping":
        return "Deteniendo"
      case "error":
        return "Error"
      case "stopped":
        return "Detenido"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 pb-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl" />
      </div>

      <header className="relative pt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="relative ">
            {/* Header background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-600/10 rounded-2xl blur-xl" />

            <div className="relative bg-gradient-to-r from-zinc-800/50 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 mr-4 shadow-lg">
                  <FlaskConical className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    {labInfo ? labInfo.title : "Cargando laboratorio..."}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center text-gray-300">
                      <Shield className="w-4 h-4 mr-1" />
                      Laboratorio práctico
                    </span>
                    <span className={`flex items-center font-medium ${getStatusColor(labStatus)}`}>
                      <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />
                      Estado: {getStatusText(labStatus)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto py-2 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          {/* AWS Credentials Section */}
          {labInfo && labInfo.credentialsNeeded && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl" />
              <div className="relative p-6">
                <AwsCredentialsForm />
              </div>
            </div>
          )}

          {/* Description Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl" />
            <div className="relative p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 mr-3 shadow-lg">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Descripción</h2>
              </div>
              <p className="text-gray-200 leading-relaxed">
                {labInfo ? labInfo.description : "Cargando descripción..."}
              </p>
            </div>
          </div>
          {/* Lab Controls Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl" />
            <div className="relative p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 mr-3 shadow-lg">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Controles del Laboratorio</h2>
              </div>

              {/* Warning for AWS labs */}
              {labInfo && labInfo.credentialsNeeded && (
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full" />
                  <div className="relative p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-full bg-amber-500/20 border border-amber-500/30 flex-shrink-0 mt-0.5">
                        <AlertTriangle className="h-5 w-5 text-amber-300" />
                      </div>
                      <p className="text-amber-200 font-medium text-sm leading-relaxed">
                        ¡Recuerda siempre eliminar los recursos de AWS después de completar el laboratorio!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  onClick={deployLab}
                  disabled={labStatus === "running" || labStatus === "deploying" || labStatus === "stopping"}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border-0 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 disabled:opacity-50"
                >
                  {labStatus === "deploying" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlayCircle className="mr-2 h-4 w-4" />
                  )}
                  {labStatus === "deploying" ? "Desplegando..." : "Desplegar Laboratorio"}
                </Button>

                <Button
                  onClick={stopLab}
                  disabled={labStatus !== "running" && labStatus !== "stopping"}
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-0 shadow-lg hover:shadow-red-500/25 transition-all duration-300 disabled:opacity-50"
                >
                  {labStatus === "stopping" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <StopCircle className="mr-2 h-4 w-4" />
                  )}
                  {labStatus === "stopping" ? "Deteniendo..." : "Detener Laboratorio"}
                </Button>

                {labInfo?.credentialsNeeded && <AwsDeleteButton />}
              </div>

              {/* Status Information */}
              <div className="space-y-4">
                {runningURL ? (
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-500/30" />
                    <div className="relative p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                            <Globe className="h-5 w-5 text-emerald-300" />
                          </div>
                          <p className="text-emerald-200 font-medium">
                            Ejecutándose en{" "}
                            <a
                              href={runningURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-100 hover:text-white underline decoration-emerald-300/50 hover:decoration-white transition-all duration-200"
                            >
                              {runningURL}
                            </a>
                          </p>
                        </div>
                        {!labInfo?.credentialsNeeded && (
                          <div className="flex items-start gap-3">
                            <div className="p-1 rounded-full bg-blue-500/20 border border-blue-500/30 flex-shrink-0 mt-0.5">
                              <Shield className="h-4 w-4 text-blue-300" />
                            </div>
                            <p className="text-blue-200 text-sm leading-relaxed">
                              El emulador de AWS está ejecutándose en{" "}
                              <a
                                className="text-blue-100 hover:text-white underline decoration-blue-300/50 hover:decoration-white transition-all duration-200"
                                href="http://localhost:4566"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                http://localhost:4566
                              </a>
                              . Asegúrate de usar el parámetro{" "}
                              <code className="bg-orange-500/20 text-orange-200 px-2 py-1 rounded border border-orange-500/30">
                                --endpoint-url=http://localhost:4566
                              </code>{" "}
                              al interactuar con los servicios de AWS.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-500/20 backdrop-blur-sm border border-gray-500/30" />
                    <div className="relative p-4">
                      <p className="text-gray-300 font-medium">No hay URL de ejecución disponible</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Note Section */}
          {labInfo && labInfo.note && (
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20 backdrop-blur-sm border border-purple-500/30 rounded" />
              <div className="relative p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 mr-3 shadow-lg">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Nota Importante</h3>
                </div>
                <div className="text-purple-100 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: labInfo.note }} />
                </div>
              </div>
            </div>
          )}

          {/* Credentials Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl" />
            <div className="relative p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 mr-3 shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Credenciales a Utilizar</h2>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-200">
                <span>Usa estas credenciales para iniciar sesión en la aplicación de la tienda de zapatillas:</span>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-2">
                    <User className="mr-2 h-5 w-5 text-purple-400" />
                    <span className="font-mono font-bold text-purple-200">david</span>
                  </div>
                  <div className="flex items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg px-3 py-2">
                    <Lock className="mr-2 h-5 w-5 text-purple-400" />
                    <span className="font-mono font-bold text-purple-200">pwdavid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Hints Section */}
          {/* <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl" />
            <div className="relative p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 mr-3 shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Pistas</h2>
                </div>
                <Button
                  onClick={() => setShowHints(!showHints)}
                  className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm border border-amber-500/30 text-amber-300 hover:bg-gradient-to-r hover:from-amber-600/30 hover:to-orange-600/30 hover:border-amber-500/50 hover:text-amber-200 transition-all duration-300"
                >
                  {showHints ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  {showHints ? "Ocultar Pistas" : "Mostrar Pistas"}
                </Button>
              </div>

              {showHints && (
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-500/20" />
                  <div className="relative p-6">
                    <p className="text-gray-200 leading-relaxed mb-6">{hints[currentHint]}</p>
                    <div className="flex justify-between">
                      <Button
                        onClick={() => setCurrentHint((prev) => Math.max(0, prev - 1))}
                        disabled={currentHint === 0}
                        className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm border border-amber-500/30 text-amber-300 hover:bg-gradient-to-r hover:from-amber-600/30 hover:to-orange-600/30 hover:border-amber-500/50 hover:text-amber-200 transition-all duration-300 disabled:opacity-50"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Anterior
                      </Button>
                      <span className="flex items-center text-gray-400 text-sm">
                        {currentHint + 1} de {hints.length}
                      </span>
                      <Button
                        onClick={() => setCurrentHint((prev) => Math.min(hints.length - 1, prev + 1))}
                        disabled={currentHint === hints.length - 1}
                        className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm border border-amber-500/30 text-amber-300 hover:bg-gradient-to-r hover:from-amber-600/30 hover:to-orange-600/30 hover:border-amber-500/50 hover:text-amber-200 transition-all duration-300 disabled:opacity-50"
                      >
                        Siguiente
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div> */}
        </div>
      </main>
    </div>
  )
}
