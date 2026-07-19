import { Context } from "effect"
import type { InstanceContext } from "@/project/instance-context"
import type { WorkspaceV2 } from "@voracode-ai/core/workspace"

export const InstanceRef = Context.Reference<InstanceContext | undefined>("~voracode/InstanceRef", {
  defaultValue: () => undefined,
})

export const WorkspaceRef = Context.Reference<WorkspaceV2.ID | undefined>("~voracode/WorkspaceRef", {
  defaultValue: () => undefined,
})
