import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { config } from '../config.js';
const { apiURL }  = config;

export const Register = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function updateUsername(e) {
    setUsername(e.target.value);
  }

  function updatePassword(e) {
    setPassword(e.target.value);
  }

  async function register(e) {
    e.preventDefault();
    setStatusMessage('');
    // TODO: Implement the registration functionality
    try {
      const response = await fetch(`${apiURL}/users/register`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const data = await response.json();
      if(response.status === 201){
        setStatusMessage('Registration successful!');
      }else {
        setStatusMessage(`${data.error}`);
      }
    }catch (error){
      console.error(error);
      setStatusMessage('Something is wrong, try again later.');
    }
  }
  
  return (
    <Form className='login-form' onSubmit={register}>
      <Form.Group className="mb-3" controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control type="username" placeholder="Username" name='username' value={username} onChange={updateUsername}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" name='password' value={password} onChange={updatePassword}/>
      </Form.Group>
      <button className='form-button' type="submit">
        Register
      </button>
      <span>{statusMessage}</span>
    </Form>
  )
}