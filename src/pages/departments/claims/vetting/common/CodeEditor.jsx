// components/CodeEditor.js
import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, readOnly = false, language = 'xml', height = '500px' }) => {
  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={onChange}
      options={{
        readOnly: readOnly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto'
        }
      }}
    />
  );
};

export default CodeEditor; 