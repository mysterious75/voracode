/// <reference path="../markdown.d.ts" />

export * as SkillPlugin from "./skill"

import { define } from "./internal"
import { Effect } from "effect"
import { AbsolutePath } from "../schema"
import { SkillV2 } from "../skill"
import customizevoracodeContent from "./skill/customize-voracode.md" with { type: "text" }

export const CustomizevoracodeContent = customizevoracodeContent

export const Plugin = define({
  id: "skill",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.skill.transform((draft) => {
      draft.source(
        SkillV2.EmbeddedSource.make({
          type: "embedded",
          skill: SkillV2.Info.make({
            name: "customize-voracode",
            description:
              "Use ONLY when the user is editing or creating voracode's own configuration: voracode.json, voracode.jsonc, files under .voracode/, or files under ~/.config/voracode/. Also use when creating or fixing voracode agents, subagents, commands, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring voracode itself.",
            location: AbsolutePath.make("/builtin/customize-voracode.md"),
            content: CustomizevoracodeContent,
          }),
        }),
      )
    })
  }),
})
