export interface ToastDocument {
  version: string;
  blocks: ToastBlock[];
  metadata?: Record<string, unknown>;
}

export type ToastBlockType =
  | "paragraph"
  | "heading"
  | "listItem"
  | "quote"
  | "code"
  | "table"
  | "image"
  | "divider"
  | "callout"
  | (string & {});

export interface ToastBlock {
  id: string;
  type: ToastBlockType;
  attrs?: Record<string, unknown>;
  content?: ToastInlineContent[] | ToastTableContent | ToastMediaContent;
}

export interface ToastTextContent {
  type: "text";
  text: string;
  marks?: ToastMark[];
}

export interface ToastInlineNodeContent {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ToastInlineContent[];
}

export type ToastInlineContent = ToastTextContent | ToastInlineNodeContent;

export interface ToastMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface ToastTableContent {
  rows: ToastTableRow[];
}

export interface ToastTableRow {
  id: string;
  cells: ToastTableCell[];
}

export interface ToastTableCell {
  id: string;
  colspan?: number;
  rowspan?: number;
  attrs?: Record<string, unknown>;
  content: ToastInlineContent[];
}

export interface ToastMediaContent {
  src: string;
  alt?: string;
  title?: string;
  assetId?: string;
  metadata?: Record<string, unknown>;
}
