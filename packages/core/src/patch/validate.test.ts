import { describe, expect, it } from "vitest";

import { toToastPatchPath } from "./path.js";
import { validateToastPatchOperations } from "./validate.js";

describe("validateToastPatchOperations", () => {
  it("accepts JSON Patch operations on controlled paths", () => {
    const result = validateToastPatchOperations([
      {
        op: "replace",
        path: toToastPatchPath("/blocks/0/content"),
        value: [{ type: "text", text: "Updated" }]
      }
    ]);

    expect(result).toEqual({ ok: true, errors: [] });
  });

  it("requires from for move operations", () => {
    const result = validateToastPatchOperations([
      {
        op: "move",
        path: "/blocks/1"
      }
    ]);

    expect(result.ok).toBe(false);
    expect(result.errors).toContainEqual({
      code: "FROM_REQUIRED",
      path: "/0/from",
      message: "ToastPatchOperation.from is required for move and copy."
    });
  });
});
