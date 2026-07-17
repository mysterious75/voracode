import { getComponentCatalogue } from "@opentui/solid/components"
import { registerSpinner } from "opentui-spinner/solid"

export function registervoracodeSpinner() {
  if (!getComponentCatalogue().spinner) registerSpinner()
}
