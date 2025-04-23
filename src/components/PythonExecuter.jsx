import { useRef, useState, useEffect } from "react";

export default function PythonExecuter({ initialCode }) {
    const pyodideRef = useRef(null);
    const [outputImageUrl, setOutputImageUrl] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [consoleOutput, setConsoleOutput] = useState("");
    const [code, setCode] = useState(""); // Initialize with empty state for code
    const [showPopup, setShowPopup] = useState(false);

    // Load Python code from localStorage or fallback to initialCode
    useEffect(() => {
        const savedCode = localStorage.getItem("pythonCode");
        if (savedCode) {
            setCode(savedCode); // Set code from localStorage
        } else {
            setCode(initialCode); // Use initial code from markdown if no saved code
        }

        const initPyodide = async () => {
            await loadPyodideScript();
            pyodideRef.current = await window.loadPyodide({
                indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
            });

            await pyodideRef.current.loadPackage(['micropip']);
            await pyodideRef.current.runPythonAsync(`
                import micropip
                await micropip.install("opencv-python")
                await micropip.install("numpy")
                await micropip.install("matplotlib")
            `);
            setLoading(false);
        };

        initPyodide();
    }, [initialCode]);

    const loadPyodideScript = async () => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        document.body.appendChild(script);
        return new Promise(resolve => {
            script.onload = resolve;
        });
    };

    const handleImageUpload = async (event) => {
        if (!pyodideRef.current) {
            alert("Please wait for Pyodide to finish loading.");
            return;
        }

        const file = event.target.files[0];
        if (!file) return;

        const buffer = await file.arrayBuffer();
        const byteArray = new Uint8Array(buffer);
        pyodideRef.current.FS.writeFile('image.jpg', byteArray);

        setUploadedImage(URL.createObjectURL(file));
        setOutputImageUrl(null);  // Reset previous image if any
    };

    const processImage = async () => {
        if (!uploadedImage) {
            alert("Please upload an image first.");
            return;
        }
        if (!pyodideRef.current) return;

        try {
            pyodideRef.current.setStdout({
                batched: (text) => setConsoleOutput((prev) => prev + text),
            });
            await pyodideRef.current.runPythonAsync(code); // Run the code from the textarea

            const outputData = pyodideRef.current.FS.readFile('output.jpg');
            const blob = new Blob([outputData], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            setOutputImageUrl(imageUrl);
            setShowPopup(true);  // Show popup with processed image
        } catch (error) {
            alert("Error executing Python code: " + error.message);
            console.error(error);
        }
    };

    const handleCodeChange = (event) => {
        const newCode = event.target.value;
        setCode(newCode); // Update code in the state
        localStorage.setItem("pythonCode", newCode); // Save updated code to localStorage
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Upload an Image for Processing</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />

            {uploadedImage && (
                <div className="mb-4">
                    <h3 className="font-medium">Original Image:</h3>
                    <img src={uploadedImage} alt="Uploaded" className="max-w-full max-h-64 my-2" />
                </div>
            )}

            <div className="mb-4">
                <h3 className="font-medium">Python Code:</h3>
                <textarea
                    value={code}
                    onChange={handleCodeChange} // User can edit the code in this textarea
                    rows={8}
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                onClick={processImage}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
                Run Python Code
            </button>

            {showPopup && outputImageUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg relative">
                        <button
                            onClick={handleClosePopup}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            Close
                        </button>
                        <h3 className="text-xl font-medium mb-4">Processed Image:</h3>
                        <img
                            src={outputImageUrl}
                            alt="Processed"
                            className="max-w-full max-h-64 my-2"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
