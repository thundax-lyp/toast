import type { ToastBlock } from "../block-model/types.js";

export type ToastSelectionKind = "cursor" | "inline" | "block" | "blockRange";

export interface ToastInlineRange {
  blockId: string;
  from: number;
  to: number;
}

export interface ToastBlockRange {
  fromBlockId: string;
  toBlockId: string;
}

export interface ToastSectionRange {
  headingBlockId: string;
  level: number;
  fromBlockId: string;
  toBlockId: string;
  title: string;
}

export interface ToastSelection {
  kind: ToastSelectionKind;
  anchorBlockId: string;
  focusBlockId: string;
  inlineRange?: ToastInlineRange;
  blockRange?: ToastBlockRange;
  selectedText?: string;
  selectedBlocks?: ToastBlock[];
  section?: ToastSectionRange;
}
