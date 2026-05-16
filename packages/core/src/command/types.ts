export type ToastCommandSource = "toolbar" | "bubbleMenu" | "slashMenu" | "blockMenu" | "api" | "ai";

export interface ToastCommand<TPayload = unknown> {
  id: string;
  source: ToastCommandSource;
  payload: TPayload;
}

export interface ToastCommandDefinition<TContext = unknown, TPayload = unknown, TResult = unknown> {
  id: string;
  label: string;
  run(input: ToastCommandRunInput<TContext, TPayload>): TResult | Promise<TResult>;
}

export interface ToastCommandRunInput<TContext = unknown, TPayload = unknown> {
  command: ToastCommand<TPayload>;
  context: TContext;
}
