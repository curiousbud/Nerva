"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Code, GitFork, Star, Search, AlertCircle } from "lucide-react"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const languages = [
    { name: "Python", count: 3, color: "bg-blue-500" },
    { name: "JavaScript", count: 0, color: "bg-yellow-500" },
    { name: "Bash", count: 0, color: "bg-green-500" },
    { name: "PowerShell", count: 0, color: "bg-purple-500" },
  ]

  const allScripts = [
    {
      name: "FTP Scanner",
      language: "Python",
      description: "Anonymous FTP login scanner for security testing",
      category: "Security",
      status: "available",
      path: "scripts/python/ftp-scanner/",
      tags: ["security", "ftp", "scanner", "network", "penetration-testing"],
    },
    {
      name: "SHADOW Vulnerability Scanner",
      language: "Python",
      description: "Advanced vulnerability scanner with template support",
      category: "Security",
      status: "available",
      path: "scripts/python/vulnerability-scanner/",
      tags: ["security", "vulnerability", "scanner", "web", "templates", "async"],
    },
    {
      name: "URL Status Checker",
      language: "Python",
      description: "Bulk URL status checker with timeout support",
      category: "Networking",
      status: "available",
      path: "scripts/python/url-status-checker/",
      tags: ["networking", "url", "status", "checker", "monitoring", "bulk"],
    },
    // Placeholder scripts for demonstration
    {
      name: "File Organizer",
      language: "Python",
      description: "Automatically organize files by type and date",
      category: "Automation",
      status: "in-progress",
      path: "",
      tags: ["automation", "files", "organization", "sorting"],
    },
    {
      name: "API Rate Limiter",
      language: "JavaScript",
      description: "Express middleware for API rate limiting",
      category: "Web Development",
      status: "in-progress",
      path: "",
      tags: ["javascript", "api", "rate-limiting", "express", "middleware"],
    },
    {
      name: "System Monitor",
      language: "Bash",
      description: "Monitor system resources and send alerts",
      category: "System Administration",
      status: "in-progress",
      path: "",
      tags: ["bash", "monitoring", "system", "alerts", "resources"],
    },
    {
      name: "Log Analyzer",
      language: "PowerShell",
      description: "Parse and analyze Windows event logs",
      category: "System Administration",
      status: "in-progress",
      path: "",
      tags: ["powershell", "logs", "analysis", "windows", "events"],
    },
  ]

  const filteredScripts = useMemo(() => {
    if (!searchQuery.trim()) return allScripts.slice(0, 6) // Show first 6 by default

    const query = searchQuery.toLowerCase()
    return allScripts.filter(
      (script) =>
        script.name.toLowerCase().includes(query) ||
        script.description.toLowerCase().includes(query) ||
        script.language.toLowerCase().includes(query) ||
        script.category.toLowerCase().includes(query) ||
        script.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }, [searchQuery])

  const availableScripts = allScripts.filter((script) => script.status === "available")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ScriptHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <GitFork className="h-4 w-4 mr-2" />
                Fork
              </Button>
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-2" />
                Star
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="relative mx-auto mb-8 h-32 w-full max-w-2xl">
            <Image src="/assets/banner.jpeg" alt="ScriptHub Banner" fill className="rounded-lg object-cover" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">A Collection of Useful Scripts</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover, share, and contribute scripts across multiple programming languages. From automation to security
            tools, find the script you need.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg">Browse Scripts</Button>
            <Button variant="outline" size="lg">
              Contribute
            </Button>
          </div>
        </div>
      </section>

      {/* Language Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8">Supported Languages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {languages.map((lang) => (
              <Card key={lang.name} className="text-center">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 ${lang.color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-lg">{lang.name}</h4>
                  <p className="text-gray-600">{lang.count} scripts</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search scripts by name, language, category, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Scripts Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8">{searchQuery ? "Search Results" : "Featured Scripts"}</h3>

          {filteredScripts.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No scripts found</h4>
              <p className="text-gray-500 mb-4">We couldn't find any scripts matching "{searchQuery}".</p>
              <p className="text-sm text-gray-400">
                Try searching with different keywords or check back later as we're constantly adding new scripts!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScripts.map((script) => (
                <Card
                  key={script.name}
                  className={`hover:shadow-lg transition-shadow ${
                    script.status === "in-progress" ? "opacity-75 border-dashed" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{script.language}</Badge>
                    </div>
                    <div className="flex items-start gap-2 mb-2">
                      <CardTitle className="text-lg flex-1 min-w-0">{script.name}</CardTitle>
                      {script.status === "in-progress" && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          In Progress
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{script.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {script.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {script.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{script.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{script.category}</Badge>
                      {script.status === "available" ? (
                        <Button variant="ghost" size="sm">
                          View Script
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {searchQuery && (
            <div className="text-center mt-6">
              <p className="text-lg font-medium text-gray-700">
                Found {filteredScripts.length} script{filteredScripts.length !== 1 ? "s" : ""} matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{availableScripts.length}</div>
              <div className="text-slate-300">Available Scripts</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4</div>
              <div className="text-slate-300">Languages Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">{allScripts.length - availableScripts.length}</div>
              <div className="text-slate-300">Scripts In Development</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Made with ❤️ by the ScriptHub community. Licensed under MIT.</p>
        </div>
      </footer>
    </div>
  )
}
