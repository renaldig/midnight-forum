import React, { useState } from 'react';
import Modal from 'react-modal';
import { Auth } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

function CreateThread() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const backendURL = "<YOUR_BACKEND_URL_HERE>";

  const handleSubmit = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const userId = currentUser.attributes.name;
        const PK = uuidv4();

        const response = await fetch(backendURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ PK, title, content, userId }),
        });

        if (response.ok) {
          const data = await response.json(); 
          console.log(data);
          setIsModalOpen(false);
          window.location.reload();
        } else {
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
