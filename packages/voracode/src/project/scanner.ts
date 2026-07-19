import path from "path"
import fs from "fs/promises"

export interface ProjectInfo {
  readonly languages: string[]
  readonly frameworks: string[]
  readonly buildTools: string[]
  readonly packageManager: string
  readonly testFramework: string
  readonly configFiles: string[]
}

const EXTENSION_MAP: Record<string, string> = {
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".mjs": "JavaScript",
  ".cjs": "JavaScript",
  ".py": "Python",
  ".pyw": "Python",
  ".rs": "Rust",
  ".go": "Go",
  ".java": "Java",
  ".kt": "Kotlin",
  ".rb": "Ruby",
  ".php": "PHP",
  ".c": "C",
  ".cpp": "C++",
  ".cc": "C++",
  ".h": "C/C++",
  ".cs": "C#",
  ".swift": "Swift",
  ".scala": "Scala",
  ".lua": "Lua",
  ".r": "R",
  ".R": "R",
  ".ex": "Elixir",
  ".exs": "Elixir",
  ".erl": "Erlang",
  ".hs": "Haskell",
  ".vue": "Vue",
  ".svelte": "Svelte",
}

const CONFIG_DETECTORS: Array<{ file: string; detect: (content: string) => Partial<ProjectInfo> }> = [
  {
    file: "package.json",
    detect: (content) => {
      let pkg: Record<string, unknown>
      try {
        pkg = JSON.parse(content)
      } catch {
        return {}
      }
      const deps = {
        ...(typeof pkg.dependencies === "object" && pkg.dependencies ? pkg.dependencies : {}),
        ...(typeof pkg.devDependencies === "object" && pkg.devDependencies ? pkg.devDependencies : {}),
        ...(typeof pkg.peerDependencies === "object" && pkg.peerDependencies ? pkg.peerDependencies : {}),
      } as Record<string, string>
      const frameworks: string[] = []
      const buildTools: string[] = []
      let testFramework = ""

      if (deps["next"]) frameworks.push("Next.js")
      if (deps["nuxt"]) frameworks.push("Nuxt")
      if (deps["react"]) frameworks.push("React")
      if (deps["vue"]) frameworks.push("Vue")
      if (deps["svelte"]) frameworks.push("Svelte")
      if (deps["solid-js"]) frameworks.push("SolidJS")
      if (deps["angular"]) frameworks.push("Angular")
      if (deps["@nestjs/core"]) frameworks.push("NestJS")
      if (deps["express"]) frameworks.push("Express")
      if (deps["hono"]) frameworks.push("Hono")
      if (deps["fastify"]) frameworks.push("Fastify")

      if (deps["vite"]) buildTools.push("Vite")
      if (deps["webpack"]) buildTools.push("Webpack")
      if (deps["esbuild"]) buildTools.push("esbuild")
      if (deps["rollup"]) buildTools.push("Rollup")
      if (deps["turbo"]) buildTools.push("Turborepo")
      if (deps["eslint"]) buildTools.push("ESLint")
      if (deps["prettier"]) buildTools.push("Prettier")
      if (deps["typescript"]) buildTools.push("TypeScript")

      if (deps["vitest"]) testFramework = "Vitest"
      else if (deps["jest"]) testFramework = "Jest"
      else if (deps["mocha"]) testFramework = "Mocha"
      else if (deps["@playwright/test"]) testFramework = "Playwright"
      else if (deps["cypress"]) testFramework = "Cypress"

      return { frameworks, buildTools, testFramework }
    },
  },
  {
    file: "tsconfig.json",
    detect: () => ({ languages: ["TypeScript"], configFiles: ["tsconfig.json"] }),
  },
  {
    file: "Cargo.toml",
    detect: (content) => {
      const frameworks: string[] = []
      if (content.includes("[dependencies.axum]")) frameworks.push("Axum")
      if (content.includes("[dependencies.tokio]")) frameworks.push("Tokio")
      if (content.includes("[dependencies.actix-web]")) frameworks.push("Actix")
      if (content.includes("[dependencies.rocket]")) frameworks.push("Rocket")
      return { languages: ["Rust"], frameworks, buildTools: ["Cargo"], configFiles: ["Cargo.toml"] }
    },
  },
  {
    file: "go.mod",
    detect: (content) => {
      const frameworks: string[] = []
      if (content.includes("github.com/gin-gonic/gin")) frameworks.push("Gin")
      if (content.includes("github.com/gofiber/fiber")) frameworks.push("Fiber")
      if (content.includes("github.com/labstack/echo")) frameworks.push("Echo")
      if (content.includes("github.com/gorilla/mux")) frameworks.push("Gorilla Mux")
      return { languages: ["Go"], frameworks, configFiles: ["go.mod"] }
    },
  },
  {
    file: "pyproject.toml",
    detect: (content) => {
      const frameworks: string[] = []
      const buildTools: string[] = []
      let testFramework = ""

      if (content.includes("django")) frameworks.push("Django")
      if (content.includes("flask")) frameworks.push("Flask")
      if (content.includes("fastapi")) frameworks.push("FastAPI")
      if (content.includes("starlette")) frameworks.push("Starlette")

      if (content.includes("poetry")) buildTools.push("Poetry")
      if (content.includes("hatchling")) buildTools.push("Hatch")
      if (content.includes("setuptools")) buildTools.push("Setuptools")
      if (content.includes("pdm-backend")) buildTools.push("PDM")

      if (content.includes("pytest")) testFramework = "pytest"

      return { languages: ["Python"], frameworks, buildTools, testFramework, configFiles: ["pyproject.toml"] }
    },
  },
  {
    file: "requirements.txt",
    detect: () => ({ languages: ["Python"], configFiles: ["requirements.txt"] }),
  },
  {
    file: "Gemfile",
    detect: (content) => {
      const frameworks: string[] = []
      if (content.includes("rails")) frameworks.push("Rails")
      if (content.includes("sinatra")) frameworks.push("Sinatra")
      return { languages: ["Ruby"], frameworks, configFiles: ["Gemfile"] }
    },
  },
  {
    file: "pom.xml",
    detect: (content) => {
      const frameworks: string[] = []
      if (content.includes("spring-boot")) frameworks.push("Spring Boot")
      return { languages: ["Java"], frameworks, buildTools: ["Maven"], configFiles: ["pom.xml"] }
    },
  },
  {
    file: "build.gradle",
    detect: () => ({ languages: ["Java"], buildTools: ["Gradle"], configFiles: ["build.gradle"] }),
  },
  {
    file: "build.gradle.kts",
    detect: () => ({ languages: ["Kotlin", "Java"], buildTools: ["Gradle"], configFiles: ["build.gradle.kts"] }),
  },
  {
    file: "composer.json",
    detect: (content) => {
      const frameworks: string[] = []
      if (content.includes("laravel/framework")) frameworks.push("Laravel")
      if (content.includes("symfony/framework-bundle")) frameworks.push("Symfony")
      return { languages: ["PHP"], frameworks, configFiles: ["composer.json"] }
    },
  },
]

