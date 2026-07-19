import type { ColorInput } from "@opentui/core"
import { RGBA } from "@opentui/core"
import type { ColorGenerator } from "opentui-spinner"

interface LamborghiniOptions {
  width?: number
  color?: ColorInput
  trailLength?: number
  inactiveFactor?: number
}

interface CarState {
  position: number
  isMovingForward: boolean
  holdProgress: number
  isHolding: boolean
}

function getCarState(
  frameIndex: number,
  totalWidth: number,
  options: { holdStart?: number; holdEnd?: number },
): CarState {
  const holdStart = options.holdStart ?? 8
  const holdEnd = options.holdEnd ?? 4
  const moveFrames = totalWidth - 1

  const cycleLength = moveFrames + holdEnd + moveFrames + holdStart
  const cycleIndex = frameIndex % cycleLength

  if (cycleIndex < moveFrames) {
    return { position: cycleIndex, isMovingForward: true, holdProgress: 0, isHolding: false }
  } else if (cycleIndex < moveFrames + holdEnd) {
    return { position: totalWidth - 1, isMovingForward: true, holdProgress: cycleIndex - moveFrames, isHolding: true }
  } else if (cycleIndex < moveFrames + holdEnd + moveFrames) {
    const backwardIndex = cycleIndex - moveFrames - holdEnd
    return { position: totalWidth - 1 - backwardIndex, isMovingForward: false, holdProgress: 0, isHolding: false }
  } else {
    return { position: 0, isMovingForward: false, holdProgress: 0, isHolding: true }
  }
}

const CAR_BODY = "▄▄▄"
const CAR_TOP = "█▀▀"
const CAR_WHEELS = "●  ●"
const CAR_FULL = "▄▄▄█▀▀"
const TRAIL_CHAR = "·"
const EMPTY_CHAR = " "

export function createLamborghiniFrames(options: LamborghiniOptions = {}): string[] {
  const width = options.width ?? 20
  const holdStart = 8
  const holdEnd = 4

  const moveFrames = width - 1
  const totalFrames = moveFrames + holdEnd + moveFrames + holdStart

  return Array.from({ length: totalFrames }, (_, frameIndex) => {
    const state = getCarState(frameIndex, width, { holdStart, holdEnd })
    const pos = state.position

    const chars: string[] = []
    for (let i = 0; i < width; i++) {
      if (i === pos) {
        chars.push(CAR_FULL)
      } else if (state.isMovingForward && i < pos && i >= Math.max(0, pos - 3)) {
        const dist = pos - i
        chars.push(dist === 1 ? "▓" : dist === 2 ? "▒" : TRAIL_CHAR)
      } else if (!state.isMovingForward && i > pos && i <= Math.min(width - 1, pos + 3)) {
        const dist = i - pos
        chars.push(dist === 1 ? "▓" : dist === 2 ? "▒" : TRAIL_CHAR)
      } else {
        chars.push(EMPTY_CHAR)
      }
    }
    return chars.join("")
  })
}

export function createLamborghiniColors(options: LamborghiniOptions = {}): ColorGenerator {
  const width = options.width ?? 20
  const holdStart = 8
  const holdEnd = 4
  const trailLength = options.trailLength ?? 3

  const carColor = options.color
    ? options.color instanceof RGBA
      ? options.color
      : RGBA.fromHex(options.color as string)
    : RGBA.fromHex("#1a1a1a")

  const trailColor = RGBA.fromHex("#444444")
  const dimTrail = RGBA.fromHex("#222222")
  const inactiveColor = RGBA.fromHex("#111111")

  return (frameIndex: number, charIndex: number, _totalFrames: number, totalChars: number) => {
    const state = getCarState(frameIndex, totalChars, { holdStart, holdEnd })
    const pos = state.position

    if (charIndex === pos) {
      return carColor
    }

    if (state.isMovingForward && charIndex < pos && charIndex >= Math.max(0, pos - trailLength)) {
      const dist = pos - charIndex
      if (dist === 1) return trailColor
      if (dist === 2) return dimTrail
      return inactiveColor
    }

    if (!state.isMovingForward && charIndex > pos && charIndex <= Math.min(totalChars - 1, pos + trailLength)) {
      const dist = charIndex - pos
      if (dist === 1) return trailColor
      if (dist === 2) return dimTrail
      return inactiveColor
    }

    return inactiveColor
  }
}
