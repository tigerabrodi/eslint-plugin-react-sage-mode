import { noInlineFunction } from "./rules/no-inline-function";
import { noInlineObject } from "./rules/no-inline-object";
import { noUnmemoizedCallback } from "./rules/no-unmemoized-callback";
export = {
  rules: {
    "no-inline-object": noInlineObject,
    "no-inline-function": noInlineFunction,
    "no-unmemoized-callback": noUnmemoizedCallback,
  },
};
