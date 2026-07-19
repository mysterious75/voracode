import { run as runTui, type TuiInput } from "@voracode-ai/tui"
import { Global } from "@voracode-ai/core/global"
import { AppNodeBuilder } from "@voracode-ai/core/effect/app-node-builder"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(AppNodeBuilder.build(Global.node)))
}
