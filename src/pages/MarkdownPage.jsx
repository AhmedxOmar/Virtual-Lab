import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function MarkdownPage() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [headings, setHeadings] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true); // 🔥 Track loading

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch("/topics.json");
                if (!response.ok) throw new Error("Failed to load topics");
                const data = await response.json();
                setTopics(data);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };

        fetchTopics();
    }, []);

    useEffect(() => {
        if (!topicId) {
            setContent("# 404 - Topic Not Found");
            setLoading(false);
            return;
        }

        const fetchMarkdown = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/docs/${topicId}.md`);
                if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
                const text = await response.text();

                if (text.toLowerCase().includes("<!doctype html>")) throw new Error("Received HTML instead of Markdown");

                setContent(text);
                extractHeadings(text);
            } catch (error) {
                console.error("Error loading markdown:", error);
                setContent("# 404 - Topic Not Found");
                setHeadings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMarkdown();
    }, [topicId]);

    const currentIndex = topics.findIndex((topic) => topic.id === topicId);
    const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
    const nextTopic = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

    const extractHeadings = (markdown) => {
        const lines = markdown.split("\n");
        const extractedHeadings = lines
            .filter((line) => line.match(/^##?\s/))
            .map((line) => {
                const text = line.replace(/^#+\s/, "").trim();
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

    return (
        <div className="container markdownMain">
            <div className="markdownContainer">
                {/* Markdown Content */}
                <div className="flex flex-1 flex-col markdownContentContainer">
                    <div className="prose prose-lg dark:prose-invert markdownContent">
                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="h-8 bg-[#3b3b3b] rounded w-1/2"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-full"></div>
                                <div className="h-2 bg-[#3b3b3b] rounded w-5/6"></div>
                                <div className="h-2 bg-[#3b3b3b] rounded w-3/4"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-full"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-2/3"></div>
                                <br />
                                <div className="h-8 bg-[#3b3b3b] rounded w-1/2"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-full"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-5/6"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-3/4"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-full"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-2/3"></div>
                                <br />
                                <div className="h-8 bg-[#3b3b3b] rounded w-1/2"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-full"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-5/6"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-3/4"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-full"></div>
                                <div className="h-4 bg-[#3b3b3b] rounded w-2/3"></div>
                            </div>
                        ) : (
                            <ReactMarkdown
                                components={{
                                    h1: ({ node, children }) => {
                                        const text = String(children).trim();
                                        const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
                                        return <h1 id={id} className="scroll-mt-24">{children}</h1>;
                                    },
                                    h2: ({ node, children }) => {
                                        const text = String(children).trim();
                                        const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
                                        return <h2 id={id} className="scroll-mt-24">{children}</h2>;
                                    },
                                    img: ({ src, alt }) => {
                                        if (!src) return null;
                                        return <img src={src} alt={alt || ""} loading="lazy" />;
                                    }
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        )}
                    </div>

                    {/* Navigation Buttons (only if content is loaded successfully) */}
                    {!loading && (
                        <nav className="paginationButtons mt-4 grid gap-2 grid-cols-2">
                            {prevTopic ? (
                                <a
                                    onClick={() => navigate(`/docs/${prevTopic.id}`)}
                                    className="border border-[#606770] hover:border-[#845097] rounded-[0.4rem] cursor-pointer paginationNavLink paginationNavLinkPrev p-4"
                                >
                                    <div>Previous</div>
                                    <div className="paginationLabel break-normal text-[#845097] font-bold">
                                        {prevTopic.title}
                                    </div>
                                </a>
                            ) : <div />}

                            {nextTopic ? (
                                <a
                                    onClick={() => navigate(`/docs/${nextTopic.id}`)}
                                    className="border border-[#606770] hover:border-[#845097] rounded-[0.4rem] text-right cursor-pointer paginationNavLink paginationNavLinkNext p-4"
                                >
                                    <div>Next</div>
                                    <div className="paginationLabel break-normal text-[#845097] font-bold">
                                        {nextTopic.title}
                                    </div>
                                </a>
                            ) : <div />}
                        </nav>
                    )}
                </div>

                {/* Table of Contents */}
                <div className="markdownTableContainer">
                    <div className="markdownTable">
                        <ul>
                            {headings.map((heading) => (
                                <li key={heading.id} className={`ml-${heading.level === 2 ? "4 pl-2" : "2"} py-1 text-sm`}>
                                    <button
                                        onClick={() => handleScrollTo(heading.id)}
                                        className="text-left w-full hover:text-blue-500 border-0 focus:outline-none"
                                    >
                                        {heading.text}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
