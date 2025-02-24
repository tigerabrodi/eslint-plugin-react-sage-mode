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
          return <Button style={styles} />;
        }
      `, // Using object reference with component is good
    },
    {
      code: `
        function Component() {
          return <div style={{color: "red"}} />;
        }
      `, // Inline object on HTML element is allowed
    },
    {
      code: `
        function Component() {
          return <span data-config={{enabled: true}} />;
        }
      `, // Inline object on HTML element is allowed
    },
    {
      code: `
        const props = { id: 'test' };
        const element = <Button {...props} />;
      `, // Spread operator is fine
    },
    {
      code: `
        function Component() {
          return <input value={{}} onChange={() => {}} />;
        }
      `, // HTML elements with inline objects are fine
    },
  ],
  invalid: [
    {
      code: `
        function Component() {
          return <Button style={{color: "red"}} />;
        }
      `,
      errors: [{ messageId: "noInlineObject" }],
    },
    {
      code: `
        function Component() {
          return <CustomInput config={{ enabled: true }} />;
        }
      `,
      errors: [{ messageId: "noInlineObject" }],
    },
    {
      code: `
        const Component = () => (
          <Modal options={{
            closable: true,
            width: 500
          }} />
        );
      `,
      errors: [{ messageId: "noInlineObject" }],
    },
    {
      code: `
        function Component() {
          return (
            <Form 
              layout={{type: 'horizontal'}}
              validation={{required: true}}
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
