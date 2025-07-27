import { customAlphabet } from "nanoid";

const prefixes = {};

export function generateId(
  prefixOrOptions,
  inputOptions = {},
) {
  const finalOptions =
    typeof prefixOrOptions === "object" ? prefixOrOptions : inputOptions;

  const prefix =
    typeof prefixOrOptions === "object" ? undefined : prefixOrOptions;

  const { length = 12, separator = "_" } = finalOptions;
  const id = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", length)();

  return prefix ? `${prefixes[prefix]}${separator}${id}` : id;
}
