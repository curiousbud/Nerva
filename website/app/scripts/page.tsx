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
  language?: string  // Make it optional since we add it later
}

interface ScriptsData {
  lastUpdated: string
  totalScripts: number
  languages: {
    [key: string]: {
      count: number
      scripts: Script[]
    }
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
    async function loadScriptsData() {
      try {
        const response = await fetch('/data/scripts.json')
        if (!response.ok) {
          throw new Error('Failed to load scripts data')
        }
        const data = await response.json()
        setScriptsData(data)
      } catch (err) {
        setError('Failed to load scripts. Please try again later.')
        console.error('Error loading scripts:', err)
      } finally {
        setLoading(false)
      }
    }

    loadScriptsData()
  }, [])

  const allScripts = useMemo(() => {
    if (!scriptsData) return []
    
    const scripts: Script[] = []
    Object.entries(scriptsData.languages).forEach(([language, data]) => {
      data.scripts.forEach(script => {
        scripts.push({ ...script, language })
      })
    })
    return scripts
  }, [scriptsData])

  const filteredScripts = useMemo(() => {
    return allScripts.filter(script => {
      const matchesSearch = 
        script.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesLanguage = selectedLanguage === "all" || (script.language && script.language === selectedLanguage)
      const matchesCategory = selectedCategory === "all" || script.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "all" || script.difficulty === selectedDifficulty
      
      return matchesSearch && matchesLanguage && matchesCategory && matchesDifficulty
    })
  }, [allScripts, searchQuery, selectedLanguage, selectedCategory, selectedDifficulty])

  const availableLanguages = useMemo(() => {
    if (!scriptsData) return []
    return Object.keys(scriptsData.languages).filter(lang => scriptsData.languages[lang].count > 0)
  }, [scriptsData])

  const availableCategories = useMemo(() => {
    const categories = new Set(allScripts.map(script => script.category))
    return Array.from(categories)
  }, [allScripts])

  const availableDifficulties = useMemo(() => {
    const difficulties = new Set(allScripts.map(script => script.difficulty))
    return Array.from(difficulties)
  }, [allScripts])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-foreground text-xl">Loading scripts...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-destructive text-xl">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <NervaLogo />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Nerva</h1>
                <p className="text-sm text-muted-foreground">All Scripts</p>
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
                <Link href="https://github.com/curiousbud/Nerva" target="_blank">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
            Showing {filteredScripts.length} of {allScripts.length} scripts
          </div>
        </div>

        {/* Scripts Grid */}
        {filteredScripts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No scripts found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScripts.map((script, index) => (
              <ScriptCard
                key={script.name}
                name={script.display_name}
                description={script.description}
                language={script.language || 'unknown'}
                tags={script.features || []} // Use features as tags
                category={script.category}
                status="available" // All our scripts are available
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
              <Link href="https://github.com/curiousbud/Nerva/blob/main/CONTRIBUTING.md" target="_blank">
                <GitFork className="h-4 w-4 mr-2" />
                Contribute
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
