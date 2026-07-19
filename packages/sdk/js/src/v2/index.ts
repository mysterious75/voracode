export * from "./client.js"
export * from "./server.js"

import { createvoracodeClient } from "./client.js"
import { createvoracodeServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export * as data from "./data.js"

export async function createvoracode(options?: ServerOptions) {
  const server = await createvoracodeServer({
    ...options,
  })

  const client = createvoracodeClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
