"use client"

import { useState, useMemo, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Github, FileText, GitFork, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import ScriptCard from "@/components/ScriptCard"
import { NervaLogo } from "@/components/NervaLogo"
import Link from "next/link"
import { fetchScriptsData } from '@/lib/api'
import { formatVersion } from '@/lib/version'
import { variantsWithPrimary, type Tool } from '@/lib/group'
import LoadingPage from '@/components/LoadingPage'
import ErrorPage from '@/components/ErrorPage'
import { GITHUB_CONFIG } from '@/lib/github-config'

interface ScriptsData {
  lastUpdated: string
  totalTools: number
  totalScripts: number
  tools: Tool[]
  languages: {
    [key: string]: { count: number }
  }
}

export default function ScriptsPage() {
  const [scriptsData, setScriptsData] = useState<ScriptsData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadScriptsData() {
      try {
        const data = await fetchScriptsData()
        if (!cancelled) setScriptsData(data)
      } catch (err) {
        if (!cancelled) setError('Failed to load scripts. Please try again later.')
        console.error('Error loading scripts:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadScriptsData()
    return () => { cancelled = true }
  }, [])

  const allTools = useMemo(() => scriptsData?.tools ?? [], [scriptsData])

  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return allTools.filter(tool => {
      const matchesSearch =
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.variants.some(v => v.language.toLowerCase().includes(query))

      const matchesLanguage =
        selectedLanguage === "all" ||
        tool.variants.some(v => v.language === selectedLanguage)
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "all" || tool.difficulty === selectedDifficulty

      return matchesSearch && matchesLanguage && matchesCategory && matchesDifficulty
    })
  }, [allTools, searchQuery, selectedLanguage, selectedCategory, selectedDifficulty])

  const availableLanguages = useMemo(() => {
    if (!scriptsData) return []
    return Object.keys(scriptsData.languages).filter(lang => scriptsData.languages[lang].count > 0)
  }, [scriptsData])

  const availableCategories = useMemo(
    () => Array.from(new Set(allTools.map(tool => tool.category))),
    [allTools]
  )

  const availableDifficulties = useMemo(
    () => Array.from(new Set(allTools.map(tool => tool.difficulty))),
    [allTools]
  )

  if (loading) {
    return (
      <LoadingPage 
        title="Loading All Scripts"
        subtitle="Fetching the complete script collection..."
      />
    )
  }

  if (error) {
    return (
      <ErrorPage 
        title="Failed to Load Scripts"
        message={error}
        showRefresh={true}
        showHome={true}
        showBack={false}
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
              <NervaLogo size={38} className="group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">Nerva</h1>
                <p className="text-xs text-muted-foreground">All Scripts</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild>
                <Link href={GITHUB_CONFIG.BASE_URL} target="_blank">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Browse All Scripts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of {scriptsData?.totalScripts || 0} automation scripts across multiple programming languages
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Language Filter */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {availableLanguages.map(lang => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {availableDifficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="text-muted-foreground text-sm">
            Showing {filteredTools.length} of {allTools.length} tools
          </div>
        </div>

        {/* Scripts Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No scripts found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="script-cards-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8 2xl:gap-10 justify-items-center">
            {filteredTools.map((tool) => (
              <ScriptCard
                key={tool.key}
                title={tool.title}
                description={tool.description}
                tags={tool.features}
                category={tool.category}
                status="available"
                repoPath={tool.path}
                variants={variantsWithPrimary(tool.variants, selectedLanguage)}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 py-8">
          <div className="bg-card border rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Want to contribute?
            </h3>
            <p className="text-muted-foreground mb-4">
              Help us grow this collection by contributing your own scripts or improving existing ones.
            </p>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href={GITHUB_CONFIG.CONTRIBUTING_URL} target="_blank">
                <GitFork className="h-4 w-4 mr-2" />
                Contribute
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-gradient-to-b from-background to-muted/10 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="text-muted-foreground/70 text-sm">
            Licensed under MIT • Open Source • Community Driven • {formatVersion()}
          </div>
        </div>
      </footer>
    </div>
  )
}
