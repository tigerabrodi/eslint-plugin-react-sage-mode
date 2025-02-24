import { noInlineFunction } from "./rules/no-inline-function";
import { noInlineObject } from "./rules/no-inline-object";

export = {
  rules: {
    "no-inline-object": noInlineObject,
    "no-inline-function": noInlineFunction,
  },
};
