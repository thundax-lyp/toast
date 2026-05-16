import { describe, expect, it } from "vitest";

import { validateToastDocument } from "./validate.js";

describe("validateToastDocument", () => {
  it("accepts a linear block document", () => {
    const result = validateToastDocument({
      version: "1",
      blocks: [
        { id: "b1", type: "heading", attrs: { level: 1 } },
        { id: "b2", type: "paragraph", content: [{ type: "text", text: "Hello" }] }
      ]
    });

    expect(result).toEqual({ ok: true, errors: [] });
  });

  it("rejects physical block children", () => {
    const result = validateToastDocument({
      version: "1",
      blocks: [
        {
          id: "b1",
          type: "heading",
          children: [{ id: "b2", type: "paragraph" }]
        }
      ]
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContainEqual({
      code: "BLOCK_CHILDREN_FORBIDDEN",
      path: "/blocks/0/children",
      message: "ToastBlock.children is forbidden; use a linear block list."
    });
  });
});
