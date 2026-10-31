/** Renders a name and allows a line break after "/" (for example "Diabetologist/Endocrinologist"). */
export function BreakableName({ name }: { name: string }) {
  return (
    <>
      {name.split("/").map((part, i) => (
        <span key={i}>
          {i > 0 ? (
            <>
              /<wbr />
            </>
          ) : null}
          {part}
        </span>
      ))}
    </>
  );
}
