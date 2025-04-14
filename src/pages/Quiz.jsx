import React, { useEffect, useState } from "react";
import QuestionCard from "../components/QuestionCard";
import "../pages/quizStyles.css"
import questionBank from "../../public/quizBank.json";


const Quiz = ({ chapter }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [quizOver, setQuizOver] = useState(false);

    useEffect(() => {
        // Load 5 random questions from the selected chapter
        if (chapter && questionBank[chapter]) {
            const shuffled = [...questionBank[chapter]].sort(() => 0.5 - Math.random());
            setQuestions(shuffled.slice(0, 5));
        }
    }, [chapter]);

    const handleNext = () => {
        setShowAnswer(false);
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizOver(true);
        }
    };

    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    return (
        <div className="quiz-container">
            {quizOver ? (
                <div className="result">
                    <h2>Quiz Completed!</h2>
                    <p>Great job! You’ve finished all questions for {chapter}.</p>
                </div>
            ) : (
                <QuestionCard
                    question={questions[currentQuestionIndex]}
                    onCorrect={handleNext}
                    showAnswer={showAnswer}
                    onShowAnswer={handleShowAnswer}
                />
            )}
        </div>
    );
};

export default Quiz;
