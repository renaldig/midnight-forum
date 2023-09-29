import React, { useState } from 'react';
import Modal from 'react-modal';
import { Auth } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

function CreateThread() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const backendURL = "https://fwr46g69lg.execute-api.ap-southeast-2.amazonaws.com";

  const handleSubmit = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const userId = currentUser.attributes.name;
        const PK = uuidv4();  // Generate a unique UUID for the new thread

        const response = await fetch("https://fwr46g69lg.execute-api.ap-southeast-2.amazonaws.com/prod/api/threads", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ PK, title, content, userId }),  // Include the UUID in the request body
        });

        if (response.ok) {
          // The request was successful
          const data = await response.json(); // Read the response body as JSON
          console.log(data);
          setIsModalOpen(false); // Close the modal
          window.location.reload(); // Refresh the page to reflect the new thread
        } else {
          // The request failed, log the status code and status text
          console.error(`Error creating thread: ${response.status} ${response.statusText}`);
        }

      } catch (error) {
        console.error("Error creating thread:", error);
      }
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Create New Thread</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Create Thread"
      >
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Thread Title" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Thread Content"></textarea>
        <button onClick={handleSubmit}>Create Thread</button>
        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
      </Modal>
    </>
  );
}

export default CreateThread;
