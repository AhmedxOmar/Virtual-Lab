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
        <aside className="w-64 bg-[#1a1a1a] text-white h-full overflow-y-auto p-4">
            <nav>
                <ul>
                    {topics.map((topic) => (
                        <li key={topic.id} className="py-2">
                            <Link to={`/docs/${topic.id}`} className="hover:text-gray-400">
                                {topic.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
