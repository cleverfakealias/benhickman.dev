import React, { useEffect, useRef, useState } from "react";
import './TypewriterCode.css';

interface TypewriterCodeProps {
  code: string;
  typingSpeed?: number; // ms per character
}

const BLINK_INTERVAL = 500;

const TypewriterCode: React.FC<TypewriterCodeProps> = ({ code, typingSpeed = 40 }) => {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    const type = () => {
      if (indexRef.current < code.length) {
        setDisplayed(code.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        setTimeout(type, typingSpeed);
      }
    };
    type();
    return () => {};
  }, [code, typingSpeed]);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((c) => !c), BLINK_INTERVAL);
    return () => clearInterval(blink);
  }, []);

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
      </div>
      <pre className="terminal-code">
        {displayed}
        <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
      </pre>
    </div>
  );
};

export default TypewriterCode; 