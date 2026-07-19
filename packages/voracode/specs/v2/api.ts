// @ts-nocheck

import { Voracode } from "@voracode-ai/core"
import { ReadTool } from "@voracode-ai/core/tools"

const voracode = Voracode.make({})

voracode.tool.add(ReadTool)

voracode.tool.add({
  name: "bash",
  schema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The command to run.",
      },
    },
    required: ["command"],
  },
  execute(input, ctx) {},
})

voracode.auth.add({
  provider: "openai",
  type: "api",
  value: process.env.OPENAI_API_KEY,
})

voracode.agent.add({
  name: "build",
  permissions: [],
  model: {
    id: "gpt-5-5",
    provider: "openai",
    variant: "xhigh",
  },
})

const sessionID = await voracode.session.create({
  agent: "build",
})

voracode.subscribe((event) => {
  console.log(event)
})

await voracode.session.prompt({
  sessionID,
  text: "hey what is up",
})

await voracode.session.prompt({
  sessionID,
  text: "what is up with this",
  files: [
    {
      mime: "image/png",
      uri: "data:image/png;base64,xxxx",
    },
  ],
})

await voracode.session.wait()

console.log(await voracode.session.messages(sessionID))
