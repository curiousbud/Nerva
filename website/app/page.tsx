"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Code, GitFork, Star, Search, AlertCircle, ArrowRight, Eye } from "lucide-react"
import ScriptCard from "@/components/ScriptCard"
import LanguageCard from "@/components/LanguageCard"
import { ThemeToggle } from "@/components/theme-toggle"
import { NervaLogo } from "@/components/NervaLogo"

interface Script {
  name: string
  path: string
  category: string
  difficulty: string
  description: string
  features: string[]
  requirements: string[]
  usage: string
  display_name: string
  featured?: boolean
  language?: string
}

interface ScriptsData {
  lastUpdated: string
  totalScripts: number
  featured?: (Script & { language: string })[]
  languages: {
    [key: string]: {
      count: number
      scripts: Script[]
    }
  }
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [scriptsData, setScriptsData] = useState<ScriptsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadScriptsData() {
      try {
        const response = await fetch('/data/scripts.json')
        if (!response.ok) {
          throw new Error('Failed to load scripts data')
        }
        const data = await response.json()
        setScriptsData(data)
      } catch (err) {
        console.error('Error loading scripts:', err)
      } finally {
        setLoading(false)
      }
    }

    loadScriptsData()
  }, [])

  const languages = useMemo(() => {
    if (!scriptsData) {
      return [
        { name: "Python", count: 0, color: "bg-blue-500", repoPath: "https://github.com/curiousbud/Nerva/tree/main/scripts/python" },
        { name: "JavaScript", count: 0, color: "bg-yellow-500", repoPath: "https://github.com/curiousbud/Nerva/tree/main/scripts/javascript" },
        { name: "Bash", count: 0, color: "bg-green-500", repoPath: "https://github.com/curiousbud/Nerva/tree/main/scripts/bash" },
        { name: "PowerShell", count: 0, color: "bg-purple-500", repoPath: "https://github.com/curiousbud/Nerva/tree/main/scripts/powershell" },
      ]
    }

    return [
      { 
        name: "Python", 
        count: scriptsData.languages.python?.count || 0, 
        color: "bg-blue-500",
        repoPath: "https://github.com/curiousbud/Nerva/tree/main/scripts/python"
      },
      { 
        name: "JavaScript", 
        count: scriptsData.languages.javascript?.count || 0, 
        color: "bg-yellow-500",
        repoPath: "https://github.com/curiousbud/Nerva/tree/main/scripts/javascript"
      },
      { 
        name: "Bash", 
        count: scriptsData.languages.bash?.count || 0, 
        color: "bg-green-500",
        repoPath: "https://github.com/curiousbud/Nerva/tree/main/scripts/bash"
      },
      { 
        name: "PowerShell", 
        count: scriptsData.languages.powershell?.count || 0, 
        color: "bg-purple-500",
        repoPath: "https://github.com/curiousbud/Nerva/tree/main/scripts/powershell"
      },
    ]
  }, [scriptsData])

  const featuredScripts = useMemo(() => {
    if (!scriptsData) return []
    
    // Use the featured scripts from the API if available
    if (scriptsData.featured && scriptsData.featured.length > 0) {
      return scriptsData.featured
    }
    
    // Fallback: get all scripts and return first 6
    const allScripts: (Script & { language: string })[] = []
    Object.entries(scriptsData.languages).forEach(([language, data]) => {
      data.scripts.forEach(script => {
        allScripts.push({ ...script, language })
      })
    })
    
    return allScripts.slice(0, 6)
  }, [scriptsData])

  const filteredScripts = useMemo(() => {
    if (!searchQuery.trim()) return featuredScripts // Show featured scripts by default

    const query = searchQuery.toLowerCase()
    return featuredScripts.filter(
      (script) =>
        script.display_name.toLowerCase().includes(query) ||
        script.description.toLowerCase().includes(query) ||
        script.language.toLowerCase().includes(query) ||
        script.category.toLowerCase().includes(query)
    )
  }, [searchQuery, featuredScripts])

  const totalScripts = scriptsData?.totalScripts || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <NervaLogo size={40} className="group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 rounded-full"></div>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Nerva
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-foreground hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/scripts" className="text-foreground hover:text-primary transition-colors">
                  All Scripts
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="btn-purple-outline"
                  onClick={() => window.open('https://github.com/curiousbud/Nerva', '_blank')}
                >
                  <GitFork className="h-4 w-4 mr-2" />
                  Fork
                </Button>
                <Button 
                  size="sm"
                  className="btn-purple"
                  onClick={() => window.open('https://github.com/curiousbud/Nerva', '_blank')}
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
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/40 to-secondary/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-accent/15 to-primary/15 rounded-full blur-2xl animate-bounce" style={{animationDuration: "3s"}}></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-secondary/25 to-accent/25 rounded-full blur-lg animate-pulse" style={{animationDelay: "1s"}}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="transform hover:scale-105 transition-all duration-700">
            <h2 className="text-7xl font-black bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-8 drop-shadow-2xl leading-tight">
              A Collection of<br />
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse">
                Powerful Scripts
              </span>
            </h2>
          </div>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto drop-shadow-lg leading-relaxed font-light">
            Discover, share, and contribute cutting-edge scripts across multiple programming languages. 
            From automation to security tools, unlock the power of code.
          </p>
          
          <div className="flex justify-center space-x-6">
            <Button 
              size="lg" 
              className="btn-purple px-8 py-4 text-lg font-bold"
              onClick={() => document.getElementById('scripts-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Search className="mr-2 h-5 w-5" />
              Explore Scripts
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="btn-purple-outline px-8 py-4 text-lg font-semibold"
              onClick={() => window.open('https://github.com/curiousbud/Nerva', '_blank')}
            >
              <GitFork className="mr-2 h-5 w-5" />
              Contribute
            </Button>
          </div>
        </div>
        
        {/* Scrolling indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground/60 rounded-full mt-2 animate-pulse"></div>
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

          {filteredScripts.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-block mb-8">
                <AlertCircle className="h-20 w-20 text-muted-foreground mx-auto animate-pulse" />
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
              {filteredScripts.map((script, index) => (
                <ScriptCard
                  key={script.name}
                  name={script.display_name}
                  description={script.description}
                  language={script.language}
                  tags={script.features || []} // Use features as tags
                  category={script.category}
                  status="available" // All our scripts are available
                  repoPath={script.path} // Add repo path for action buttons
                  onViewScript={() => {
                    if (script.path) {
                      const fullUrl = `https://github.com/curiousbud/Nerva/tree/main/${script.path.replace(/\\/g, '/')}`;
                      window.open(fullUrl, '_blank');
                    }
                  }}
                />
              ))}
            </div>
          )}
          
          {/* View All Scripts Button */}
          {!searchQuery && (
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
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
                Found <span className="text-primary font-bold">{filteredScripts.length}</span> script{filteredScripts.length !== 1 ? "s" : ""} matching 
                <span className="text-secondary font-bold"> "{searchQuery}"</span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-b from-background via-muted/5 to-background relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: "2s"}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h3 className="text-4xl font-bold text-center mb-16 text-foreground">
            Nerva by the Numbers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="group hover:scale-110 transition-transform duration-500">
              <div className="relative">
                <div className="text-6xl font-black mb-4 bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {totalScripts}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="text-foreground text-lg font-medium">Available Scripts</div>
              <div className="text-muted-foreground text-sm mt-2">Ready to use now</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-500">
              <div className="relative">
                <div className="text-6xl font-black mb-4 bg-gradient-to-br from-secondary via-accent to-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  4
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="text-foreground text-lg font-medium">Languages Supported</div>
              <div className="text-muted-foreground text-sm mt-2">Cross-platform power</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-500">
              <div className="relative">
                <div className="text-6xl font-black mb-4 bg-gradient-to-br from-accent via-primary to-secondary bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  0
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="text-foreground text-lg font-medium">In Development</div>
              <div className="text-muted-foreground text-sm mt-2">Coming soon</div>
            </div>
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
            Licensed under MIT • Open Source • Community Driven
          </div>
        </div>
      </footer>
    </div>
  )
}
