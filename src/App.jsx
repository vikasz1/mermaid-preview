import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MermaidPreview from "./components/MermaidPreview";
import UploadVideo from "./components/UploadVideo";

function App() {
  const code = `
  graph LR;
    A[Beginner] --> B{What do I need to do?};
    B --> C[Understand the img tag];
    C --> D1{Is the image optimized for web use?};
    D1 --> E[Yes] --> F[Use the correct src and alt attributes];
    D1 --> G[No] --> H[Learn how to optimize the image first];
    H --> I[Choose a suitable image format];
    I --> J[Consider using a figure if necessary];
    J --> K{Is the image not displaying properly?};
    K --> L[Check for screen size compatibility];
    L --> M[Adjust the width and height accordingly];
    M --> N{Are there any issues with layout or design?};
    N --> O[Yes] --> P[Use CSS to adjust the position and size of the image];
    N --> Q[No] --> R[End the class];
    R --> S[You're done!];
  `;

  return (
    <>
      <div style={{ width: "100vw",  border:"red solid", background:"yellow"}}>
        <UploadVideo/>
        {/* <MermaidPreview code={code} /> */}
      </div>
    </>
  );
}

export default App;
