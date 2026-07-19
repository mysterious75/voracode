import { Effect } from "effect"
import { effectCmd } from "../effect-cmd"
import { withNetworkOptions, resolveNetworkOptions } from "../network"
import { Flag } from "@voracode-ai/core/flag/flag"

export const ServeCommand = effectCmd({
  command: "serve",
  builder: (yargs) => withNetworkOptions(yargs).option("allow-unauthenticated", {
    type: "boolean",
    default: false,
    describe: "Allow server to start without authentication",
  }),
  describe: "starts a headless voracode server",
  // Server loads instances per-request via x-voracode-directory header â€” no
  // need for an ambient project InstanceContext at startup.
  instance: false,
  handler: Effect.fn("Cli.serve")(function* (args) {
    const { Server } = yield* Effect.promise(() => import("../../server/server"))
    if (!Flag.VORACODE_SERVER_PASSWORD) {
      console.error("ERROR: VORACODE_SERVER_PASSWORD is not set. Server is unsecured.")
      console.error("Set VORACODE_SERVER_PASSWORD environment variable or use --allow-unauthenticated flag.")
      if (!args.allowUnauthenticated) {
        process.exit(1)
      }
    }
    const opts = yield* resolveNetworkOptions(args)
    const server = yield* Effect.promise(() => Server.listen(opts))
    console.log(`voracode server listening on http://${server.hostname}:${server.port}`)

    yield* Effect.never
  }),
})
