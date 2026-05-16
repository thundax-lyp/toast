import type { ToastCommand, ToastCommandDefinition } from "./types.js";

export interface ToastCommandRegistry<TContext = unknown> {
  register<TPayload, TResult>(definition: ToastCommandDefinition<TContext, TPayload, TResult>): void;
  get(id: string): ToastCommandDefinition<TContext> | undefined;
  list(): ToastCommandDefinition<TContext>[];
  run<TPayload, TResult>(command: ToastCommand<TPayload>, context: TContext): TResult | Promise<TResult>;
}

export function createToastCommandRegistry<TContext = unknown>(): ToastCommandRegistry<TContext> {
  const definitions = new Map<string, ToastCommandDefinition<TContext>>();

  return {
    register(definition) {
      if (definitions.has(definition.id)) {
        throw new Error(`ToastCommand already registered: ${definition.id}`);
      }

      definitions.set(definition.id, definition as ToastCommandDefinition<TContext>);
    },

    get(id) {
      return definitions.get(id);
    },

    list() {
      return [...definitions.values()];
    },

    run<TPayload, TResult>(command: ToastCommand<TPayload>, context: TContext) {
      const definition = definitions.get(command.id);

      if (!definition) {
        throw new Error(`ToastCommand is not registered: ${command.id}`);
      }

      return definition.run({ command, context }) as TResult | Promise<TResult>;
    }
  };
}
