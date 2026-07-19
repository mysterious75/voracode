import { describe, expect, test } from "bun:test"
import { hasExistingAppState } from "./install-state"

const file = (name: string) => ({ name, isDirectory: () => false })
const directory = (name: string) => ({ name, isDirectory: () => true })

describe("hasExistingAppState", () => {
  test("ignores files Electron may create on a fresh install", () => {
    expect(hasExistingAppState([])).toBe(false)
    expect(hasExistingAppState([file("Local State"), directory("Crashpad")])).toBe(false)
  })

  test("recognizes state written by an earlier Voracode launch", () => {
    expect(hasExistingAppState([file("voracode.settings")])).toBe(true)
    expect(hasExistingAppState([file("voracode.global.dat")])).toBe(true)
    expect(hasExistingAppState([file("window-state-abc.json")])).toBe(true)
    expect(hasExistingAppState([directory("voracode")])).toBe(true)
  })
})
