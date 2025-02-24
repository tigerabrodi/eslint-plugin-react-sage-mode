import { ESLintUtils } from "@typescript-eslint/utils";
import { isCustomComponent } from "../lib/utils";

export const noInlineFunction = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/tigerabrodi/eslint-plugin-react-sage-mode/blob/main/docs/rules/${name}.md`
)({
  name: "no-inline-function",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow inline function creation in React components",
    },
    messages: {
      noInlineFunction:
        "Avoid creating inline functions in React components. Why? Every render creates a new function reference, causing child components to rerender unnecessarily. Consider moving it outside the JSX and put it inside a useCallback.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        const tagName =
          node.name.type === "JSXIdentifier" ? node.name.name : null;
        if (!tagName || !isCustomComponent(tagName)) {
          return;
        }

        // Check all attributes
        for (const attribute of node.attributes) {
          if (
            attribute.type === "JSXAttribute" &&
            attribute.value?.type === "JSXExpressionContainer" &&
            (attribute.value.expression.type === "ArrowFunctionExpression" ||
              attribute.value.expression.type === "FunctionExpression")
          ) {
            context.report({
              node: attribute.value.expression,
              messageId: "noInlineFunction",
            });
          }
        }
      },
    };
  },
});
