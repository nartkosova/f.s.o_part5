import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleAuthorChange = (event) => setNewAuthor(event.target.value)
  const handleUrlChange = (event) => setNewUrl(event.target.value)

  const addBlog = (event) => {
    event.preventDefault()
    console.log({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <label>
          Title:
          <input
             data-testid='title'
            value={newTitle}
            onChange={handleTitleChange}
          />
        </label>
        <label>
          Author:
          <input
             data-testid='author'
            value={newAuthor}
            onChange={handleAuthorChange}
          />
        </label>
        <label>
          URL:
          <input
             data-testid='url'
            value={newUrl}
            onChange={handleUrlChange}
          />
        </label>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm
