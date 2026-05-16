import { describe, expect, it } from "vitest";

import { isToastPatchPath, toToastPatchPath } from "./path.js";

describe("ToastPatchPath", () => {
  it("accepts controlled document paths", () => {
    expect(isToastPatchPath("/blocks/0")).toBe(true);
    expect(isToastPatchPath("/blocks/1/attrs/title")).toBe(true);
    expect(isToastPatchPath("/blocks/2/content/rows/0/cells/1/content")).toBe(true);
  });

  it("rejects arbitrary JSON paths", () => {
    expect(isToastPatchPath("/metadata/title")).toBe(false);
    expect(isToastPatchPath("/blocks/0/children/0")).toBe(false);
    expect(() => toToastPatchPath("/blocks/0/children/0")).toThrow("Invalid ToastPatch path");
  });
});
