import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/blogForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [isError, setIsError] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
   useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('wrong username or password')
      setIsError(true)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }
  const handleLogout = async (event) => {
    event.preventDefault()
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      setUser(null)
      setUsername('')
      setPassword('')
    }   
    const addBlog = (event) => {
      event.preventDefault()
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl
      }
      blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
          setNotification(`A new blog '${returnedBlog.title}' by ${returnedBlog.author} has been added`)
          setIsError(false)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          setNotification('Failed to add blog')
          setIsError(true);
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  
    const handleTitleChange = (event) => {
      setNewTitle(event.target.value)
    }
  
    const handleAuthorChange = (event) => {
      setNewAuthor(event.target.value)
    }
  
    const handleUrlChange = (event) => {
      setNewUrl(event.target.value)
    }
  if (user === null) {
    return (
      <div>
        <Notification message={notification} isError={isError} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
        <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <Notification message={notification} isError={isError} />
      <h2>blogs</h2>
      <p>{user.name} is logged in <button onClick={handleLogout}>logout</button></p>
      <BlogForm
       addBlog={addBlog}
       newTitle={newTitle}
       handleTitleChange={handleTitleChange}
       newAuthor={newAuthor}
       handleAuthorChange={handleAuthorChange}
       newUrl={newUrl}
       handleUrlChange={handleUrlChange}/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App