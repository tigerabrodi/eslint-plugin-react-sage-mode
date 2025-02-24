import { RuleTester } from "@typescript-eslint/rule-tester";
import { noInlineObject } from "../rules/no-inline-object";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("no-inline-object", noInlineObject, {
  valid: [
    {
      code: "const obj = {};", // Regular object declaration is fine
    },
    {
      code: `
        const styles = { color: 'red' };
        function Component() {
          return <div style={styles} />;
        }
      `, // Using object reference is good
    },
    {
      code: `
        const props = { id: 'test' };
        const element = <div {...props} />;
      `, // Spread operator is fine
    },
    {
      code: `
        function Component() {
          const onClick = { current: null };
          return <div ref={onClick} />;
        }
      `, // Object used outside JSX attribute value is okay
    },
  ],
  invalid: [
    {
      code: 'function Component() { return <div style={{color: "red"}} />; }',
      errors: [{ messageId: "noInlineObject" }],
    },
    {
      code: `
        function Component() {
          return <Button customStyles={{ padding: '1rem' }} />;
        }
      `,
      errors: [{ messageId: "noInlineObject" }],
    },
    {
      code: `
        const Component = () => (
          <div aria-label={{
            disabled: true,
            description: 'test'
          }} />
        );
      `,
      errors: [{ messageId: "noInlineObject" }],
    },
    {
      code: `
        function Component() {
          return (
            <div 
              style={{margin: '1rem'}}
              data-test={{id: 'test'}}
            />
          );
        }
      `,
      errors: [
        { messageId: "noInlineObject" },
        { messageId: "noInlineObject" },
      ],
    },
  ],
});
