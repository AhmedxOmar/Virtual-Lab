import React, { useState, useEffect } from 'react';
import { MdKeyboardArrowRight } from "react-icons/md";
import { FiCheckCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import rookieBadge from '../assets/rookie-badge.jpg';

const quizzes = [
    {
        id: 1,
        title: 'Introduction to Image Processing',
        correctAnswers: 9,
        totalQuestions: 10,
        score: 90,
    },
    {
        id: 2,
        title: 'Digital Image Processing Fundamentals',
        correctAnswers: 4,
        totalQuestions: 10,
        score: 40,
    }
];

const UserAchievements = () => {
    const [animatedScores, setAnimatedScores] = useState({});
    const [chapters, setChapters] = useState([]);
    const { user, topicProgress } = useSelector((state) => state.auth);

    useEffect(() => {
        // Fetch chapters data
        fetch("/topics.json")
            .then((res) => res.json())
            .then((data) => setChapters(data))
            .catch((err) => console.error("Failed to load topics:", err));

        // Animate quiz scores
        const timeout = setTimeout(() => {
            setAnimatedScores(quizzes.reduce((acc, quiz) => {
                acc[quiz.id] = quiz.score;
                return acc;
            }, {}));
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

    // Count completed topics
    const completedTopicsCount = Object.keys(topicProgress).filter(id => topicProgress[id]).length;

    return (
        <div className='flex flex-col py-4'>
            <div className='userAchievements bg-[#1a1a1a] p-6 w-200 text-white flex h-[max-content] items-center gap-[1rem] justify-between rounded-[20px]'>
                <div className="learnProgressSection w-[80%] p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold">Your Achievements</h2>
                    <p className='text-sm mt-1 text-gray-400'>
                        Completed {completedTopicsCount} topics across {chapters.length} chapters
                    </p>
                    <div className='relative w-[80%] bg-gray-700 h-[20px] rounded-full mt-2'>
                        <div className='absolute top-0 left-0 h-[20px] bg-purple-500 rounded-full' style={{ width: "65%" }}></div>
                    </div>
                    <p className='mt-3'>
                        You're <span className='font-bold text-yellow-400'>Rookie</span> now
                    </p>
                    <button className='mt-4 flex items-center gap-2 px-4 py-2 border-3 border-[#252525] rounded-lg hover:bg-gray-700 transition'>
                        Continue learning <MdKeyboardArrowRight size={20} />
                    </button>
                </div>
                <div className="achievementUserBadge">
                    <div className="userBadge relative">
                        <img className='achievementBadge' src={rookieBadge} alt="User Badge" />
                    </div>
                </div>
            </div>

            {/* Completed Topics Section */}
            <div className="progressCard mt-6 bg-[#1a1a1a] p-6 rounded-[20px] shadow-lg">
                <h2 className='text-lg font-semibold mb-4'>Completed Topics</h2>
                {chapters.map((chapter) => {
                    const completedTopics = chapter.topics.filter(topic => topicProgress[topic.id]);

                    return completedTopics.length > 0 && (
                        <div key={chapter.chapter} className="mb-4">
                            <h3 className="font-medium mb-2 text-purple-400">{chapter.chapter}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {completedTopics.map((topic) => (
                                    <div key={topic.id} className="flex items-center gap-2 text-sm p-2 bg-gray-800 rounded">
                                        <FiCheckCircle className="text-green-500 shrink-0" />
                                        <span className="truncate">{topic.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {!user && (
                    <div className="text-gray-400 text-sm mt-4">
                        Sign in to track your learning progress
                    </div>
                )}
            </div>

            <div className="quizzesCard mt-6 bg-[#1a1a1a] p-6 rounded-[20px] shadow-lg">
                <h2 className='text-lg font-semibold mb-4'>Solved Quizzes</h2>
                {quizzes.map((quiz) => (
                    <div key={quiz.id} className='quiz-item border-1 border-[#393939] p-7 rounded-lg flex justify-between items-center mb-4'>
                        <div>
                            <h3 className='font-bold text-[1.3rem]'>{quiz.title}</h3>
                            <p className='text-[#878787] py-1'>You got {quiz.correctAnswers} of {quiz.totalQuestions} answers correct</p>
                            <button className='mt-2 px-4 py-2 border-3 border-[#252525] text-sm rounded-md hover:bg-gray-700 flex items-center gap-2'>
                                Review your answers
                                <MdKeyboardArrowRight />
                            </button>
                        </div>
                        <div className='relative w-30 h-30'>
                            <svg className='w-full h-full' viewBox="0 0 36 36">
                                <circle className="text-gray-700" strokeWidth="4" stroke="currentColor" fill="transparent" r="16" cx="18" cy="18"></circle>
                                <circle
                                    className={quiz.score > 50 ? "text-green-500" : "text-red-500"}
                                    strokeWidth="4"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="16"
                                    cx="18"
                                    cy="18"
                                    strokeDasharray="100"
                                    strokeDashoffset={100 - (animatedScores[quiz.id] || 0)}
                                    style={{ transition: "stroke-dashoffset 1.5s ease-in-out", }}
                                ></circle>
                            </svg>
                            <span className='absolute inset-0 flex items-center justify-center text-[24px] font-bold'>{quiz.score}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserAchievements;