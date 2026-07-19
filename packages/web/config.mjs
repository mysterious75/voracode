const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://voracode.ai" : `https://${stage}.voracode.ai`,
  console: stage === "production" ? "https://voracode.ai/auth" : `https://${stage}.voracode.ai/auth`,
  email: "help@anoma.ly",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/mysterious75/voracode",
  discord: "https://voracode.ai/discord",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
