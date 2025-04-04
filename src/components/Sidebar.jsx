import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const [topics, setTopics] = useState([]);
    const location = useLocation();

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
                        {topics.map((topic) => {
                            const isActive = location.pathname === `/docs/${topic.id}`;
                            return (
                                <li
                                    key={topic.id}
                                    className={`hover:bg-[#161616] transition ring-0 focus:bg-[#161616] cursor-pointer ${isActive ? "bg-[#161616]" : ""
                                        }`}
                                >
                                    <Link to={`/docs/${topic.id}`} className="">
                                        {topic.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
