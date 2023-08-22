import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useParams } from 'react-router-dom';

function ThreadDetail(props) {
  const [thread, setThread] = useState({});
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');  // New state for post content
  const backendURL = "http://ec2-3-27-169-155.ap-southeast-2.compute.amazonaws.com:3001";

  const id = props.id;

  useEffect(() => {
    fetch(`${backendURL}/threads/${id}`)
      .then(response => response.json())
      .then(data => setThread(data));

    fetch(`${backendURL}/threads/${id}/posts`)
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

    // Make the POST request to create a new post
    const response = await fetch(`${backendURL}/threads/${id}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: newPostContent,
        userId
      })
    });

    const result = await response.json();

    if (result) {
      // Add the new post to the local posts list to immediately display it
      setPosts([...posts, result]);
      setNewPostContent('');  // Clear the content
    }
  }

  return (
    <div>
      <h1>{thread.title} - <span className="author">{thread.user_id}</span></h1>
      <p>{thread.content}</p>
      <div>
        {posts.map(post => (
          <div key={post.id} className="post">
            <div className="postHeader">
              <span className="author">{post.user_id}</span> - <span className="timestamp">{new Date(post.created_at).toLocaleString()}</span>
            </div>
            <div>{post.content}</div>
          </div>
        ))}
      </div>
      {/* Form to add a new post */}
      <form onSubmit={handleNewPostSubmit}>
        <textarea
          value={newPostContent}
          onChange={e => setNewPostContent(e.target.value)}
          placeholder="Write your post here..."
        />
        <button type="submit">Create New Post</button>
      </form>
    </div>
  );
}


export default ThreadDetail;
