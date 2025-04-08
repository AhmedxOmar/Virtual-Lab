import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Searchbar = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [topics, setTopics] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopics = async () => {
            const res = await fetch("/topics.json");
            const data = await res.json();
            setTopics(data);
        };
        fetchTopics();
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        const filtered = topics.filter((topic) =>
            topic.title.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filtered);
        setShowDropdown(filtered.length > 0);
    }, [query, topics]);

    const handleResultClick = (id) => {
        navigate(`/docs/${id}`);
        setShowDropdown(false);
        setQuery("");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 👇 This useEffect handles closing dropdown on route change
    useEffect(() => {
        setShowDropdown(false);
        setQuery("");  // optional: reset input on navigation
        setResults([]);
    }, [location.pathname]);

    return (
        <div className="relative w-full max-w-md" ref={dropdownRef}>
            <input
                type="text"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1f1f] text-black dark:text-white focus:outline-none"
                placeholder="Search docs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {showDropdown && (
                <ul className="absolute z-50 w-100 mt-1 bg-[#1a1a1a] border border-[#333] rounded shadow max-h-60 overflow-y-auto">
                    {results.map((result) => (
                        <li
                            key={result.id}
                            onClick={() => handleResultClick(result.id)}
                            className="px-4 py-2 hover:bg-[#333] cursor-pointer text-white"
                        >
                            {result.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Searchbar;
