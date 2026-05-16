import { describe, expect, it } from "vitest";

import { createToastCommandRegistry } from "./registry.js";

describe("createToastCommandRegistry", () => {
  it("runs registered commands through the registry", () => {
    const registry = createToastCommandRegistry<{ prefix: string }>();

    registry.register<{ text: string }, string>({
      id: "insertText",
      label: "Insert text",
      run({ command, context }) {
        return `${context.prefix}${command.payload.text}`;
      }
    });

    expect(
      registry.run<{ text: string }, string>(
        {
          id: "insertText",
          source: "api",
          payload: { text: "hello" }
        },
        { prefix: ">" }
      )
    ).toBe(">hello");
  });

  it("rejects duplicate command ids", () => {
    const registry = createToastCommandRegistry();

    registry.register({
      id: "bold",
      label: "Bold",
      run() {
        return undefined;
      }
    });

    expect(() =>
      registry.register({
        id: "bold",
        label: "Bold again",
        run() {
          return undefined;
        }
      })
    ).toThrow("ToastCommand already registered: bold");
  });
});
