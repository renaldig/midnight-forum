import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ThreadDetail from './ThreadDetail';

function ThreadList({ isAuthenticated }) {
  const [threads, setThreads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const backendURL = "http://ec2-3-27-169-155.ap-southeast-2.compute.amazonaws.com:3001";

  const handleThreadClick = (id) => {
    setCurrentThreadId(id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetch(`${backendURL}/threads`)
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

  return (
    <div>
      {threads.map(thread => (
        <div key={thread.id} className="thread" onClick={isAuthenticated ? () => handleThreadClick(thread.id) : null}>
          <div className="threadTitle">{thread.title} - <span className="author">{thread.user_id}</span></div>
          <div className="timestamp">{new Date(thread.created_at).toLocaleString()}</div>
        </div>
      ))}
      {isAuthenticated && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Thread Detail"
        >
          <ThreadDetail id={currentThreadId} />
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </Modal>
      )}
    </div>
  );
}

export default ThreadList;
