import React, { FC } from 'react';

const formatResponse = (text: string) => {

  return text
    .split(/```/g) 
    .map((block, index) => {
      if (index % 2 === 1) {
        return (
          <pre key={index} style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
            <code>{block}</code>
          </pre>
        );
      } else {
        return block.split('\n').map((line, i) => {
          if (/^#/.test(line)) {
            const level = line.match(/^#+/)[0].length; 
            const text = line.replace(/^#+/, '').trim();
            return React.createElement(
              `h${Math.min(level, 6)}`, 
              { key: `${index}-${i}` },
              text
            );
          }

          if (/\[.*?\]\(.*?\)/.test(line)) {
            return line.split(/(\[.*?\]\(.*?\))/g).map((part, j) => {
              const match = part.match(/\[(.*?)\]\((.*?)\)/);
              if (match) {
                return (
                  <a key={`${index}-${i}-${j}`} href={match[2]} target="_blank" rel="noopener noreferrer">
                    {match[1]}
                  </a>
                );
              }
              return part;
            });
          }

          if (/^[-*]\s/.test(line)) {
            return (
              <li key={`${index}-${i}`}>{line.replace(/^[-*]\s/, '').trim()}</li>
            );
          }

          return (
            <React.Fragment key={`${index}-${i}`}>
              {line}
              <br />
            </React.Fragment>
          );
        });
      }
    });
};

const AIResponse: FC<{ responseText: string }> = ({ responseText }) => {
  return (
    <div className='answer-bubble'>
      <ul>{formatResponse(responseText)}</ul>
    </div>
  );
};

export default AIResponse;