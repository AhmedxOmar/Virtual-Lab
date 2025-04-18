import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import DocsLayout from "./layout/DocsLayout";
import MarkdownPage from "./pages/MarkdownPage";
import Profile from "./components/Profile";
import Community from "./pages/Community";
import About from "./pages/About";
import QuizListPage from "./pages/QuizListPage";
import QuizPage from "./pages/QuizPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs/*" element={<DocsLayout />}>
          <Route path=":topicId" element={<MarkdownPage />} />
        </Route>
        <Route path="/quizzes" element={<QuizListPage />} />
        <Route path="/quizzes/:chapterId" element={<QuizPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

export default App;
