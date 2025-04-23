import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { TbLayoutSidebarRightCollapse, TbLayoutSidebarLeftCollapse } from "react-icons/tb";

import { useNavigate } from "react-router-dom"; // 👈 add this at the top


export default function Sidebar() {
    const [chapters, setChapters] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

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

    const toggleChapter = (chapterObj, index) => {
        const chapterName = chapterObj.chapter;

        if (sidebarCollapsed) {
            // 1. Expand the sidebar
            setSidebarCollapsed(false);

            // 2. Expand the chapter
            setExpanded(prev => ({ ...prev, [chapterName]: true }));

            // 3. Navigate to the first topic
            const firstTopic = chapterObj.topics[0];
            if (firstTopic) {
                navigate(`/docs/${firstTopic.id}`);
            }
        } else {
            // Just toggle expansion if sidebar is already expanded
            setExpanded(prev => ({ ...prev, [chapterName]: !prev[chapterName] }));
        }
    };

    const getChapterShortName = (fullName, index) => `CH${index + 1}`;

    return (
        <aside
            className={`markdownSidebar transition-all  duration-900 ease-in-out
                ${sidebarCollapsed ? "w-[90px]" : "w-[440px] bg-[#1a1a1a]"} 
                pb-[3rem] text-white sticky z-40`}
        >
            {/* Collapse Toggle Button */}
            <div className="sidebarViewport">
                <div className="sidebarContainer">
                    <div className="flex p-2">
                        <button
                            onClick={() => setSidebarCollapsed(prev => !prev)}
                            className="p-1 bg-[#1F1F1F] mb-4 hover:bg-[#1F1F1F] border-2 border-[#2E2E2E] rounded-lg transition"
                            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            {sidebarCollapsed ? <TbLayoutSidebarRightCollapse size={30} /> : <TbLayoutSidebarLeftCollapse size={30} />}
                        </button>
                    </div>

                    {/* Chapters */}
                    {!sidebarCollapsed && (
                        <nav>
                            <ul className="space-y-2 pr-2">
                                {chapters.map((chapter, index) => (
                                    <li key={chapter.chapter}>
                                        <div
                                            onClick={() => toggleChapter(chapter, index)}
                                            className="cursor-pointer font-semibold hover:bg-[#222] p-2 rounded-lg flex justify-between items-center"
                                        >
                                            <span className="select-none overflow-hidden text-ellipsis w-full">
                                                {chapter.chapter}
                                            </span>
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
                                                                        style={{ whiteSpace: "normal", overflow: "visible", textOverflow: "unset" }}
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
                    )}
                </div>

            </div>

        </aside>
    );
}
