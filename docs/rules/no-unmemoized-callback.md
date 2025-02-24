# no-unmemoized-callback

Disallow unmemoized callback functions in React components to prevent unnecessary re-renders.

## Rule Details

This rule enforces using `useCallback` for function references passed to custom React components. When you define a function inside a component and pass it directly to a child component's event handler prop, it creates a new function reference on each render. Since React's default prop comparison uses reference equality (`===`), this causes child components to re-render unnecessarily, even if the function logic hasn't changed.

### ❌ Incorrect

```jsx
function Dashboard() {
  // Function declaration without useCallback
  function handleSubmit() {
    submitForm();
  }

  // Arrow function without useCallback
  const handleReset = () => {
    resetForm();
  };

  return (
    <Form
      onSubmit={handleSubmit} // New reference every render
      onReset={handleReset} // New reference every render
    />
  );
}
```

### ✅ Correct

```jsx
function Dashboard() {
  // Properly memoized functions
  const handleSubmit = useCallback(() => {
    submitForm();
  }, []);

  const handleReset = useCallback(() => {
    resetForm();
  }, []);

  return (
    <Form
      onSubmit={handleSubmit} // Stable reference between renders
      onReset={handleReset} // Stable reference between renders
    />
  );
}
```

## When To Use It

- When performance optimization is important
- In components that render frequently
- When passing callbacks to memoized child components (`React.memo`)
- In large applications where unnecessary re-renders can accumulate
- When your component passes many callbacks to children

## When Not To Use It

- In small applications where performance isn't a concern
- When using `React.memo` with custom comparison functions
- When implementing `shouldComponentUpdate` with custom comparison logic
- During prototyping phases where performance isn't the primary focus
- When working with static/rarely updating UI elements

## How This Rule Differs from no-inline-function

This rule detects functions defined inside components but still creates new references when passed to child components. These functions may appear optimized because they're not defined inline, but they still cause re-renders because they're recreated on each render. The `no-inline-function` rule only catches direct inline functions in JSX.

## Further Reading

- [React Documentation: useCallback](https://react.dev/reference/react/useCallback)
- [Understanding Function References in React](https://dmitripavlutin.com/dont-overuse-react-usecallback/)
- [React Performance Optimization Strategies](https://kentcdodds.com/blog/usememo-and-usecallback)

## Resources

- [Rule source](https://github.com/tigerabrodi/eslint-plugin-react-sage-mode/blob/main/src/rules/no-unmemoized-callback.ts)
