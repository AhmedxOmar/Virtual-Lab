import { useState, useEffect } from "react";
import questionsData from "../../public/quizzes/chapter1.json";

const Quiz = ({ chapterId }) => {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`/quizzes/chapter${chapterId}.json`);

                if (!response.ok) throw new Error('Failed to fetch questions');
                const data = await response.json();
                const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 10);
                setQuestions(shuffled);

            } catch (error) {
                console.error('Error loading quiz:', error);
                setQuestions([]);
            }

        };
        fetchQuestions()
    }, [chapterId]);

    const handleAnswer = (option) => {
        if (isSubmitted) return; // Prevent changes after submission
        const updated = [...userAnswers];
        updated[current] = option;
        setUserAnswers(updated);
    };

    const handleNext = () => {
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        }
    };

    const handlePrev = () => {
        if (current > 0) {
            setCurrent(current - 1);
        }
    };

    const submitQuiz = () => {
        setIsSubmitted(true);
    };

    const getScore = () =>
        questions.reduce(
            (score, q, idx) => (userAnswers[idx] === q.answer ? score + 1 : score),
            0
        );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
                🧠 Chapter 1 Quiz
            </h2>

            {questions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300">
                    <div className="mb-4 text-gray-700 font-semibold">
                        Question {current + 1} of {questions.length}
                    </div>

                    <h3 className="text-xl font-semibold mb-6 text-gray-900">
                        {questions[current].question}
                    </h3>

                    <div className="space-y-3">
                        {questions[current].options.map((option, idx) => {
                            const selectedAnswer = userAnswers[current];
                            const isSelected = selectedAnswer === option;
                            const isCorrect = option === questions[current].answer;
                            const isUnanswered = selectedAnswer === undefined;

                            let optionClass =
                                "bg-gray-50 hover:bg-gray-100 border-gray-300";

                            if (isSubmitted) {
                                if (isCorrect) {
                                    optionClass =
                                        "bg-green-100 border-green-400 text-green-800";
                                } else if (isSelected || isUnanswered) {
                                    optionClass =
                                        "bg-red-100 border-red-400 text-red-800";
                                } else {
                                    optionClass =
                                        "bg-gray-100 border-gray-300";
                                }
                            } else if (isSelected) {
                                optionClass =
                                    "bg-blue-100 border-blue-400 text-blue-800";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    className={`w-full text-left px-4 py-3 rounded-lg border text-black transition-colors ${optionClass}`}
                                    disabled={isSubmitted}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
                            onClick={handlePrev}
                            disabled={current === 0}
                        >
                            ← Previous
                        </button>

                        {isSubmitted ? (
                            <div className="text-lg font-bold text-indigo-700">
                                ✅ Score: {getScore()} / {questions.length}
                            </div>
                        ) : current === questions.length - 1 ? (
                            <button
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                onClick={submitQuiz}
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                                onClick={handleNext}
                            >
                                Next →
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
