import React, { useEffect } from 'react';
import mermaid from 'mermaid';

const MermaidPreview = ({ code }) => {
  useEffect(() => {
    // Initialize and render the mermaid code
    mermaid.initialize({ startOnLoad: true });

    // Render the Mermaid diagram
    try {
      mermaid.contentLoaded();
    } catch (error) {
      console.error('Error rendering Mermaid diagram:', error);
    }
  }, [code]); // Re-render if the code changes

  return (
    <div>
      <div className="mermaid">
        {code}
      </div>
    </div>
  );
};

export default MermaidPreview;
