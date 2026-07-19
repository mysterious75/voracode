import { $ } from "bun"

await $`bun ./scripts/copy-icons.ts ${process.env.VORACODE_CHANNEL ?? "dev"}`

await $`cd ../voracode && bun script/build-node.ts`
