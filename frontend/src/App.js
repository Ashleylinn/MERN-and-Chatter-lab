import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { Login } from './components/login';
import { Register } from './components/register';
import { CreatePost } from './components/createPost';
import { config } from './config';
import { Post } from './components/post';

const { apiURL } = config;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [formState, setFormState] = useState(-1);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadRef = useRef(false);
  const hasMoreRef = useRef(true);
  const offsetRef = useRef(0);

  function toggleLogin() {
    if (formState === 0) {
      setFormState(-1);
    }
    else {
      setFormState(0);
    }
  }
  function toggleRegister() {
    if (formState === 1) {
      setFormState(-1);
    }
    else {
      setFormState(1);
    }
  }
  async function logout() {
    const response = await fetch(`${apiURL}/users/logout`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      console.error('Failed to log out');
    }
    setLoggedIn(false);
    setUser({});
    window.location.href = '/';
  }

  async function fetchPosts(reset = false) {
    if(loadRef.current || !hasMoreRef.current) return;
    
    if(reset){
      setPosts([]);
      setOffset(0);
      offsetRef.current = 0;
      setHasMore(true);
      hasMoreRef.current = true;
    }

    setLoading(true);
    loadRef.current = true;
    try{
      const response = await fetch(`${apiURL}/posts?limit=10&offset=${offsetRef.current}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        if(data.posts.length === 0){
          setHasMore(false);
          hasMoreRef.current = false;
        }else{
          setPosts(prev => [...prev, ...data.posts]);
          const newOff = offsetRef.current + data.posts.length;
          setOffset(newOff);
          offsetRef.current = newOff;
        } 
      } else {
        console.error(data.error);
      }
    }catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      loadRef.current = false;
    } 
  }
  
  useEffect(() => {
    let ignore = false;
    async function me() {
      /* 
      * TODO: Implement checking if the user is logged in
      * This function should set the "loggedIn" state variable to true if the user is logged in and false otherwise.
      * HINT: You can use the /users/me endpoint.
      */
      try {
        const response = await fetch(`${apiURL}/users/me`, {
          headers: {
            'content-type': 'application/json'
          },
          credentials: 'include'
        });

        if(response.ok){
          const data = await response.json();
          setLoggedIn(true);
          setUser(data);
        }else{
          setLoggedIn(false);
        }
      }catch (err){
        console.error(err);
        setLoggedIn(false);
        setUser({});
      }
    }

    me();
    fetchPosts();

    const handlescroll = () => {
      if(
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100
      ) {
        fetchPosts();
      }
    };

    window.addEventListener('scroll', handlescroll);

    return () => {
      window.removeEventListener('scroll', handlescroll);
    };
  }, []);

  return (
    <div className="App">
      <Navbar expand="lg" className="">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {
                loggedIn ?
                <Nav.Link onClick={logout}>
                  <strong>Logout</strong>
                </Nav.Link>
                :
                <>
                  <Nav.Link onClick={toggleLogin}>
                    <strong>Login</strong>
                  </Nav.Link>
                  <Nav.Link onClick={toggleRegister}>
                    <strong>Register</strong>
                  </Nav.Link>
                </>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <h1>Chatter Blog</h1>
      {
        formState === 0 ? (
          <Login onLoginSuccess={() => {
            setLoggedIn(true);
            setFormState(-1);
            setPosts([]);
            setOffset(0);
            setHasMore(true);
            offsetRef.current = 0;
            hasMoreRef.current = true;
            fetchPosts(true);
          }} />
        ):formState === 1 ? (
          <Register />
        ) : null
      }

      {loggedIn && formState === -1 && (
        <>
          <CreatePost onPostCreate={() => {
            setPosts([]);
            setOffset(0);
            setHasMore(true);
            offsetRef.current = 0;
            hasMoreRef.current = true;
            fetchPosts(true);
          }} />
          <div className='posts-container'>
            {posts.map((post, index) => (
              <Post key={index} post={post}/>
            ))}
            {!hasMore && (
              <div>
                No more posts to load!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
export default App;
