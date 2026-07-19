interface ImportMetaEnv {
  readonly VORACODE_CHANNEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "virtual:voracode-server" {
  export namespace Server {
    export const listen: typeof import("../../../voracode/dist/types/src/node").Server.listen
    export type Listener = import("../../../voracode/dist/types/src/node").Server.Listener
  }
  export namespace Config {
    export const get: typeof import("../../../voracode/dist/types/src/node").Config.get
    export type Info = import("../../../voracode/dist/types/src/node").Config.Info
  }
  export const bootstrap: typeof import("../../../voracode/dist/types/src/node").bootstrap
}
