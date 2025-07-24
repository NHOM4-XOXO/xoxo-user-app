const ContentMultipleLines = (content) => {
  return content.split(/\n/g).map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));
};

const CountContentLines = (content) => {
  return content.split(/\n/g).length;
};

export { ContentMultipleLines, CountContentLines };
