export default function PassMD({ markdown }: { markdown: string }) {
    return (
      <div>
        <h2>Markdown Preview</h2>
        <pre>{markdown}</pre>
      </div>
    );
  }
  