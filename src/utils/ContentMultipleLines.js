const ContentMultipleLines = ({ content, maxLines = null }) => {
  if (!content) return null;
  
  const lines = content.split(/\n/g);
  const displayLines = maxLines ? lines.slice(0, maxLines) : lines;
  
  return (
    <>
      {displayLines.map((line, index) => (
        <span key={index}>
          {line}
          {index < displayLines.length - 1 && <br />}
        </span>
      ))}
      {maxLines && lines.length > maxLines && (
        <span className="text-gray-500">... ({lines.length - maxLines} dòng nữa)</span>
      )}
    </>
  );
};

const CountContentLines = (content) => {
  if (!content) return 0;
  return content.split(/\n/g).length;
};

export { ContentMultipleLines, CountContentLines };