async function fileExists(filePath: string) {
  return fs.stat(filePath).then(() => true, () => false)
}

async function readConfigFile(dir: string, filename: string): Promise<string | undefined> {
  const filePath = path.join(dir, filename)
  const exists = await fileExists(filePath)
  if (!exists) return undefined
  return Bun.file(filePath).text()
}

function detectPackageManager(dir: string, files: string[]) {
  if (files.includes("bun.lockb") || files.includes("bun.lock")) return "bun"
  if (files.includes("pnpm-lock.yaml")) return "pnpm"
  if (files.includes("yarn.lock")) return "yarn"
  if (files.includes("package-lock.json")) return "npm"
  if (files.includes("Cargo.lock")) return "cargo"
  if (files.includes("go.sum")) return "go"
  if (files.includes("poetry.lock")) return "poetry"
  if (files.includes("Pipfile.lock")) return "pipenv"
  if (files.includes("pnpm-workspace.yaml")) return "pnpm"
  return ""
}

function countExtensions(files: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    const lang = EXTENSION_MAP[ext]
    if (lang) counts.set(lang, (counts.get(lang) ?? 0) + 1)
  }
  return counts
}

export async function scanProject(projectDir: string): Promise<ProjectInfo> {
  const languages: string[] = []
  const frameworks: string[] = []
  const buildTools: string[] = []
  const configFiles: string[] = []

  let packageManager = ""
  let testFramework = ""

  let files: string[] = []
  try {
    const entries = await fs.readdir(projectDir, { recursive: true, withFileTypes: true })
    files = entries.filter((e) => e.isFile()).map((e) => path.join(e.parentPath, e.name))
  } catch {
    files = []
  }

  const shallowFiles = files.map((f) => path.basename(f))

  packageManager = detectPackageManager(projectDir, shallowFiles)

  for (const detector of CONFIG_DETECTORS) {
    const content = await readConfigFile(projectDir, detector.file)
    if (!content) continue

    const result = detector.detect(content)
    if (result.languages) languages.push(...result.languages)
    if (result.frameworks) frameworks.push(...result.frameworks)
    if (result.buildTools) buildTools.push(...result.buildTools)
    if (result.configFiles) configFiles.push(...result.configFiles)
    if (result.packageManager) packageManager = result.packageManager
    if (result.testFramework) testFramework = result.testFramework
  }

  const extCounts = countExtensions(shallowFiles)
  const sorted = [...extCounts.entries()].sort((a, b) => b[1] - a[1])
  for (const [lang] of sorted) {
    if (!languages.includes(lang)) languages.push(lang)
  }

  const unique = <T>(arr: T[]) => [...new Set(arr)]

  return {
    languages: unique(languages),
    frameworks: unique(frameworks),
    buildTools: unique(buildTools),
    packageManager,
    testFramework,
    configFiles: unique(configFiles),
  }
}

export * as ProjectScanner from "./scanner"
