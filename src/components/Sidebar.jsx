import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const [chapters, setChapters] = useState([]);
    const [expanded, setExpanded] = useState({});
    const location = useLocation();

    useEffect(() => {
        fetch("/topics.json")
            .then((res) => res.json())
            .then((data) => {
                setChapters(data);
                // Expand current chapter based on URL
                const currentTopicId = location.pathname.split('/').pop();
                const currentChapter = data.find(chapter =>
                    chapter.topics.some(topic => topic.id === currentTopicId)
                );
                if (currentChapter) {
                    setExpanded(prev => ({ ...prev, [currentChapter.chapter]: true }));
                }
            })
            .catch((err) => console.error("Failed to load topics:", err));
    }, [location.pathname]);

    const toggleChapter = (chapter) => {
        setExpanded(prev => ({ ...prev, [chapter]: !prev[chapter] }));
    };

    return (
        <aside className="markdownSidebar">
            <div className="sidebar">
                <nav>
                    <ul className="space-y-2">
                        {chapters.map((chapter) => (
                            <li key={chapter.chapter}>
                                <div
                                    onClick={() => toggleChapter(chapter.chapter)}
                                    className="cursor-pointer font-semibold hover:bg-[#222] p-2 rounded-lg flex justify-between items-center"
                                >
                                    <span>{chapter.chapter}</span>
                                    <span>{expanded[chapter.chapter] ? "▲" : "▼"}</span>
                                </div>
                                {expanded[chapter.chapter] && (
                                    <ul className="ml-4 mt-2 space-y-1">
                                        {chapter.topics.map((topic) => {
                                            const isActive = location.pathname === `/docs/${topic.id}`;
                                            return (
                                                <li key={topic.id}>
                                                    <Link
                                                        to={`/docs/${topic.id}`}
                                                        className={`block px-2 py-1 rounded-lg transition ${isActive ? "bg-[#333]" : "hover:bg-[#333]"} `}
                                                    >
                                                        {topic.title}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        ))}
                        {/* <li>
                            <Link
                                to="/quiz"
                                className="block mt-4 p-2 rounded-lg hover:bg-[#333] transition"
                            >
                                Quiz
                            </Link>
                        </li> */}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}