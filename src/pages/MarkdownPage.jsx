import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function MarkdownPage() {
    const { topicId } = useParams();
    const [content, setContent] = useState("Loading...");
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        if (!topicId) {
            setContent("# 404 - Topic Not Found");
            return;
        }

        const fetchMarkdown = async () => {
            try {
                const response = await fetch(`/docs/${topicId}.md`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }

                const text = await response.text();
                setContent(text);
                extractHeadings(text);
            } catch (error) {
                console.error("Error loading markdown:", error);
                setContent("# 404 - Topic Not Found");
                setHeadings([]);
            }
        };

        fetchMarkdown();
    }, [topicId]);

    const extractHeadings = (markdown) => {
        const lines = markdown.split("\n");
        const extractedHeadings = lines
            .filter((line) => line.match(/^##?\s/)) // Capture H1 and H2
            .map((line) => {
                const text = line.replace(/^#+\s/, "").trim(); // Extract full text
                const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
                return { id, text, level: line.startsWith("##") ? 2 : 1 };
            });

        setHeadings(extractedHeadings);
    };

    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const styles = {
        button: {
            border: "none",
            outline: "none"
        }
    }
    return (
        <div className="flex">
            {/* Main Markdown Content */}
            <div className="flex-1 p-6">
                <div className="prose prose-lg dark:prose-invert">
                    <ReactMarkdown
                        components={{
                            h1: ({ node, children }) => {
                                const text = String(children).trim(); // Extract full text
                                const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
                                return <h1 id={id} className="scroll-mt-24">{children}</h1>;
                            },
                            h2: ({ node, children }) => {
                                const text = String(children).trim();
                                const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
                                return <h2 id={id} className="scroll-mt-24">{children}</h2>;
                            },
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Table of Contents (Sticky) */}
            <div className="w-64 p-4 text-white h-screen overflow-y-auto sticky top-0">
                <ul className="mt-2">
                    {headings.map((heading) => (
                        <li key={heading.id} className={`ml-${heading.level === 2 ? "4" : "2"} py-1 text-sm`}>
                            <button
                                onClick={() => handleScrollTo(heading.id)}
                                className="text-left w-full hover:text-blue-500 border-0" style={styles.button}>
                                {heading.text}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );



}


