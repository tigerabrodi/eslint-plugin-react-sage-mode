import { RuleTester } from "@typescript-eslint/rule-tester";
import { noUnmemoizedCallback } from "../rules/no-unmemoized-callback";

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

ruleTester.run("no-unmemoized-callback", noUnmemoizedCallback, {
  valid: [
    {
      code: `
        function Component() {
          const handleClick = useCallback(() => {
            console.log('clicked');
          }, []);
          return <Button onClick={handleClick} />;
        }
      `,
    },
    {
      code: `
        function Component() {
          // Regular function but passed to HTML element is fine
          function handleClick() {
            console.log('clicked');
          }
          return <button onClick={handleClick} />;
        }
      `,
    },
    {
      code: `
        function Component() {
          // Regular arrow function but passed to HTML element is fine
          const handleClick = () => console.log('clicked');
          return <div onClick={handleClick} />;
        }
      `,
    },
    {
      code: `
        function Component() {
          // Not an event handler prop
          function getValue() {
            return 42;
          }
          return <CustomComponent value={getValue()} />;
        }
      `,
    },
    {
      code: `
        function Component() {
          // Properly memoized callback
          const handleSubmit = useCallback((data) => {
            submitForm(data);
          }, []);
          
          return <Form onSubmit={handleSubmit} />;
        }
      `,
    },
    {
      code: `
        // Helper function outside component is fine
        function helperFunction() {
          return true;
        }
        
        function Component() {
          return <Button onClick={() => helperFunction()} />;
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        function Component() {
          function handleClick() {
            console.log('clicked');
          }
          return <Button onClick={handleClick} />;
        }
      `,
      errors: [{ messageId: "noUnmemoizedCallback" }],
    },
    {
      code: `
        function Component() {
          const handleChange = (e) => {
            setValue(e.target.value);
          };
          return <Input onChange={handleChange} />;
        }
      `,
      errors: [{ messageId: "noUnmemoizedCallback" }],
    },
    {
      code: `
        function Component() {
          function handleSubmit() { 
            submitForm();
          }
          
          const handleReset = () => {
            resetForm();
          };
          
          return (
            <Form 
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
          );
        }
      `,
      errors: [
        { messageId: "noUnmemoizedCallback" },
        { messageId: "noUnmemoizedCallback" },
      ],
    },
    {
      code: `
        const Component = () => {
          function handleClick() {
            console.log("clicked");
          }
          
          return <Button onClick={handleClick} />;
        };
      `,
      errors: [{ messageId: "noUnmemoizedCallback" }],
    },
  ],
});
