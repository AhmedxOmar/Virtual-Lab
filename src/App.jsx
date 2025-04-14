import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import DocsLayout from "./layout/DocsLayout"; // New layout for docs

import MarkdownPage from "./pages/MarkdownPage";
import Profile from "./components/Profile";
import Community from "./pages/Community";
import About from "./pages/About";
import Quiz from "./pages/Quiz";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
        <Route path="/quiz" element={<Quiz />} />

        {/* Parent Route for Docs */}
        <Route path="/docs/*" element={<DocsLayout />}>
          <Route path=":topicId" element={<MarkdownPage />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

export default App;
