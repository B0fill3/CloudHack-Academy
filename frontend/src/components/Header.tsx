"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Cloud,
  BookOpen,
  Route,
  Settings,
  FlaskConical,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/get-started", label: "Primeros Pasos", icon: BookOpen },
    { href: "/topics", label: "Tópicos", icon: Cloud },
    { href: "/learning-path", label: "Ruta de aprendizaje", icon: Route },
    { href: "/aws", label: "Configuración AWS", icon: Settings, special: true },
    { href: "/labs", label: "Labs", icon: FlaskConical },
    { href: "/info", label: "Info", icon: Info },
  ];

  return (
    <header className="relative">
      {/* Background with gradient and blur effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900 backdrop-blur-md border-b border-purple-500/30 shadow-2xl">
        
      </div>

      <div className="relative py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center space-x-2 text-2xl font-bold text-white hover:text-purple-300 transition-all duration-300"
          >
            <div className="p-2 rounded-lg transition-all duration-300 shadow-lg">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              CloudHack Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    className={`group flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm text-gray-200 hover:text-purple-300 hover:shadow-purple-500/20 hover:shadow-lg`}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span>{item.label}</span>
                  </Link>
                  {index < navItems.length - 1 && (
                    <Separator
                      orientation="vertical"
                      className="h-6 bg-gradient-to-b from-transparent via-gray-500/50 to-transparent mx-2"
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/10 hover:text-purple-300 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 z-50 mt-1">
            <div className="mx-6 rounded-xl bg-zinc-900/95 backdrop-blur-md border border-purple-500/30 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-orange-900/20" />
              <nav className="relative p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 text-gray-200 hover:text-purple-300`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
