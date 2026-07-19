declare global {
  const VORACODE_VERSION: string
  const VORACODE_CHANNEL: string
}

export const InstallationVersion = typeof VORACODE_VERSION === "string" ? VORACODE_VERSION : "local"
export const InstallationChannel = typeof VORACODE_CHANNEL === "string" ? VORACODE_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
