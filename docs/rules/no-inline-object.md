# no-inline-object

Disallow inline object creation in React components to prevent unnecessary re-renders.

## Rule Details

This rule enforces moving object creation outside of JSX attributes to prevent unnecessary re-renders. In React, every time a component renders and encounters an inline object (`{}`), a new object reference is created. Since React's default prop comparison uses reference equality (`===`), this causes child components to re-render even if the values inside the object haven't changed.

### ❌ Incorrect

```jsx
function Counter() {
  return (
    <Button
      style={{ margin: "1rem" }} // New object created every render
      config={{ color: "red" }} // Another new object every render
    />
  );
}
```

### ✅ Correct

```jsx
const buttonStyle = { margin: "1rem" };
const buttonConfig = { color: "red" };

function Counter() {
  return (
    <Button
      style={buttonStyle} // Same object reference between renders
      config={buttonConfig} // Same object reference between renders
    />
  );
}
```

## When To Use It

- When performance optimization is important
- In components that render frequently
- When passing objects to memoized child components
- In large applications where unnecessary re-renders can accumulate

## When Not To Use It

- In small applications where performance isn't a concern
- When using `React.memo` with custom comparison
- When implementing `shouldComponentUpdate` with custom comparison logic
- During prototyping phases where performance isn't the primary focus

## Further Reading

- [React Documentation: Optimizing Performance](https://react.dev/learn/render-and-commit)
- [Understanding JavaScript References](https://daveceddia.com/javascript-references/)
- [React Re-renders Guide](https://www.joshwcomeau.com/react/why-react-re-renders/)

## Resources

- [Rule source](https://github.com/tigerabrodi/eslint-plugin-react-sage-mode/blob/main/src/rules/no-inline-object.ts)
