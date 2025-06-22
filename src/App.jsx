import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/components/prism-javascript";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState('Click "Review" to analyze your code');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use environment variable with fallback for local development
      const backendURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${backendURL}/ai/get-review`, { code });
      
      setReview(response.data || 'No review generated');
    } catch (error) {
      console.error("Error fetching review:", error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch review');
      setReview('❌ Error: Could not get review. See console for details.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={newCode => setCode(newCode)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <button 
            onClick={reviewCode} 
            className="review"
            disabled={isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Review'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review}
          </Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
