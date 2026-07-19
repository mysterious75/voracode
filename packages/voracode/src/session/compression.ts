const DEFAULT_THRESHOLD = 50
const KEEP_HEAD = 5
const KEEP_TAIL = 10

export interface Message {
  readonly role: string
  readonly content: string
}

const ACTION_VERBS = /\b(added|removed|created|deleted|modified|updated|fixed|implemented|refactored|migrated|deployed|tested|debugged|configured|optimized|renamed|moved|copied|wrote|read|ran|executed|built|compiled|installed|patched)\b/i
const FILE_REFS = /\b[\w\-./]+\.[a-z]{1,5}\b/
const DECISION_REFS = /\b(should|will|decided|chose|selected|picked|prioritized|recommended|suggested|agreed)\b/i

function extractKeySentence(sentence: string): boolean {
  const trimmed = sentence.trim()
  if (trimmed.length < 10) return false
  if (ACTION_VERBS.test(trimmed)) return true
  if (FILE_REFS.test(trimmed)) return true
  if (DECISION_REFS.test(trimmed)) return true
  return false
}

function summarizeMessages(messages: readonly Message[]): string {
  const keyPoints: string[] = []

  for (const msg of messages) {
    const sentences = msg.content.split(/[.!?\n]+/).filter(Boolean)
    for (const sentence of sentences) {
      if (extractKeySentence(sentence)) {
        const trimmed = sentence.trim()
        if (trimmed.length > 0 && !keyPoints.includes(trimmed)) {
          keyPoints.push(trimmed)
        }
      }
    }
  }

  if (!keyPoints.length) {
    return `[Summary of ${messages.length} messages: conversation context about ${messages.map((m) => m.role).join(", ")} interactions]`
  }

  const limited = keyPoints.slice(0, 20)
  return `[Summary of ${messages.length} messages]\n${limited.map((p) => `- ${p}`).join("\n")}`
}

export function compressMessages(messages: Message[], threshold: number = DEFAULT_THRESHOLD): Message[] {
  if (messages.length <= threshold) return messages

  const head = messages.slice(0, KEEP_HEAD)
  const tail = messages.slice(-KEEP_TAIL)
  const middle = messages.slice(KEEP_HEAD, messages.length - KEEP_TAIL)

  const summary = summarizeMessages(middle)

  return [
    ...head,
    { role: "system", content: summary },
    ...tail,
  ]
}

export * as SessionCompression from "./compression"
