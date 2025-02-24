import { ESLintUtils } from "@typescript-eslint/utils";
import { isCustomComponent } from "../lib/utils";

export const noInlineObject = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/tigerabrodi/eslint-plugin-react-sage-mode/blob/main/docs/rules/${name}.md`
)({
  name: "no-inline-object",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow inline object creation in React components",
    },
    messages: {
      noInlineObject:
        "Avoid creating inline objects in React components. Why? Every time the parent renders, a new object is created with {}. Even if the values inside are the same, the object reference changes. React's default prop comparison uses reference equality (===), so it sees this as a prop change and rerenders the child.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXOpeningElement(node) {
        // Skip HTML elements, only check components (uppercase names)
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
            attribute.value.expression.type === "ObjectExpression"
          ) {
            context.report({
              node: attribute.value.expression,
              messageId: "noInlineObject",
            });
          }
        }
      },
    };
  },
});
