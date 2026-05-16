import type { ToastDocument } from "../block-model/types.js";
import type { ToastSelection, ToastSectionRange } from "../selection/types.js";

export type ToastContextCoverage = "selection" | "section" | "document" | "chunkSummary";

export type ToastContextChipKind = "selection" | "section" | "document" | "source" | "rule" | "history";

export interface ToastContextChip {
  id: string;
  kind: ToastContextChipKind;
  label: string;
  value?: unknown;
}

export interface ToastContextSummary {
  coverage: ToastContextCoverage;
  chips: ToastContextChip[];
  selection?: ToastSelection;
  section?: ToastSectionRange;
  documentTitle?: string;
  documentSummary?: string;
}

export interface ToastContextOptions {
  coverage: ToastContextCoverage;
  includeHistory?: boolean;
  includeSourceChips?: boolean;
  maxBlocks?: number;
}

export interface ToastContext {
  summary: ToastContextSummary;
  document?: ToastDocument;
  selectedText?: string;
  neighboringText?: {
    before?: string;
    after?: string;
  };
}
