import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
    FiChevronLeft,
    FiChevronRight,
    FiChevronUp,
    FiChevronDown,
} from "react-icons/fi";

export default function MarkdownPage() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [headings, setHeadings] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await fetch("/topics.json");
                if (!response.ok) throw new Error("Failed to load chapters");
                const data = await response.json();
                setChapters(data);
            } catch (error) {
                console.error("Error fetching chapters:", error);
            }
        };

        fetchChapters();
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
                const allTopics = chapters.flatMap(chapter => chapter.topics);
                const topic = allTopics.find(t => t.id === topicId);

                if (!topic) {
                    throw new Error("Topic not found");
                }

                const response = await fetch(`/docs/${topic.path}`);
                if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
                const text = await response.text();

                if (text.toLowerCase().includes("<!doctype html>")) {
                    throw new Error("Received HTML instead of Markdown");
                }

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

        if (chapters.length > 0) {
            fetchMarkdown();
        }
    }, [topicId, chapters]);

    const allTopics = chapters.flatMap(chapter => chapter.topics);
    const currentIndex = allTopics.findIndex(topic => topic.id === topicId);
    const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
    const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

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
                <div className="flex flex-1 flex-col markdownContentContainer">
                    <div className="prose prose-lg dark:prose-invert markdownContent">
                        {loading ? (
                            <div className="space-y-6 animate-pulse">
                                {/* Skeleton content */}
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

                                        // Handle both possible folder names (photos/ or assets/)
                                        if (src.startsWith("photos/") || src.startsWith("photo/") || src.startsWith("photows/") || src.startsWith("phhotos/")
                                            || src.startsWith("phOotos/") || src.startsWith("photows/")) {
                                            const currentTopic = chapters
                                                .flatMap(ch => ch.topics)
                                                .find(t => t.id === topicId);

                                            if (currentTopic) {
                                                // Extract chapter folder name from the topic's path
                                                const chapterFolder = currentTopic.path.split('/')[0];
                                                // Encode for URL but keep forward slashes
                                                const encodedPath = chapterFolder.replace(/ /g, '%20');
                                                return <img src={`/docs/${encodedPath}/${src}`}
                                                    alt={alt || ""}
                                                    loading="lazy"
                                                    className="max-w-full h-auto my-4 border rounded-lg" />;
                                            }
                                        }

                                        // Fallback for absolute paths or external images
                                        return <img src={src} alt={alt || ""} loading="lazy" />;
                                    }
                                }}
                            >
                                {content}
                            </ReactMarkdown>

                        )}
                    </div>

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

                {!loading && headings.length > 0 && (
                    <div className="markdownTableContainer">
                        <div className="markdownTable">
                            <ul>
                                {headings.map((heading) => (
                                    <li key={heading.id} className={`ml-${heading.level === 2 ? "4 pl-2" : "2"} py-1 text-sm`}>
                                        <button
                                            onClick={() => handleScrollTo(heading.id)}
                                            className="text-left w-full hover:text-blue-500 focus:outline-none"
                                        >
                                            {heading.text}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
