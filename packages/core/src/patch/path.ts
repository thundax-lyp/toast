export type ToastPatchPath = string & {
  readonly __toastPatchPath: unique symbol;
};

const toastPatchPathPatterns = [
  /^\/blocks\/\d+$/,
  /^\/blocks\/\d+\/attrs$/,
  /^\/blocks\/\d+\/attrs\/[^/]+$/,
  /^\/blocks\/\d+\/content$/,
  /^\/blocks\/\d+\/content\/\d+$/,
  /^\/blocks\/\d+\/content\/rows\/\d+$/,
  /^\/blocks\/\d+\/content\/rows\/\d+\/cells\/\d+$/,
  /^\/blocks\/\d+\/content\/rows\/\d+\/cells\/\d+\/attrs$/,
  /^\/blocks\/\d+\/content\/rows\/\d+\/cells\/\d+\/attrs\/[^/]+$/,
  /^\/blocks\/\d+\/content\/rows\/\d+\/cells\/\d+\/content$/,
  /^\/blocks\/\d+\/content\/rows\/\d+\/cells\/\d+\/content\/\d+$/
];

export function isToastPatchPath(path: string): path is ToastPatchPath {
  return toastPatchPathPatterns.some((pattern) => pattern.test(path));
}

export function toToastPatchPath(path: string): ToastPatchPath {
  if (!isToastPatchPath(path)) {
    throw new Error(`Invalid ToastPatch path: ${path}`);
  }

  return path;
}
