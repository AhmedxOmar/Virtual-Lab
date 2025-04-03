import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layout/Layout";
import DocsLayout from "./layout/DocsLayout"; // New layout for docs

import MarkdownPage from "./pages/MarkdownPage";
import Profile from "./components/Profile";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

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
