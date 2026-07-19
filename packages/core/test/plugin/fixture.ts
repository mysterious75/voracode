import { AgentV2 } from "@voracode-ai/core/agent"
import { AISDK } from "@voracode-ai/core/aisdk"
import { Catalog } from "@voracode-ai/core/catalog"
import { CommandV2 } from "@voracode-ai/core/command"
import { Credential } from "@voracode-ai/core/credential"
import { AppNodeBuilder } from "@voracode-ai/core/effect/app-node-builder"
import { LayerNodePlatform } from "@voracode-ai/core/effect/app-node-platform"
import { LayerNode } from "@voracode-ai/core/effect/layer-node"
import { EventV2 } from "@voracode-ai/core/event"
import { FileSystem } from "@voracode-ai/core/filesystem"
import { FSUtil } from "@voracode-ai/core/fs-util"
import { Integration } from "@voracode-ai/core/integration"
import { Location } from "@voracode-ai/core/location"
import { Npm } from "@voracode-ai/core/npm"
import { PluginV2 } from "@voracode-ai/core/plugin"
import { Reference } from "@voracode-ai/core/reference"
import { SkillV2 } from "@voracode-ai/core/skill"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: () => Effect.succeed({ directory: "", entrypoint: undefined }),
    install: () => Effect.void,
    which: () => Effect.succeed(undefined),
  }),
)

export const PluginTestLayer = AppNodeBuilder.build(
  LayerNode.group([
    FileSystem.node,
    FSUtil.node,
    Location.node,
    Npm.node,
    Credential.node,
    EventV2.node,
    LayerNodePlatform.httpClient,
    PluginV2.node,
    AgentV2.node,
    AISDK.node,
    Catalog.node,
    CommandV2.node,
    Integration.node,
    Reference.node,
    SkillV2.node,
  ]),
  [
    [Location.node, tempLocationLayer],
    [Npm.node, npmLayer],
  ],
)
