import React, { useState } from 'react';
import Modal from 'react-modal';
import { Auth } from 'aws-amplify';

function CreateThread() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const backendURL = "http://ec2-3-27-169-155.ap-southeast-2.compute.amazonaws.com:3001";

  const handleSubmit = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        const userId = currentUser.attributes.name;

        const response = await fetch(`${backendURL}/threads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, content, userId })
        });

        const data = await response.json();

        // Assuming the API will return a successful status on a successful post
        if (response.status === 200 || response.status === 201) {
          setIsModalOpen(false);  // Close the modal
          window.location.reload();  // Refresh the page to reflect the new thread
        } else {
          console.error("Error creating thread:", data.message || "Unknown error");
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
