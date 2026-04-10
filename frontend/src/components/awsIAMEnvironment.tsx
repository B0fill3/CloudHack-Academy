"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { API_GATEWAY_URL } from "@/lib/config";
import { Copy, Fingerprint, KeySquare, Loader2 } from "lucide-react";
import { AwsDeleteButton } from "./awsDeleteButton";

interface StackOutput {
  OutputKey: string;
  OutputValue: string;
}

interface EnvironmentResponse {
  outputs: StackOutput[];
  stackName: string;
  status: string;
}

function populateStudentKeys(
  data: EnvironmentResponse,
  setAccessKey: (v: string) => void,
  setSecretKey: (v: string) => void
) {
  if (!data?.outputs?.length) return;

  for (const { OutputKey, OutputValue } of data.outputs) {
    console.log("OutputKey", OutputKey);
    console.log("OutputValue", OutputValue);
    if (OutputKey === "StudentAccessKeyId") {
      setAccessKey(OutputValue);
    } else if (OutputKey === "StudentSecretAccessKey") {
      setSecretKey(OutputValue);
    }
  }
}

export default function AWSIAMEnvironment() {
  const [accessKey, setAccessKey] = React.useState("");
  const [secretKey, setSecretKey] = React.useState("");

  const [deploying, setDeploying] = React.useState(false);
  const [stackStatus, setStackStatus] = React.useState("");

  async function fetchIamEnvironmentStatus() {
    const access_key = localStorage.getItem("awsAccessKeyId");
    const secret_key = localStorage.getItem("awsSecretAccessKey");
    const region = localStorage.getItem("awsRegion") || "us-east-1";

    if (!access_key || !secret_key) {
      //toast.error("Faltan credenciales de AWS")
      return null;
    }

    try {
      const response = await axios.post(
        `${API_GATEWAY_URL}/aws/iam-environment-status`,
        {
          access_key,
          secret_key,
          region,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      return response.data;
    } catch (error) {
      console.log("❌ Error al consultar el estado del entorno IAM:", error);
      return null;
    }
  }

  async function deployEnvironment() {
    const access_key = localStorage.getItem("awsAccessKeyId");
    const secret_key = localStorage.getItem("awsSecretAccessKey");
    const region = localStorage.getItem("awsRegion") || "us-east-1";

    if (!access_key || !secret_key) {
      toast.error(
        "Faltan credenciales de AWS, redirigiendo a la página de configuración",
        {
          style: {
            fontSize: "1.2rem", // más grande
            padding: "1.5rem 2rem", // más espacio
            textAlign: "center",
          },
          position: "top-center", // ignora posición global
        }
      );
      // Esperar 3 segundos antes de redirigir
      await new Promise((resolve) => setTimeout(resolve, 3000));
      window.location.href = "/aws";
      return null;
    }
    setDeploying(true);
    toast.info("Desplegando Entorno IAM...");
    try {
      await axios.post(
        `${API_GATEWAY_URL}/aws/deploy-iam-environment`,
        {
          access_key,
          secret_key,
          region,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      while (true) {
        const status = await fetchIamEnvironmentStatus();
        setStackStatus(status?.status || "");
        if (status?.status === "CREATE_COMPLETE") {
          toast.success("Entorno IAM desplegado correctamente");
          populateStudentKeys(status, setAccessKey, setSecretKey);
          break;
        } else if (status?.status === "CREATE_FAILED") {
          toast.error("Error al desplegar el entorno IAM");
          break;
        } else if (status?.status.includes("ROLLBACK")) {
          toast.error("Error al desplegar el entorno IAM", {
            description:
              "Parece que ocurrió un error inesperado, puedes ver logs detallados desde tu cuenta de AWS en el servicio de CloudFormation.",
            duration: 10000,
          });
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      setDeploying(false);
    } catch (error) {
      console.error("❌ Error al consultar el estado del entorno IAM:", error);
      return null;
    }
  }

  useEffect(() => {
    fetchIamEnvironmentStatus().then((status) => {
      if (status?.status === "CREATE_COMPLETE") {
        toast.success("Entorno IAM desplegado correctamente");
        populateStudentKeys(status, setAccessKey, setSecretKey);
      }
    });
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${label} copiado al portapapeles`))
      .catch(() => toast.error(`Error al copiar ${label}`));
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient and blur effects */}
      <div className="absolute inset-0 bg-gradient-to-br  from-zinc-700/90 to-slate-700/90 backdrop-blur-xl border border-white/10 rounded-xl" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-xl" />

      <div className="relative flex flex-col p-6 shadow-2xl">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 mr-3 shadow-lg">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">
            AWS IAM Environment
          </span>
        </div>

        <p className="text-gray-200 leading-relaxed mb-4">
          Para la siguiente sección deberás contestar una serie de preguntas
          basadas en un entorno de IAM preconfigurado. Se te proporcionarán unas
          credenciales del usuario &quot;Lab-Student&quot; que deberás configurar en tu
          CLI para interactuar con este entorno.
        </p>

        <p className="text-gray-200 leading-relaxed mb-6">
          Si todavía no sabes como configurar un nuevo perfil de AWS en tu CLI
          puedes aprender cómo hacerlo en este{" "}
          <a
            className="text-purple-400 hover:text-purple-300 font-medium underline decoration-purple-400/50 hover:decoration-purple-300 transition-all duration-200"
            target="_blank"
            rel="noopener noreferrer"
            href="https://iriscompanyio.medium.com/how-to-set-up-and-use-multiple-aws-profiles-using-aws-cli-00881cf93f4c#09f1"
          >
            enlace
          </a>
          .
        </p>

        <div className="flex items-center space-x-3 mb-6">
          <Button
            className={`shadow-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-0 transition-all duration-300 ${
              deploying
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-red-500/50"
            }`}
            onClick={async () => {
              await deployEnvironment();
            }}
            disabled={deploying}
          >
            {deploying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 font-mono">{stackStatus}</span>
              </>
            ) : (
              "Desplegar entorno IAM"
            )}
          </Button>
          <AwsDeleteButton></AwsDeleteButton>
        </div>

        {/* Mostrar las credenciales cuando estén disponibles */}
        {(accessKey || secretKey) && (
          <div className="relative overflow-hidden">
            {/* Credentials background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl" />

            <div className="relative p-6 border border-blue-500/30 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="p-1.5 rounded-md bg-blue-500/20 border border-blue-500/30 mr-3">
                  <KeySquare className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-lg font-semibold text-blue-200">
                  Lab-Student Credentials 📚
                </span>
              </div>

              {accessKey && (
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2 text-gray-300">
                      Access Key:
                    </p>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 px-3 py-2 rounded-lg">
                      <span className="text-sm text-gray-200 font-mono break-all">
                        {accessKey}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-3 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                    onClick={() => copyToClipboard(accessKey, "Access Key")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {secretKey && (
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2 text-gray-300">
                      Secret Access Key:
                    </p>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden">
                      <input
                        type="password"
                        defaultValue={secretKey}
                        className="bg-transparent px-3 py-2 text-sm text-gray-200 font-mono w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                        readOnly
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-3 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                    onClick={() =>
                      copyToClipboard(secretKey, "Secret Access Key")
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
