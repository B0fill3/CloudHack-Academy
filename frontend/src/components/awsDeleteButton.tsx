"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { API_GATEWAY_URL } from "@/lib/config"
import axios from "axios"
import { Boxes, Loader2, AlertTriangle, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface ConfirmationButtonProps {
  onConfirm: () => void
  className?: string
  children: React.ReactNode
}

function ConfirmationButton({ onConfirm, className, children }: ConfirmationButtonProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>{children}</Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-zinc-900/95 via-slate-900/95 to-zinc-800/95 backdrop-blur-xl border border-white/10 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold text-white">Confirmar Eliminación</DialogTitle>
          </div>
          <DialogDescription className="text-gray-300 leading-relaxed">
            Se eliminarán todos los recursos de AWS generados por esta aplicación, independientemente del laboratorio.
            No se eliminarán recursos de su cuenta que no hayan sido generados por algún laboratorio. ¿Está seguro de
            que desea continuar?
          </DialogDescription>
          <div className="relative overflow-hidden rounded-xl mt-4">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-sm border border-red-500/30" />
            <div className="relative p-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-red-500/20 border border-red-500/30 flex-shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-red-300" />
                </div>
                <p className="text-red-200 text-sm font-medium leading-relaxed">
                  CUIDADO, esto no eliminará los recursos creados directamente por ti para la resolución de los
                  laboratorios. Recuerda eliminar tú mismo manualmente dichos recursos.
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-0 shadow-lg hover:shadow-red-500/25 transition-all duration-300"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Confirmar Eliminación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AwsDeleteButton() {
  const [loading, setLoading] = useState(false)

  const deleteAwsResources = async () => {
    setLoading(true)
    try {
      const response = await axios.delete(API_GATEWAY_URL + "/aws/delete-all-resources", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          access_key: localStorage.getItem("awsAccessKeyId"),
          secret_key: localStorage.getItem("awsSecretAccessKey"),
          region: localStorage.getItem("awsRegion"),
        },
      })
      console.log(response.data)
      setLoading(false)
      toast.success("Recursos eliminados correctamente de AWS")
    } catch (error) {
      console.error("Error deleting AWS resources:", error)
      toast.error("Error al eliminar recursos: " + error)
    }
  }

  return (
    <ConfirmationButton
      onConfirm={deleteAwsResources}
      className="bg-gradient-to-r from-red-600/20 to-rose-600/20 backdrop-blur-sm border border-red-500/30 text-red-300 hover:bg-gradient-to-r hover:from-red-600/30 hover:to-rose-600/30 hover:border-red-500/50 hover:text-red-200 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Boxes className="mr-2 h-4 w-4 text-red-400" />}
      {loading ? "Eliminando recursos..." : "Borrar todos los recursos de AWS"}
    </ConfirmationButton>
  )
}
