import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useCookies } from 'react-cookie';
import { config } from '../config.js';
const { apiURL }  = config;

export const CreatePost = ({ onPostCreate }) => {
  const [cookies, setCookie] = useCookies(['session_id']);
  const [content, setContent] = useState('');

  function updateContent(e) {
    setContent(e.target.value);
  }

  async function createPost(e) {
    e.preventDefault();
    // TODO: Implement the post functionality
    try{
      const response = await fetch(`${apiURL}/posts`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ content }),
        credentials: 'include'
      });
  
      const data = await response.json();
      if(response.status === 201) {
        setContent('');
        if(onPostCreate){
          onPostCreate();
        }
      } else {
        console.error('Failed: ${data.error}');
      }
    }catch (err) {
      console.error(err);
    }
  }
  return (
    <Form className='login-form' onSubmit={createPost}>
      <Form.Group className="mb-3" controlId="formBasicContent">
        <Form.Control as="textarea" rows={3} placeholder="Say something fun!" name='content' value={content} onChange={updateContent}/>
      </Form.Group>
      <button className='form-button' type="submit">
        Post
      </button>
    </Form>
  )
}