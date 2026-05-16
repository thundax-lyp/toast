import type { ToastDocument } from "../block-model/types.js";

export interface ToastCheckpointInput {
  reason: string;
  operationId?: string;
}

export interface ToastCheckpoint {
  id: string;
  reason: string;
  document: ToastDocument;
  createdAt: string;
  operationId?: string;
}
