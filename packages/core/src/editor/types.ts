import type { ToastDocument } from "../block-model/types.js";
import type { ToastCheckpoint, ToastCheckpointInput } from "../checkpoint/types.js";
import type { ToastCommand } from "../command/types.js";
import type { ToastContext, ToastContextOptions } from "../context/types.js";
import type { ToastPatch } from "../patch/types.js";
import type { ToastAIInput, ToastAskResult, ToastSuggestion } from "../ai-output/types.js";
import type { ToastSelection } from "../selection/types.js";

export interface ToastEditor {
  getDocument(): ToastDocument;
  setDocument(document: ToastDocument): void;

  getSelection(): ToastSelection;
  getContext(options: ToastContextOptions): ToastContext;

  runCommand(command: ToastCommand): void;

  ask(input: ToastAIInput): Promise<ToastAskResult>;
  suggest(input: ToastAIInput): Promise<ToastSuggestion[]>;
  proposePatch(input: ToastAIInput): Promise<ToastPatch>;

  applyPatch(patch: ToastPatch): void;
  rejectPatch(patchId: string): void;
  rollbackPatch(patchId: string): void;

  createCheckpoint(input: ToastCheckpointInput): ToastCheckpoint;
  restoreCheckpoint(checkpointId: string): void;
}
