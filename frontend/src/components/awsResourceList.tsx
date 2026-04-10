"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Boxes, Loader2, RefreshCcw, AlertCircle, Package } from "lucide-react";
import { API_GATEWAY_URL } from "@/lib/config";
import { AwsDeleteButton } from "./awsDeleteButton";

/**
 * ResourceList – muestra los recursos etiquetados con cloud‑hacking‑labs
 * Llama a un endpoint Flask (por defecto http://localhost:5000/lab-resources).
 * Lee las credenciales guardadas en localStorage por AwsCredentialsForm.
 */
type Resource = {
  arn: string;
  tagValue: string;
};

type ApiResourceResponse = {
  resources: {
    Arn?: string;
    arn?: string;
    TagValue?: string;
    tagValue?: string;
  }[];
};

export default function ResourceList({
  apiBase = API_GATEWAY_URL + "/aws",
}: {
  apiBase?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resources, setResources] = useState<
    Array<{ arn: string; tagValue: string }>
  >([]);

  const fetchResources = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const accessKey = localStorage.getItem("awsAccessKeyId") || "";
      const secretKey = localStorage.getItem("awsSecretAccessKey") || "";
      const region = localStorage.getItem("awsRegion") || "";
      const sessionToken = localStorage.getItem("awsSessionToken") || "";

      if (!accessKey || !secretKey || !region) {
        throw new Error(
          "No se encontraron credenciales en el navegador. Guarda primero tus credenciales."
        );
      }

      const resp = await fetch(`${apiBase}/lab-resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          secret_key: secretKey,
          region,
          session_token: sessionToken,
        }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Error ${resp.status}: ${txt}`);
      }

      const data: ApiResourceResponse = await resp.json();

      const resources: Resource[] = (data.resources || [])
        .map(
          (r): Resource => ({
            arn: r.Arn ?? r.arn ?? "",
            tagValue: r.TagValue ?? r.tagValue ?? "",
          })
        )
        .sort((a, b) => a.tagValue.localeCompare(b.tagValue));

      setResources(resources);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 mr-3 shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Recursos desplegados</h3>
        </div>

        <div className="flex space-x-3">
          <AwsDeleteButton />
          <Button
            onClick={fetchResources}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            {loading ? "Cargando…" : "Listar recursos desplegados"}
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-sm border border-red-500/30" />
          <div className="relative p-4">
            <div className="flex items-center gap-3 text-red-300">
              <div className="p-1 rounded-full bg-red-500/20 border border-red-500/30">
                <AlertCircle className="h-5 w-5" />
              </div>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {resources.length === 0 && !loading && !error && (
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-slate-500/10 backdrop-blur-sm border border-gray-500/20" />
          <div className="relative p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-500/20 border border-gray-500/30 mb-3">
              <Boxes className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-400">
              Aún no se ha solicitado la lista o no existen recursos.
            </p>
          </div>
        </div>
      )}

      {/* Resources List */}
      {resources.length > 0 && (
        <div className="space-y-4">
          {resources.map((r) => (
            <div
              key={r.arn}
              className="group relative overflow-hidden rounded-xl transition-all duration-200 hover:scale-[1.02]"
            >
              {/* Resource background */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-zinc-800/50 backdrop-blur-sm border border-slate-700/50 group-hover:border-purple-500/30" />

              <div className="relative p-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-purple-500/20 border border-purple-500/30 flex-shrink-0 mt-1">
                    <Boxes className="w-4 h-4 text-purple-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="break-all text-sm font-mono leading-relaxed text-gray-200 group-hover:text-gray-100 transition-colors duration-200">
                      {r.arn}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 border border-blue-500/30 text-blue-300">
                        cloud-hacking-labs: {r.tagValue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
