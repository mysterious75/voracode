/**
 * VORACODE EVOLVE — Self-Learning AI Coding System
 *
 * This is the main entry point for the Evolve engine.
 * It orchestrates all sub-systems: memory, conventions, feedback,
 * reflection, skills, and adaptive context.
 */

export { Memory, type MemoryEntry, type MemoryCategory } from "./memory"
export { Conventions, type ProjectConventions } from "./conventions"
export { Feedback, type FeedbackSignal, type SignalType } from "./feedback"
export { Reflection, type ReflectionEntry } from "./reflection"
export { SkillLibrary, type Skill } from "./skills"
export { GitLearning } from "./git-learning"
export { AdaptiveContext, type ContextStrategy } from "./adaptive-context"
export { Consolidator } from "./consolidation"
export { EvolveEngine } from "./engine"
