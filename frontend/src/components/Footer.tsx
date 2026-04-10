"use client"

import Link from "next/link"
import { Github, Linkedin, Cloud, } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative ">
      {/* Background with gradient and blur effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-slate-900/95 to-gray-900 backdrop-blur-xl border-t border-white/10" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl" />

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center space-y-6">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg ">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                CloudHack Academy
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-center max-w-md leading-relaxed">
              Aprende hacking ético en AWS a través de laboratorios prácticos y contenido educativo de calidad.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <Link
                href="https://github.com/b0fill3"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                  <Github className="w-5 h-5" />
                </div>
                <span className="font-medium">GitHub</span>
              </Link>

              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-500/50 to-transparent" />

              <Link
                href="https://www.linkedin.com/in/bofill3"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300"
              >
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                  <Linkedin className="w-5 h-5" />
                </div>
                <span className="font-medium">LinkedIn</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent" />

            {/* Copyright */}
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>Hecho por</span>
              <span className="text-purple-500/80">B0fill3</span>
              <span>para la comunidad de ciberseguridad</span>
            </div>

            <div className="text-xs text-gray-600">
              © {new Date().getFullYear()} CloudHack Academy. Proyecto educativo open source.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
