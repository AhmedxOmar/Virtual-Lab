import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        fetch("/topics.json")
            .then((res) => res.json())
            .then((data) => setTopics(data))
            .catch((err) => console.error("Failed to load topics:", err));
    }, []);

    return (
        <aside className="markdownSidebar">
            <div className="sidebar">
                <nav>
                    <ul>
                        {topics.map((topic) => (
                            <li key={topic.id} className="hover:bg-[#161616] transition ring-0 focus-outline-none cursor-pointer">
                                <Link to={`/docs/${topic.id}`} className="" >
                                    {topic.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

        </aside>
    );
}


{/* <aside className="markdownSidebar w-64 bg-[#1a1a1a] text-white h-full overflow-y-auto p-4">
 */}