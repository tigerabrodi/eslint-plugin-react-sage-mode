import { ESLintUtils } from "@typescript-eslint/utils";
import { isCustomComponent, isEventProp } from "../lib/utils";

export const noUnmemoizedCallback = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/tigerabrodi/eslint-plugin-react-sage-mode/blob/main/docs/rules/${name}.md`
)({
  name: "no-unmemoized-callback",
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow unmemoized callbacks in React components",
    },
    messages: {
      noUnmemoizedCallback:
        "Avoid creating unmemoized callbacks in React components. Why? Every render creates a new function reference, causing child components to rerender unnecessarily. Consider putting it inside a useCallback.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Track function definitions and whether they're memoized
    // This tracks it for each component at a time
    const functionMap = new Map();

    return {
      FunctionDeclaration(node) {
        if (!node.id) return;

        // When entering a component (function declaration)
        if (isCustomComponent(node.id.name)) {
          functionMap.clear();
        } else {
          // Encounter a function declaration that is not a component
          // TODO: ensure its inside a component
          functionMap.set(node.id.name, false);
        }
      },

      // Track variable declarations with functions
      VariableDeclarator(node) {
        if (!node.init) return;

        // Is entire expression an arrow function?
        if (
          node.init.type === "ArrowFunctionExpression" &&
          node.id.type === "Identifier"
        ) {
          functionMap.set(node.id.name, false);
          return;
        }

        // Is it a useCallback expression?
        if (
          node.init.type === "CallExpression" &&
          node.init.callee.type === "Identifier" &&
          node.init.callee.name === "useCallback" &&
          node.id.type === "Identifier"
        ) {
          functionMap.set(node.id.name, true);
          return;
        }
      },

      // Check for unmemoized callbacks in JSX
      JSXAttribute(node) {
        // Only check custom components (uppercase)
        const parentElement = node.parent;
        const componentName =
          parentElement.name.type === "JSXIdentifier"
            ? parentElement.name.name
            : null;
        if (!componentName || !isCustomComponent(componentName)) return;

        // Only check event handler props (typically start with "on")
        const propName =
          node.name.type === "JSXIdentifier" ? node.name.name : null;
        if (!propName || !isEventProp(propName)) return;

        // Check if passing an identifier reference
        if (
          node.value?.type === "JSXExpressionContainer" &&
          node.value.expression.type === "Identifier"
        ) {
          const funcName = node.value.expression.name;

          // Check our tracking map
          if (functionMap.has(funcName) && !functionMap.get(funcName)) {
            context.report({
              node: node.value.expression,
              messageId: "noUnmemoizedCallback",
            });
          }
        }
      },
    };
  },
});
