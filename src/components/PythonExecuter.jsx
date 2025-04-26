// src/components/PythonExecuter.jsx
import React, { useEffect, useRef, useState } from 'react';
import { loadPyodideInstance } from '../utils/pyodideLoader';

const PythonExecuter = ({ initialCode = '' }) => {
    const [output, setOutput] = useState('');
    const [code, setCode] = useState(initialCode);
    const pyodideRef = useRef(null);

    useEffect(() => {
        const initializePyodide = async () => {
            pyodideRef.current = await loadPyodideInstance();
        };
        initializePyodide();
    }, []);

    const runCode = async () => {
        if (!pyodideRef.current) return;

        try {
            const result = await pyodideRef.current.runPythonAsync(code);
            setOutput(result);
        } catch (err) {
            setOutput(err.toString());
        }
    };

    return (
        <div>
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={10}
                cols={80}
            />
            <br />
            <button onClick={runCode}>Run Code</button>
            <pre>{output}</pre>
        </div>
    );
};

export default PythonExecuter;
