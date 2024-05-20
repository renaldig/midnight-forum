import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function ThreadDetail(props) {
  const [thread, setThread] = useState({});
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const backendURL = "<YOUR_BACKEND_LAMBDA_HERE>";
  const id = props.id;

  const { theme } = props;

  useEffect(() => {

    const fetchUser = async () => {
      const user = await Auth.currentAuthenticatedUser();
      setCurrentUser(user);
    };
    fetchUser();

    fetch(`${backendURL}/api/threads/${id}`)
      .then(response => response.json())
      .then(data => setThread(data));

    fetch(`${backendURL}/api/threads/${id}/posts`)
       .then(response => response.json())
       .then(data => {
          if (Array.isArray(data)) {
             setPosts(data);
          } else {
             console.error("Expected an array but received:", data);
          }
       });
  }, [id]);

  // Function to handle new post submission
  const handleNewPostSubmit = async (e) => {
    e.preventDefault();

    const currentUser = await Auth.currentAuthenticatedUser();
    const userId = currentUser.attributes.name;
    const newId = uuidv4();

    // Make the POST request to create a new post
    const response = await fetch(`${backendURL}/api/threads/${id}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newId,
        content: newPostContent,
        userId
      })
    });

    const result = await response.json();

    if (result) {
      setPosts([...posts, result]);
      setNewPostContent('');  // Clear the content
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();

      const response = await fetch(`${backendURL}/api/threads/${id}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: idToken,
        },
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className={`threadDetail ${theme === 'dark' ? 'dark' : ''}`}>
      <h1>{thread.title} - <span className={`author ${theme === 'dark' ? 'dark' : ''}`}>{thread.user_id}</span></h1>
      <p>{thread.content}</p>
      <div>
        {posts.map(post => (
          <div key={post.id} className={`post ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="postHeader">
              <span className={`author ${theme === 'dark' ? 'dark' : ''}`}>{post.user_id}</span> - <span className={`timestamp ${theme === 'dark' ? 'dark' : ''}`}>{new Date(post.created_at).toLocaleString()}</span>
            </div>
            <div>{post.content}</div>
            <div>
              {currentUser && post.user_id === currentUser.attributes.name && (
                <button type="button" style={{ color: 'red' }} onClick={() => handleDeletePost(post.id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleNewPostSubmit}>
        <textarea
          value={newPostContent}
          onChange={e => setNewPostContent(e.target.value)}
          placeholder="Write your post here..."
        />
        <button type="submit">Create New Post</button>
        <button onClick={props.onClose} type="button">Close</button>
      </form>
    </div>
  );
}

export default ThreadDetail;
