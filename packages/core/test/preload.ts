import path from "path"

process.env.VORACODE_DB = ":memory:"
process.env.VORACODE_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.VORACODE_DISABLE_MODELS_FETCH = "true"
