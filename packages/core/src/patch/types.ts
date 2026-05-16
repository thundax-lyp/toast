import type { ToastPatchPath } from "./path.js";

export type ToastPatchOperationName = "add" | "remove" | "replace" | "move" | "copy" | "test";

export interface ToastPatchOperation {
  op: ToastPatchOperationName;
  path: ToastPatchPath;
  from?: ToastPatchPath;
  value?: unknown;
}

export type ToastPatchState = "preview" | "accepted" | "rejected" | "rolledBack";

export interface ToastPatchSnapshot {
  documentVersion: string;
  blockIds: string[];
  checksum?: string;
}

export interface ToastPatchModelMetadata {
  provider?: string;
  model?: string;
  requestId?: string;
}

export interface ToastPatch {
  id: string;
  actionId: string;
  scope: string;
  operations: ToastPatchOperation[];
  before: ToastPatchSnapshot;
  after: ToastPatchSnapshot;
  actor: "user" | "ai" | "system";
  state: ToastPatchState;
  contextChips: string[];
  operationId: string;
  modelMetadata?: ToastPatchModelMetadata;
}
