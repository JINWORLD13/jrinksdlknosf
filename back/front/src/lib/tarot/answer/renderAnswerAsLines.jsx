import React from 'react';
import { Capacitor } from '@capacitor/core';

// HTML 태그를 파싱하여 React 요소로 변환하는 헬퍼 함수
const parseHtmlTags = (text, strongColor = '#ffd700') => {
  const result = [];
  let currentIndex = 0;

  // 색상에 따른 text-shadow 설정
  const getTextShadow = color => {
    if (color === 'red' || color === '#ff0000' || color === '#dc2626') {
      return 'none';
    }
    return '0 0 8px rgba(255, 215, 0, 0.6), 0 0 16px rgba(255, 215, 0, 0.4)';
  };

  // <strong> 태그와 <br/> 태그를 모두 찾기
  const tagRegex = /<(strong|br\s*\/?)>(.*?)<\/strong>|(<br\s*\/?>)/gi;
  let match;
  let lastIndex = 0;

  while ((match = tagRegex.exec(text)) !== null) {
    // 태그 이전의 텍스트 추가
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      if (beforeText) {
        result.push(beforeText);
      }
    }

    if (match[1] === 'strong' || match[1] === 'br' || match[4]) {
      // <br/> 태그
      if (match[1] === 'br' || match[4]) {
        result.push(<br key={`br-${match.index}`} />);
      }
      // <strong> 태그
      else if (match[1] === 'strong') {
        result.push(
          <strong
            key={`strong-${match.index}`}
            style={{
              color: strongColor === 'red' ? '#ff0000' : strongColor,
              textShadow: getTextShadow(strongColor),
              fontWeight: strongColor === 'red' ? 600 : 'normal',
            }}
          >
            {match[2]}
          </strong>
        );
      }
    }

    lastIndex = match.index + match[0].length;
  }

  // 마지막 남은 텍스트 추가
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      result.push(remainingText);
    }
  }

  return result.length > 0 ? result : [text];
};

export const renderAnswerAsLines = (answer, options = {}) => {
  const { strongColor = '#ffd700' } = options;

  // 색상에 따른 text-shadow 설정
  const getTextShadow = color => {
    if (color === 'red' || color === '#ff0000' || color === '#dc2626') {
      return 'none';
    }
    return '0 0 8px rgba(255, 215, 0, 0.6), 0 0 16px rgba(255, 215, 0, 0.4)';
  };

  const getStrongStyle = () => ({
    color: strongColor === 'red' ? '#ff0000' : strongColor,
    textShadow: getTextShadow(strongColor),
    fontWeight: strongColor === 'red' ? 600 : 'normal',
  });
  if (answer && typeof answer === 'string' && answer?.length > 0) {
    const lines = answer.split('\n');
    const result = [];

    lines.forEach((line, lineIndex) => {
      // 빈 줄인 경우 높이를 가진 빈 div 반환
      if (line.trim() === '') {
        result.push(
          <div
            key={`${lineIndex}-empty`}
            style={{ height: '0.5rem', margin: '0', display: 'block' }}
          ></div>
        );
        return;
      }

      // HTML 엔티티 처리 (&nbsp; 등을 공백으로 변환)
      line = line.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

      // <br/> 태그가 있는지 확인
      if (line.includes('<br') || line.includes('<br/>')) {
        // <br/> 태그로 분리
        const parts = line.split(/(<br\s*\/?>)/gi);
        const elements = [];

        parts.forEach((part, partIndex) => {
          if (/<br\s*\/?>/gi.test(part)) {
            // <br/> 태그는 React의 <br> 요소로 추가
            elements.push(<br key={`br-${lineIndex}-${partIndex}`} />);
          } else if (part.trim()) {
            // <strong> 태그가 있는지 확인하고 처리
            if (part.includes('<strong>') || part.includes('</strong>')) {
              const strongParts = part.split(/(<strong>.*?<\/strong>)/g);
              strongParts.forEach((strongPart, spIndex) => {
                if (strongPart.startsWith('<strong>')) {
                  const text = strongPart.replace(
                    /<strong>(.*?)<\/strong>/,
                    '$1'
                  );
                  elements.push(
                    <strong
                      key={`strong-${lineIndex}-${partIndex}-${spIndex}`}
                      style={getStrongStyle()}
                    >
                      {text}
                    </strong>
                  );
                } else if (strongPart) {
                  elements.push(strongPart);
                }
              });
            } else {
              elements.push(part);
            }
          }
        });

        result.push(<p key={lineIndex}>{elements}</p>);
        return;
      }

      // <strong> 태그만 있는 경우
      if (line.includes('<strong>') || line.includes('</strong>')) {
        const parts = line.split(/(<strong>.*?<\/strong>)/g);
        result.push(
          <p key={lineIndex}>
            {parts.map((part, i) => {
              if (part.startsWith('<strong>')) {
                // strong 태그 내부 텍스트만 추출
                const text = part.replace(/<strong>(.*?)<\/strong>/, '$1');
                return (
                  <strong key={i} style={getStrongStyle()}>
                    {text}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
        return;
      }

      // 종합해석/개별해석 제목 감지 (🔮 종합해석 : 또는 🔮 개별카드해석 : 등)
      const interpretationTitleRegex =
        /🔮\s*(?:종합해석|개별카드해석|Comprehensive Interpretation|Individual Card Interpretation|総合解釈|個別カード解釈)\s*:/;
      const titleMatch = line.match(interpretationTitleRegex);
      if (titleMatch) {
        const titleText = titleMatch[0];
        const titleIndex = line.indexOf(titleText);
        const beforeTitle = line.substring(0, titleIndex);
        const afterTitle = line.substring(titleIndex + titleText.length);

        const elements = [];
        if (beforeTitle) {
          elements.push(<span key="before">{beforeTitle}</span>);
        }
        elements.push(
          <strong
            key="title"
            style={{
              ...getStrongStyle(),
              fontWeight: 600,
            }}
          >
            {titleText}
          </strong>
        );
        if (afterTitle) {
          elements.push(<span key="after">{afterTitle}</span>);
        }

        result.push(<p key={lineIndex}>{elements}</p>);
        return;
      }

      // URL 체크
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const hasUrl = urlRegex.test(line);

      if (hasUrl) {
        const parts = line.split(urlRegex);
        result.push(
          <p key={lineIndex}>
            {parts.map((part, i) => {
              if (urlRegex.test(part)) {
                return (
                  <a
                    key={i}
                    href={part}
                    onClick={async e => {
                      e.preventDefault();
                      const isNative = Capacitor?.isNativePlatform?.();

                      if (isNative) {
                        window.location.href = part;
                      } else {
                        window.open(part, '_blank');
                      }
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#60a5fa',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    {part}
                  </a>
                );
              }
              return part;
            })}
          </p>
        );
        return;
      }

      result.push(<p key={lineIndex}>{line}</p>);
    });

    return result;
  }
  return []; // 기본적으로 빈 배열 반환
};
