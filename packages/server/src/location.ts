import { Location } from "@voracode-ai/core/location"
import { LocationServiceMap } from "@voracode-ai/core/location-services"
import { AbsolutePath } from "@voracode-ai/core/schema"
import { WorkspaceV2 } from "@voracode-ai/core/workspace"
import { Effect, Layer } from "effect"
import { HttpServerRequest } from "effect/unstable/http"
import { HttpApiMiddleware } from "effect/unstable/httpapi"

export type LocationServices = Layer.Success<ReturnType<(typeof LocationServiceMap.Service)["get"]>>

export class LocationMiddleware extends HttpApiMiddleware.Service<LocationMiddleware, { provides: LocationServices }>()(
  "@voracode/HttpApiLocation",
) {}

export function response<A, E, R>(data: Effect.Effect<A, E, R>) {
  return Effect.gen(function* () {
    const location = yield* Location.Service
    return {
      location: new Location.Info({
        directory: location.directory,
        workspaceID: location.workspaceID,
        project: location.project,
      }),
      data: yield* data,
    }
  })
}

function ref(request: HttpServerRequest.HttpServerRequest): Location.Ref {
  const query = new URL(request.url, "http://localhost").searchParams
  const workspaceID = query.get("location[workspace]") || request.headers["x-voracode-workspace"]
  const directory =
    query.get("location[directory]") ||
    (request.headers["x-voracode-directory"] ? decode(request.headers["x-voracode-directory"]) : process.cwd())
  
  // Validate directory path to prevent path traversal
  const normalizedDir = normalizePath(directory)
  if (!isPathSafe(normalizedDir)) {
    throw new Error("Invalid directory path: potential path traversal detected")
  }
  
  return Location.Ref.make({
    directory: AbsolutePath.make(normalizedDir),
    workspaceID: workspaceID ? WorkspaceV2.ID.make(workspaceID) : undefined,
  })
}

function decode(input: string) {
  try {
    return decodeURIComponent(input)
  } catch {
    return input
  }
}

function normalizePath(path: string): string {
  // Normalize path separators and resolve relative paths
  return path.replace(/\\/g, "/").replace(/\/+/g, "/")
}

function isPathSafe(path: string): boolean {
  // Block common system directories
  const blockedPaths = [
    "/etc",
    "/var",
    "/usr",
    "/bin",
    "/sbin",
    "/root",
    "/home",
    "C:\\Windows",
    "C:\\Program Files",
    "C:\\Users",
  ]
  
  const normalizedPath = normalizePath(path).toLowerCase()
  return !blockedPaths.some(blocked => normalizedPath.startsWith(blocked.toLowerCase()))
}

export const layer = Layer.effect(
  LocationMiddleware,
  Effect.gen(function* () {
    const locations = yield* LocationServiceMap.Service
    return LocationMiddleware.of((effect) =>
      Effect.gen(function* () {
        const request = yield* HttpServerRequest.HttpServerRequest
        return yield* effect.pipe(Effect.provide(locations.get(ref(request))))
      }),
    )
  }),
)
