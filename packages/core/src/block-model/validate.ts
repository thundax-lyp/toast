import type { ToastDocument } from "./types.js";

export interface ToastDocumentValidationError {
  code: "DOCUMENT_INVALID" | "BLOCK_INVALID" | "BLOCK_CHILDREN_FORBIDDEN";
  path: string;
  message: string;
}

export interface ToastDocumentValidationResult {
  ok: boolean;
  errors: ToastDocumentValidationError[];
}

export function validateToastDocument(input: unknown): ToastDocumentValidationResult {
  const errors: ToastDocumentValidationError[] = [];

  if (!isRecord(input)) {
    return {
      ok: false,
      errors: [
        {
          code: "DOCUMENT_INVALID",
          path: "",
          message: "ToastDocument must be an object."
        }
      ]
    };
  }

  if (typeof input.version !== "string" || input.version.length === 0) {
    errors.push({
      code: "DOCUMENT_INVALID",
      path: "/version",
      message: "ToastDocument.version must be a non-empty string."
    });
  }

  if (!Array.isArray(input.blocks)) {
    errors.push({
      code: "DOCUMENT_INVALID",
      path: "/blocks",
      message: "ToastDocument.blocks must be an array."
    });
  } else {
    input.blocks.forEach((block, index) => {
      const path = `/blocks/${index}`;

      if (!isRecord(block)) {
        errors.push({
          code: "BLOCK_INVALID",
          path,
          message: "ToastBlock must be an object."
        });
        return;
      }

      if (typeof block.id !== "string" || block.id.length === 0) {
        errors.push({
          code: "BLOCK_INVALID",
          path: `${path}/id`,
          message: "ToastBlock.id must be a non-empty string."
        });
      }

      if (typeof block.type !== "string" || block.type.length === 0) {
        errors.push({
          code: "BLOCK_INVALID",
          path: `${path}/type`,
          message: "ToastBlock.type must be a non-empty string."
        });
      }

      if (Object.hasOwn(block, "children")) {
        errors.push({
          code: "BLOCK_CHILDREN_FORBIDDEN",
          path: `${path}/children`,
          message: "ToastBlock.children is forbidden; use a linear block list."
        });
      }
    });
  }

  return {
    ok: errors.length === 0,
    errors
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function assertToastDocument(input: unknown): asserts input is ToastDocument {
  const result = validateToastDocument(input);

  if (!result.ok) {
    throw new Error(result.errors.map((error) => `${error.path}: ${error.message}`).join("\n"));
  }
}
