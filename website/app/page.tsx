"use client"

import { useState, useMemo, useEffect } from "react"

// Custom logger that only shows messages in development
const logger = {
  log: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(message, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    // Always log errors, even in production
    console.error(message, ...args);
  }
};
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Code, GitFork, Star, Search, AlertCircle, ArrowRight, Eye, Sparkles, Terminal } from "lucide-react"
import ScriptCard from "@/components/ScriptCard"
import LanguageCard from "@/components/LanguageCard"
import { ThemeToggle } from "@/components/theme-toggle"
import { GITHUB_CONFIG } from "@/lib/github-config"
import { NervaLogo } from "@/components/NervaLogo"
import { fetchScriptsData } from '@/lib/api'
import { formatVersion } from '@/lib/version'
import type { Tool } from '@/lib/group'
import LoadingPage from '@/components/LoadingPage'

interface ScriptsData {
  lastUpdated: string
  totalTools: number
  totalScripts: number
  featured: Tool[]
  tools: Tool[]
  languages: {
    [key: string]: { count: number }
  }
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [scriptsData, setScriptsData] = useState<ScriptsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadScriptsData() {
      try {
        const data = await fetchScriptsData()
        if (!cancelled) setScriptsData(data)
      } catch (err) {
        logger.error('Error loading scripts:', err)
      } finally {
        // Always reveal the page as soon as the fetch settles — the api layer
        // already times out and falls back to cached/empty data, so there is
        // no need for an artificial delay here.
        if (!cancelled) setLoading(false)
      }
    }

