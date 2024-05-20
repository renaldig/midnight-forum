import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ThreadDetail from './ThreadDetail';

function ThreadList({ isAuthenticated, theme }) {
  const [threads, setThreads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const backendURL = "<YOUR_BACKEND_LAMBDA_HERE>";

  const handleThreadClick = (id) => {
    setCurrentThreadId(id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetch(`${backendURL}/api/threads`)
      .then(response => {
        if (!response.ok) {
          console.log(response)
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Received data is not an array:", data);
          return;
        }
        setThreads(data);
      })
      .catch(error => console.error("Error fetching threads:", error));

  }, []);

  const customModalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    content: {
      background: 'transparent',
      border: 'none', 
    }
  };
  return (
    <div>
      {threads.map(thread => (
        <div
          key={thread.id}
          className={`thread ${theme === 'dark' ? 'dark' : ''}`}
          onClick={isAuthenticated ? () => handleThreadClick(thread.id) : null}
        >
          <div className="threadTitle">{thread.title} - <span className="author">{thread.user_id}</span></div>
          <div className="timestamp">{new Date(thread.created_at).toLocaleString()}</div>
        </div>
      ))}
      {isAuthenticated && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Thread Detail"
          style={customModalStyles}
        >
          <ThreadDetail id={currentThreadId} theme={theme} onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default ThreadList;
