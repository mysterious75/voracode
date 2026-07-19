// Patch vitefu readJson to handle Bun's fs.readFile issue
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const vitefuPath = join(
  import.meta.dirname,
  "../node_modules/.bun/vitefu@1.1.3+89d235c1cd7fff70/node_modules/vitefu/src/index.js",
)

if (existsSync(vitefuPath)) {
  let content = readFileSync(vitefuPath, "utf8")
  const oldFn = `async function readJson(findDepPkgJsonPath) {\n  return JSON.parse(await fs.readFile(findDepPkgJsonPath, 'utf8'))\n}`
  const newFn = `async function readJson(findDepPkgJsonPath) {\n  const text = typeof Bun !== 'undefined' ? await Bun.file(findDepPkgJsonPath).text() : await fs.readFile(findDepPkgJsonPath, 'utf8')\n  return JSON.parse(text)\n}`
  if (content.includes(oldFn)) {
    content = content.replace(oldFn, newFn)
    writeFileSync(vitefuPath, content, "utf8")
    console.log("Patched vitefu readJson for Bun compatibility")
  }
}
