import { Config } from "effect"

export function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

const copy = process.env["VORACODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
const fff = process.env["VORACODE_DISABLE_FFF"]

function enabledByExperimental(key: string) {
  return process.env[key] === undefined ? truthy("VORACODE_EXPERIMENTAL") : truthy(key)
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  VORACODE_AUTO_HEAP_SNAPSHOT: truthy("VORACODE_AUTO_HEAP_SNAPSHOT"),
  VORACODE_GIT_BASH_PATH: process.env["VORACODE_GIT_BASH_PATH"],
  VORACODE_CONFIG: process.env["VORACODE_CONFIG"],
  VORACODE_CONFIG_CONTENT: process.env["VORACODE_CONFIG_CONTENT"],
  VORACODE_DISABLE_AUTOUPDATE: truthy("VORACODE_DISABLE_AUTOUPDATE"),
  VORACODE_ALWAYS_NOTIFY_UPDATE: truthy("VORACODE_ALWAYS_NOTIFY_UPDATE"),
  VORACODE_DISABLE_PRUNE: truthy("VORACODE_DISABLE_PRUNE"),
  VORACODE_DISABLE_TERMINAL_TITLE: truthy("VORACODE_DISABLE_TERMINAL_TITLE"),
  VORACODE_SHOW_TTFD: truthy("VORACODE_SHOW_TTFD"),
  VORACODE_DISABLE_AUTOCOMPACT: truthy("VORACODE_DISABLE_AUTOCOMPACT"),
  VORACODE_DISABLE_MODELS_FETCH: truthy("VORACODE_DISABLE_MODELS_FETCH"),
  VORACODE_DISABLE_MOUSE: truthy("VORACODE_DISABLE_MOUSE"),
  VORACODE_FAKE_VCS: process.env["VORACODE_FAKE_VCS"],
  VORACODE_SERVER_PASSWORD: process.env["VORACODE_SERVER_PASSWORD"],
  VORACODE_SERVER_USERNAME: process.env["VORACODE_SERVER_USERNAME"],
  VORACODE_DISABLE_FFF: fff === undefined ? process.platform === "win32" : truthy("VORACODE_DISABLE_FFF"),

  // Experimental
  VORACODE_EXPERIMENTAL_FILEWATCHER: Config.boolean("VORACODE_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  VORACODE_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("VORACODE_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  VORACODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("VORACODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  VORACODE_MODELS_URL: process.env["VORACODE_MODELS_URL"],
  VORACODE_MODELS_PATH: process.env["VORACODE_MODELS_PATH"],
  VORACODE_DB: process.env["VORACODE_DB"],

  VORACODE_WORKSPACE_ID: process.env["VORACODE_WORKSPACE_ID"],
  VORACODE_EXPERIMENTAL_WORKSPACES: enabledByExperimental("VORACODE_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get VORACODE_DISABLE_PROJECT_CONFIG() {
    return truthy("VORACODE_DISABLE_PROJECT_CONFIG")
  },
  get VORACODE_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("VORACODE_EXPERIMENTAL_REFERENCES")
  },
  get VORACODE_TUI_CONFIG() {
    return process.env["VORACODE_TUI_CONFIG"]
  },
  get VORACODE_CONFIG_DIR() {
    return process.env["VORACODE_CONFIG_DIR"]
  },
  get VORACODE_PURE() {
    return truthy("VORACODE_PURE")
  },
  get VORACODE_PERMISSION() {
    return process.env["VORACODE_PERMISSION"]
  },
  get VORACODE_PLUGIN_META_FILE() {
    return process.env["VORACODE_PLUGIN_META_FILE"]
  },
  get VORACODE_CLIENT() {
    return process.env["VORACODE_CLIENT"] ?? "cli"
  },
}
