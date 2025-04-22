import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiChevronRight } from "react-icons/fi"; // ✅ React icons

export default function Sidebar() {
    const [chapters, setChapters] = useState([]);
    const [expanded, setExpanded] = useState({});
    const location = useLocation();

    useEffect(() => {
        fetch("/topics.json")
            .then((res) => res.json())
            .then((data) => {
                setChapters(data);
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
                                    <span className="select-none">{chapter.chapter}</span>
                                    <span>
                                        {expanded[chapter.chapter]
                                            ? <FiChevronDown size={18} />
                                            : <FiChevronRight size={18} />}
                                    </span>
                                </div>

                                <AnimatePresence initial={false}>
                                    {expanded[chapter.chapter] && (
                                        <motion.div
                                            key={chapter.chapter}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <motion.ul
                                                className="ml-4 mt-2 space-y-1"
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={{
                                                    visible: {
                                                        transition: {
                                                            staggerChildren: 0.05,
                                                            when: "beforeChildren"
                                                        }
                                                    },
                                                    exit: {
                                                        transition: {
                                                            staggerChildren: 0.03,
                                                            staggerDirection: -1
                                                        }
                                                    }
                                                }}
                                            >
                                                {chapter.topics.map((topic) => {
                                                    const isActive = location.pathname === `/docs/${topic.id}`;
                                                    return (
                                                        <motion.li
                                                            key={topic.id}
                                                            variants={{
                                                                hidden: { opacity: 0, x: -20 },
                                                                visible: { opacity: 1, x: 0 },
                                                                exit: { opacity: 0, x: -20 }
                                                            }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <Link
                                                                to={`/docs/${topic.id}`}
                                                                className={`block px-2 py-1 rounded-lg transition ${isActive ? "bg-[#333]" : "hover:bg-[#333]"}`}
                                                            >
                                                                {topic.title}
                                                            </Link>
                                                        </motion.li>
                                                    );
                                                })}
                                            </motion.ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
