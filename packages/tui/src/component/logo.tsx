import { RGBA, TextAttributes } from "@opentui/core"
import { createSignal, For, onCleanup, onMount, type JSX } from "solid-js"
import { tint, useTheme } from "../context/theme"
import { logo } from "../logo"

const LINE_WIDTH = 35
const CHARS_PER_LINE = LINE_WIDTH * 2 + 1
const TOTAL_LINES = logo.left.length
const TOTAL_CHARS = CHARS_PER_LINE * TOTAL_LINES
const TYPING_DURATION_MS = 10_000

export function Logo() {
  const { theme } = useTheme()
  const [visibleChars, setVisibleChars] = createSignal(0)
  const [typingDone, setTypingDone] = createSignal(false)
  const [cursorOn, setCursorOn] = createSignal(true)
  const [showTyping, setShowTyping] = createSignal(true)

  onMount(() => {
    const typeInterval = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= TOTAL_CHARS) {
          clearInterval(typeInterval)
          setTypingDone(true)
          return prev
        }
        return prev + 2
      })
    }, 25)

    const cursorInterval = setInterval(() => {
      if (typingDone()) setCursorOn((v) => !v)
    }, 530)

    const timeout = setTimeout(() => {
      setShowTyping(false)
      clearInterval(typeInterval)
      clearInterval(cursorInterval)
    }, TYPING_DURATION_MS)

    onCleanup(() => {
      clearInterval(typeInterval)
      clearInterval(cursorInterval)
      clearTimeout(timeout)
    })
  })

  const renderChar = (char: string, fg: RGBA, bold: boolean, visible: boolean): JSX.Element => {
    if (!visible) return <text selectable={false}>{" "}</text>
    const shadow = tint(theme.background, fg, 0.25)
    const attrs = bold ? TextAttributes.BOLD : undefined
    if (char === "_")
      return (
        <text fg={fg} bg={shadow} attributes={attrs} selectable={false}>
          {" "}
        </text>
      )
    if (char === "^")
      return (
        <text fg={fg} bg={shadow} attributes={attrs} selectable={false}>
          ▀
        </text>
      )
    if (char === "~")
      return (
        <text fg={shadow} attributes={attrs} selectable={false}>
          ▀
        </text>
      )
    if (char === ",")
      return (
        <text fg={shadow} attributes={attrs} selectable={false}>
          ▄
        </text>
      )
    return (
      <text fg={fg} attributes={attrs} selectable={false}>
        {char}
      </text>
    )
  }

  const isCursor = (lineIdx: number, charIdx: number): boolean => {
    if (!typingDone() || !cursorOn()) return false
    const vc = visibleChars()
    const posInLine = vc % CHARS_PER_LINE
    const currentLine = Math.floor(vc / CHARS_PER_LINE)
    return lineIdx === currentLine && charIdx === posInLine
  }

  const renderStaticLine = (line: string, fg: RGBA, bold: boolean): JSX.Element[] => {
    const shadow = tint(theme.background, fg, 0.25)
    const attrs = bold ? TextAttributes.BOLD : undefined
    return Array.from(line).map((char) => {
      if (char === "_")
        return (
          <text fg={fg} bg={shadow} attributes={attrs} selectable={false}>
            {" "}
          </text>
        )
      if (char === "^")
        return (
          <text fg={fg} bg={shadow} attributes={attrs} selectable={false}>
            ▀
          </text>
        )
      if (char === "~")
        return (
          <text fg={shadow} attributes={attrs} selectable={false}>
            ▀
          </text>
        )
      if (char === ",")
        return (
          <text fg={shadow} attributes={attrs} selectable={false}>
            ▄
          </text>
        )
      return (
        <text fg={fg} attributes={attrs} selectable={false}>
          {char}
        </text>
      )
    })
  }

  if (!showTyping()) {
    return (
      <box>
        <For each={logo.left}>
          {(line, index) => (
            <box flexDirection="row" gap={1}>
              <box flexDirection="row">{renderStaticLine(line, theme.textMuted, false)}</box>
              <box flexDirection="row">{renderStaticLine(logo.right[index()], theme.text, true)}</box>
            </box>
          )}
        </For>
      </box>
    )
  }

  return (
    <box>
      <For each={logo.left}>
        {(leftLine, lineIdx) => {
          const rightLine = logo.right[lineIdx()]
          const lineOffset = lineIdx() * CHARS_PER_LINE
          return (
            <box flexDirection="row">
              <box flexDirection="row">
                <For each={Array.from(leftLine)}>
                  {(_, charIdx) => {
                    const globalIdx = lineOffset + charIdx()
                    const visible = globalIdx < visibleChars()
                    return (
                      <box flexDirection="row">
                        {renderChar(Array.from(leftLine)[charIdx()], theme.textMuted, false, visible)}
                        {isCursor(lineIdx(), charIdx()) ? (
                          <text fg={theme.text} attributes={TextAttributes.BOLD} selectable={false}>
                            ▌
                          </text>
                        ) : null}
                      </box>
                    )
                  }}
                </For>
              </box>
              <box flexDirection="row">
                <For each={Array.from(rightLine)}>
                  {(_, charIdx) => {
                    const globalIdx = lineOffset + LINE_WIDTH + 1 + charIdx()
                    const visible = globalIdx < visibleChars()
                    return (
                      <box flexDirection="row">
                        {isCursor(lineIdx(), LINE_WIDTH + 1 + charIdx()) ? (
                          <text fg={theme.text} attributes={TextAttributes.BOLD} selectable={false}>
                            ▌
                          </text>
                        ) : null}
                        {renderChar(Array.from(rightLine)[charIdx()], theme.text, true, visible)}
                      </box>
                    )
                  }}
                </For>
              </box>
            </box>
          )
        }}
      </For>
    </box>
  )
}
