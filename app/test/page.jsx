"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function TestEditor() {
  const [value, setValue] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Quill Editor</h1>
      <ReactQuill value={value} onChange={setValue} />
      <p>Preview:</p>
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
}
