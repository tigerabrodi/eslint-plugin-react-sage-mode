# no-inline-function

Disallow inline function creation in React components to prevent unnecessary re-renders.

## Rule Details

This rule enforces moving function creation outside of JSX attributes to prevent unnecessary re-renders. In React, every time a component renders and encounters an inline function (`() => {}`), a new function reference is created. Since React's default prop comparison uses reference equality (`===`), this causes child components to re-render even if the function logic hasn't changed.

### ❌ Incorrect

```jsx
function Counter() {
  return (
    <Button
      onClick={() => console.log("clicked")} // New function created every render
      onHover={() => setIsHovered(true)} // Another new function every render
    />
  );
}
```

### ✅ Correct

```jsx
function Counter() {
  const handleClick = useCallback(() => console.log("clicked"), []);
  const handleHover = useCallback(() => setIsHovered(true), []);

  return (
    <Button
      onClick={handleClick} // Same function reference between renders
      onHover={handleHover} // Same function reference between renders
    />
  );
}
```

## When To Use It

- When performance optimization is important
- In components that render frequently
- When passing callbacks to memoized child components
- In large applications where unnecessary re-renders can accumulate

## When Not To Use It

- In small applications where performance isn't a concern
- When using `React.memo` with custom comparison
- When implementing `shouldComponentUpdate` with custom comparison logic
- During prototyping phases where performance isn't the primary focus
- When the function truly needs access to render-scoped variables

## Further Reading

- [React Documentation: Event Handling](https://react.dev/learn/responding-to-events)
- [Understanding React's useCallback](https://react.dev/reference/react/useCallback)
- [React Re-renders Guide](https://www.joshwcomeau.com/react/why-react-re-renders/)

## Resources

- [Rule source](https://github.com/tigerabrodi/eslint-plugin-react-sage-mode/blob/main/src/rules/no-inline-function.ts)