    loadScriptsData()
    return () => { cancelled = true }
  }, [])

  const languages = useMemo(() => {
    if (!scriptsData) {
      return [
        { name: "Python", count: 0, color: "bg-blue-500", repoPath: GITHUB_CONFIG.getLanguagePath("python") },
        { name: "JavaScript", count: 0, color: "bg-yellow-500", repoPath: GITHUB_CONFIG.getLanguagePath("javascript") },
        { name: "Bash", count: 0, color: "bg-green-500", repoPath: GITHUB_CONFIG.getLanguagePath("bash") },
        { name: "PowerShell", count: 0, color: "bg-purple-500", repoPath: GITHUB_CONFIG.getLanguagePath("powershell") },
      ]
    }

    return [
      { 
        name: "Python", 
        count: scriptsData.languages.python?.count || 0, 
        color: "bg-blue-500",
        repoPath: GITHUB_CONFIG.getLanguagePath("python")
      },
      { 
        name: "JavaScript", 
        count: scriptsData.languages.javascript?.count || 0, 
        color: "bg-yellow-500",
        repoPath: GITHUB_CONFIG.getLanguagePath("javascript")
      },
      { 
        name: "Bash", 
        count: scriptsData.languages.bash?.count || 0, 
        color: "bg-green-500",
        repoPath: GITHUB_CONFIG.getLanguagePath("bash")
      },
      { 
        name: "PowerShell", 
        count: scriptsData.languages.powershell?.count || 0, 
        color: "bg-purple-500",
        repoPath: GITHUB_CONFIG.getLanguagePath("powershell")
      },
    ]
  }, [scriptsData])

  const featuredTools = useMemo(() => {
    if (!scriptsData) return []
    if (scriptsData.featured?.length) return scriptsData.featured
    return (scriptsData.tools ?? []).slice(0, 6)
  }, [scriptsData])

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return featuredTools

    const query = searchQuery.toLowerCase()
    return featuredTools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.variants.some((v) => v.language.toLowerCase().includes(query))
    )
  }, [searchQuery, featuredTools])

  const totalScripts = scriptsData?.totalScripts || 0
  const supportedLanguagesCount = languages.filter((l) => l.count > 0).length

  if (loading) {
    return (
      <LoadingPage 
        title="Loading Nerva Scripts"
        subtitle="Discovering powerful automation tools for you..."
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <NervaLogo size={38} className="group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent blur-lg opacity-25 group-hover:opacity-45 transition-opacity duration-300 rounded-full"></div>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Nerva
              </h1>
            </Link>
            <div className="flex items-center space-x-2 md:space-x-5">
              <nav className="hidden md:flex items-center space-x-1">
                <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/90 hover:text-primary hover:bg-primary/5 transition-colors">
                  Home
                </Link>
                <Link href="/scripts" className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/90 hover:text-primary hover:bg-primary/5 transition-colors">
                  All Scripts
                </Link>
              </nav>
              <div className="flex items-center space-x-2 md:space-x-3">
                <ThemeToggle />
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-purple-outline hidden sm:inline-flex"
                  onClick={() => window.open(GITHUB_CONFIG.FORK_URL, '_blank')}
                >
                  <GitFork className="h-4 w-4 mr-2" />
                  Fork
                </Button>
                <Button
                  size="sm"
                  className="btn-purple"
                  onClick={() => window.open(GITHUB_CONFIG.BASE_URL, '_blank')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Star
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        {/* Layered ambient background */}
        <div className="absolute inset-0 grid-backdrop"></div>
        <div className="absolute inset-0 -z-0">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-primary/15 rounded-full blur-[120px]"></div>
          <div className="absolute top-32 -right-20 w-[28rem] h-[28rem] bg-accent/10 rounded-full blur-[110px]"></div>
          <div className="absolute -bottom-32 left-0 w-[26rem] h-[26rem] bg-secondary/10 rounded-full blur-[110px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-primary/25 bg-primary/5 backdrop-blur-sm text-sm font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Open-source script library
          </div>

          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            <span className="text-foreground">A Collection of</span><br />
            <span className="gradient-text">Powerful Scripts</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover, share, and contribute production-ready scripts across multiple
            programming languages — from automation to security tooling.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="btn-purple px-8 py-4 text-base font-semibold"
              onClick={() => document.getElementById('scripts-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Search className="mr-2 h-5 w-5" />
              Explore Scripts
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="btn-purple-outline px-8 py-4 text-base font-semibold"
              onClick={() => window.open(GITHUB_CONFIG.BASE_URL, '_blank')}
            >
              <GitFork className="mr-2 h-5 w-5" />
              Contribute
            </Button>
          </div>

          {/* Trust strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" /> {totalScripts} ready-to-use scripts
            </span>
            <span className="inline-flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" /> {supportedLanguagesCount} languages
            </span>
            <span className="inline-flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" /> MIT licensed
            </span>
          </div>
        </div>
      </section>

      {/* Language Stats */}
      <section className="py-20 bg-gradient-to-b from-muted/10 to-background relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-primary to-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-accent to-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <h3 className="text-4xl font-bold text-center mb-4 text-foreground">
            Supported Languages
          </h3>
          <p className="text-center text-muted-foreground mb-16 text-lg">Power through multiple programming ecosystems</p>
          
          <div className="language-cards-grid grid grid-cols-2 md:grid-cols-4 gap-8">
            {languages.map((lang, index) => (
              <LanguageCard
                key={lang.name}
                name={lang.name}
                count={lang.count}
                color={lang.color}
                repoPath={lang.repoPath}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/5 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-8 text-foreground">
              Find Your Perfect Script
            </h3>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6 group-hover:text-primary transition-colors duration-300" />
                  <Input
                    type="text"
                    placeholder="Search scripts by name, language, category, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-4 text-lg bg-transparent border-0 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scripts Section */}
      <section id="scripts-section" className="py-20 bg-gradient-to-b from-muted/5 to-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <h3 className="text-4xl font-bold text-center mb-16 text-foreground">
            {searchQuery ? "Search Results" : "Featured Scripts"}
          </h3>

          {filteredTools.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-block mb-8">
                <AlertCircle className="h-20 w-20 text-muted-foreground mx-auto" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
              </div>
              <h4 className="text-2xl font-bold text-foreground mb-4">No scripts found</h4>
              <p className="text-muted-foreground mb-6 text-lg">We couldn't find any scripts matching "{searchQuery}".</p>
              <p className="text-muted-foreground/70">
                Try searching with different keywords or check back later as we're constantly adding new scripts!
              </p>
            </div>
          ) : (
            <div className="script-cards-grid grid md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8 2xl:gap-10 justify-items-center">
              {filteredTools.map((tool) => (
                <ScriptCard
                  key={tool.key}
                  title={tool.title}
                  description={tool.description}
                  tags={tool.features}
                  category={tool.category}
                  status="available"
                  repoPath={tool.path}
                  variants={tool.variants}
                />
              ))}
            </div>
          )}
          
          {/* View All Scripts Button */}
          {!searchQuery && (
            <div className="text-center mt-12">
              <Button
                size="lg"
                className="btn-purple px-8 py-3"
                asChild
              >
                <Link href="/scripts">
                  <Eye className="h-4 w-4 mr-2" />
                  View All {totalScripts} Scripts
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
          
          {searchQuery && (
            <div className="text-center mt-12">
              <p className="text-xl font-medium text-foreground">
                Found <span className="text-primary font-bold">{filteredTools.length}</span> tool{filteredTools.length !== 1 ? "s" : ""} matching
                <span className="text-secondary font-bold"> "{searchQuery}"</span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gradient-to-b from-background via-muted/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Nerva by the Numbers
          </h3>
          <p className="text-center text-muted-foreground mb-14">A growing, community-driven collection</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: totalScripts, label: "Available Scripts", sub: "Ready to use now" },
              { value: scriptsData?.totalTools ?? 0, label: "Unique Tools", sub: "Across all languages" },
              { value: supportedLanguagesCount, label: "Languages Supported", sub: "Cross-platform power" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glassmorphism rounded-2xl p-8 text-center hover-lift"
              >
                <div className="text-5xl md:text-6xl font-black mb-3 gradient-text">
                  {stat.value}
                </div>
                <div className="text-foreground text-lg font-semibold">{stat.label}</div>
                <div className="text-muted-foreground text-sm mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gradient-to-b from-background to-muted/10 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <NervaLogo size={32} className="text-primary" />
              <span className="text-2xl font-bold text-foreground">
                Nerva
              </span>
            </div>
            <p className="text-muted-foreground text-lg">
              Made with <span className="text-red-400 animate-pulse">❤️</span> by the Nerva community
            </p>
          </div>
          <div className="text-muted-foreground/70 text-sm">
            Licensed under MIT • Open Source • Community Driven • {formatVersion()}
          </div>
        </div>
      </footer>
    </div>
  )
}
