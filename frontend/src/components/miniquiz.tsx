'use client'
import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * MiniQuiz – componente interactivo y reutilizable para question/answer type quizzes
 *
 * Props:
 *  - question: string  → La pregunta que se mostrará al usuario
 *  - correctAnswer: string → La respuesta correcta (comparación case‑insensitive, se trimmea)
 *  - snippet?: string → (Opt) Bloque de código / política / texto que acompañe a la pregunta
 */
export interface MiniQuizProps {
  question: string;
  correctAnswer: string;
  snippet?: string;
  descAnswer?: string;
}

const MiniQuiz: React.FC<MiniQuizProps> = ({ question, correctAnswer, snippet, descAnswer }) => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  const check = () => {
    const ok = input.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    setResult(ok ? "correct" : "incorrect");
  };

  const reset = () => {
    setInput("");
    setResult(null);
  };

  return (
     <div className="relative overflow-hidden my-6">
      {/* Background with gradient and blur effects */}
      <div className="absolute inset-0 bg-gradient-to-br  from-zinc-700/90 to-slate-700/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-xl" />

      <div className="relative pt-0 flex flex-col p-8">
        <div className="flex items-start mt-8 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 mr-4 shadow-lg flex-shrink-0 mt-1">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold leading-relaxed text-gray-200 flex-1">{question}</span>
        </div>

        {snippet && (
          <div className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800/50 to-zinc-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm text-gray-200 font-mono whitespace-pre-wrap">{snippet}</pre>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center mt-6">
          <Input
            placeholder="Tu respuesta…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-800/50 backdrop-blur-sm border-slate-700/50 text-gray-200 placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
          <Button
            onClick={check}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comprobar
          </Button>
          {result !== null && (
            <Button
              variant="ghost"
              size="icon"
              onClick={reset}
              title="Reiniciar"
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              ⟲
            </Button>
          )}
        </div>

        {/* Feedback visual */}
        <AnimatePresence>
          {result === "correct" && (
            <motion.div
              key="ok"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="mt-6"
            >
              <div className="relative overflow-hidden rounded-xl mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-500/30" />
                <div className="relative p-4">
                  <div className="flex items-center gap-3 text-emerald-300 mb-3">
                    <div className="p-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="font-medium">¡Correcto!</span>
                  </div>
                  <div className="text-gray-200 leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: descAnswer || "" }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {result === "incorrect" && (
            <motion.div
              key="ko"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="mt-6"
            >
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-sm border border-red-500/30" />
                <div className="relative p-4">
                  <div className="flex items-center gap-3 text-red-300">
                    <div className="p-1 rounded-full bg-red-500/20 border border-red-500/30">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Respuesta incorrecta. ¡Inténtalo de nuevo!</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MiniQuiz;
