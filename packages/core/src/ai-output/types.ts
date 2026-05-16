import type { ToastBlock, ToastInlineContent } from "../block-model/types.js";
import type { ToastContextOptions, ToastContextSummary } from "../context/types.js";
import type { ToastPatch } from "../patch/types.js";
import type { ToastBlockRange, ToastInlineRange, ToastSelection } from "../selection/types.js";

export type ToastScope = "cursor" | "selection" | "block" | "section" | "document";

export interface ToastAIInput {
  prompt: string;
  scope: ToastScope;
  selection?: ToastSelection;
  contextOptions?: ToastContextOptions;
  contextChips?: string[];
}

export interface ToastAskAction {
  id: string;
  label: string;
  kind: "insert" | "replace" | "proposePatch";
}

export interface ToastAskResult {
  id: string;
  scope: ToastScope;
  answer: string;
  context: ToastContextSummary;
  actions?: ToastAskAction[];
}

export type ToastSuggestionKind = "grammar" | "clarity" | "tone" | "rewrite";

export type ToastSuggestionState = "pending" | "accepted" | "dismissed";

export interface ToastSuggestion {
  id: string;
  range: ToastInlineRange | ToastBlockRange;
  kind: ToastSuggestionKind;
  replacement: ToastInlineContent[] | ToastBlock[];
  explanation?: string;
  state: ToastSuggestionState;
}

export interface ToastPatchProposal {
  patch: ToastPatch;
  context: ToastContextSummary;
}
