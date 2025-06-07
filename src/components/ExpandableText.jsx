import React, { useState, useRef, useEffect } from 'react';
import './ExpandableText.css';

export function ExpandableText({ children }) {
  const textRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      // If content overflows its clamped height, show the toggle
      setShowToggle(el.scrollHeight > el.clientHeight + 1);
    }
  }, [children]);

  return (
    <div>
      <div
        ref={textRef}
        className={`expandable-text${isCollapsed ? ' collapsed' : ''}`}
      >
        {children}
      </div>

      {showToggle && (
        <button
          className="toggle-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? 'еще' : 'меньше'}
        </button>
      )}
    </div>
  );
}