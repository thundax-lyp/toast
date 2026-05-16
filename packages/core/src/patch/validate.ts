import { isToastPatchPath } from "./path.js";
import type { ToastPatchOperation, ToastPatchOperationName } from "./types.js";

const operationNames = new Set<ToastPatchOperationName>([
  "add",
  "remove",
  "replace",
  "move",
  "copy",
  "test"
]);

export interface ToastPatchValidationError {
  code: "OP_INVALID" | "PATH_INVALID" | "FROM_REQUIRED" | "FROM_INVALID";
  path: string;
  message: string;
}

export interface ToastPatchValidationResult {
  ok: boolean;
  errors: ToastPatchValidationError[];
}

export function validateToastPatchOperations(input: unknown): ToastPatchValidationResult {
  const errors: ToastPatchValidationError[] = [];

  if (!Array.isArray(input)) {
    return {
      ok: false,
      errors: [
        {
          code: "OP_INVALID",
          path: "",
          message: "ToastPatch.operations must be an array."
        }
      ]
    };
  }

  input.forEach((operation, index) => {
    const path = `/${index}`;

    if (!isRecord(operation)) {
      errors.push({
        code: "OP_INVALID",
        path,
        message: "ToastPatchOperation must be an object."
      });
      return;
    }

    if (typeof operation.op !== "string" || !operationNames.has(operation.op as ToastPatchOperationName)) {
      errors.push({
        code: "OP_INVALID",
        path: `${path}/op`,
        message: "ToastPatchOperation.op must be a JSON Patch operation name."
      });
    }

    if (typeof operation.path !== "string" || !isToastPatchPath(operation.path)) {
      errors.push({
        code: "PATH_INVALID",
        path: `${path}/path`,
        message: "ToastPatchOperation.path must target a controlled ToastDocument path."
      });
    }

    if (operation.op === "move" || operation.op === "copy") {
      if (typeof operation.from !== "string") {
        errors.push({
          code: "FROM_REQUIRED",
          path: `${path}/from`,
          message: "ToastPatchOperation.from is required for move and copy."
        });
      } else if (!isToastPatchPath(operation.from)) {
        errors.push({
          code: "FROM_INVALID",
          path: `${path}/from`,
          message: "ToastPatchOperation.from must target a controlled ToastDocument path."
        });
      }
    }
  });

  return {
    ok: errors.length === 0,
    errors
  };
}

export function assertToastPatchOperations(input: unknown): asserts input is ToastPatchOperation[] {
  const result = validateToastPatchOperations(input);

  if (!result.ok) {
    throw new Error(result.errors.map((error) => `${error.path}: ${error.message}`).join("\n"));
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
