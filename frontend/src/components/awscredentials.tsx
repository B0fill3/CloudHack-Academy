"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Key, Shield, Trash2, Save, Globe, CheckCircle } from "lucide-react"


// Lista de las principales regiones de AWS
const AWS_REGIONS = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "af-south-1",
  "ap-east-1",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-southeast-3",
  "ca-central-1",
  "eu-central-1",
  "eu-central-2",
  "eu-north-1",
  "eu-south-1",
  "eu-south-2",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "me-central-1",
  "me-south-1",
  "sa-east-1",
]

export function AwsCredentialsForm() {
  const [accessKey, setAccessKey] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [sessionToken, setSessionToken] = useState("")
  const [region, setRegion] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Intenta cargar las credenciales desde localStorage al montar el componente
    const storedAccessKey = localStorage.getItem("awsAccessKeyId") || ""
    const storedSecretKey = localStorage.getItem("awsSecretAccessKey") || ""
    const storedSessionToken = localStorage.getItem("awsSessionToken") || ""
    const storedRegion = localStorage.getItem("awsRegion") || ""

    setAccessKey(storedAccessKey)
    setSecretKey(storedSecretKey)
    setSessionToken(storedSessionToken)
    setRegion(storedRegion)
  }, [])

  const handleSubmit = () => {
    if (!accessKey || !secretKey || !region) {
      toast.error("Por favor, rellena Access Key, Secret Key y Region.")
      return
    }

    // Guarda en localStorage
    localStorage.setItem("awsAccessKeyId", accessKey)
    localStorage.setItem("awsSecretAccessKey", secretKey)
    localStorage.setItem("awsSessionToken", sessionToken)
    localStorage.setItem("awsRegion", region)

    // Llama al callback para notificar que se han introducido credenciales
    //onCredentialsSubmit(accessKey, secretKey, sessionToken, region)

    setSubmitted(true)
  }

  const handleRemoveCredentials = () => {
    localStorage.removeItem("awsAccessKeyId")
    localStorage.removeItem("awsSecretAccessKey")
    localStorage.removeItem("awsSessionToken")
    localStorage.removeItem("awsRegion")

    setAccessKey("")
    setSecretKey("")
    setSessionToken("")
    setRegion("")
    setSubmitted(false)
    toast.success("¡Credenciales eliminadas!")
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 mr-3 shadow-lg">
          <Key className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Credenciales de AWS</h2>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            <span className="text-xs text-gray-400">Configuración segura</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="relative overflow-hidden rounded-xl mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20" />
        <div className="relative p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-blue-500/20 border border-blue-500/30 flex-shrink-0 mt-0.5">
              <Shield className="w-4 h-4 text-blue-300" />
            </div>
            <p className="text-gray-200 leading-relaxed text-sm">
              Este laboratorio necesita desplegar una serie de servicios en tu cuenta de aws. Introduce las credenciales
              para tu usuario y selecciona la región para desplegar el laboratorio. Estos servicios consumirán lo mínimo
              indispensable para el funcionamiento del laboratorio, se pueden desplegar usando la capa gratuita.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Access Key */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center">
            <Key className="w-4 h-4 mr-2" />
            Access Key ID
          </label>
          <Input
            type="text"
            placeholder="AKIA..."
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 text-gray-200 placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>

        {/* Secret Key */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Secret Access Key
          </label>
          <Input
            type="password"
            placeholder="••••••••••••••••••••••••••••••••••••••••"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 text-gray-200 placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>

        {/* Region */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Región
          </label>
          <select
            className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="" className="bg-slate-800 text-gray-200">
              Selecciona una región
            </option>
            {AWS_REGIONS.map((r) => (
              <option key={r} value={r} className="bg-slate-800 text-gray-200">
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-4">
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Credenciales
          </Button>
          <Button
            onClick={handleRemoveCredentials}
            variant="outline"
            className="bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-200 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar Credenciales
          </Button>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="relative overflow-hidden rounded-xl mt-4">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-500/30" />
            <div className="relative p-4">
              <div className="flex items-center gap-3 text-emerald-300">
                <div className="p-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="font-medium">¡Credenciales guardadas correctamente!</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
