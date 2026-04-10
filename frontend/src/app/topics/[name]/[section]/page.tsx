import fs from "fs";
import path from "path";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ReactNode } from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MiniQuiz from "@/components/miniquiz";
import AWSIAMEnvironment from "@/components/awsIAMEnvironment";
import "@/lib/markdown-style-2.css";



export default async function TopicPage({ params }: {
  params: Promise<{ name: string; section: string }>;
}) {
  const { name, section } = await params;
  const decodedName = decodeURIComponent(name);

  let content: string;
  let error: string | null = null;

  try {
    const filename = decodeURI(
      path.join(process.cwd(), "src/topics", name, `${section}.md`)
    );
    content = fs.readFileSync(filename, "utf8");
  } catch (err) {
    error = "No se pudo cargar el contenido del tópico";
    content = "";
  }



  // Estimate reading time (average 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const customComponents: Components = {
    quiz({ node }: { node: any }) {
      const { question, correctanswer, snippet, descanswer } =
        node.properties as {
          question?: string;
          correctanswer?: string;
          snippet?: string;
          descanswer?: string;
        };

      return (
        <MiniQuiz
          question={question ?? ""}
          correctAnswer={correctanswer ?? ""}
          snippet={snippet}
          descAnswer={descanswer}
        />
      );
    },
    iamenv() {
      return <AWSIAMEnvironment />;
    },
    code({
      node,
      inline,
      className,
      children,
      ...props
    }: {
      node: any;
      inline?: boolean;
      className?: string;
      children: ReactNode;
    }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="relative group">
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-gray-400 hover:text-white hover:bg-white/10"
              // onClick={() => {
              //   navigator.clipboard.writeText(
              //     String(children).replace(/\n$/, "")
              //   );
              // }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </Button>
          </div>
          <SyntaxHighlighter
            style={atomDark}
            language={match[1]}
            PreTag="div"
            customStyle={{
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "1.5rem",
              margin: "2rem 0",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  } as unknown as Components;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 flex items-center justify-center" >
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-600/20 to-rose-600/20 border border-red-500/20 mb-4">
              <BookOpen className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Contenido no encontrado
          </h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href={`/topics/${name}`}>
            <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al tópico
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="py-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                href={`/topics/${name}`}
                className="inline-flex items-center text-gray-400 hover:text-purple-300 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Volver a {decodedName}
              </Link>

               
            </div>
          </div>

          {/* Content */}
          <div className="pb-12">
            <article className="relative">
              {/* Content background */}
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/30 to-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl" />

              {/* Markdown content */}
              <div className="relative markdown-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={customComponents}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </article>

            {/* Navigation footer */}
            <div className="mt-12 pt-8 border-t border-white/10 mb-24">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  <span>Parte de </span>
                  <Link
                    href={`/topics/${name}`}
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    {decodedName}
                  </Link>
                </div>

                <div className="flex items-center space-x-4 ">
                  <Link href={`/topics/${name}/labs`}>
                    <Button
                      variant="outline"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                    >
                      Ver Laboratorios
                    </Button>
                  </Link>
                  <Link href="/topics">
                    <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white border-0">
                      Explorar más tópicos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
