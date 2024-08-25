import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'
import blogService from '../services/blogs'
vi.mock('../services/blogs') 

describe('Blog component', () => {
  let mockUpdateBlog
  const blog = {
    id: '1',
    title: 'BlogTest',
    author: 'Nart',
    url: 'http://nart.com',
    likes: 120,
    user: {
      id: '2',
      name: 'Nart Kosova',
      username: 'nart'
    }
  }

  beforeEach(() => {
    mockUpdateBlog = vi.fn()
    blogService.update = vi.fn().mockResolvedValue(blog) // Mock the update function
    render(<Blog blog={blog} updateBlog={mockUpdateBlog} handleDelete={() => {}} />)
  })


  test('renders title and author, but not url or likes by default', () => {
    const titleElement = screen.getByText('BlogTest Nart')
    expect(titleElement).toBeVisible()

    const urlElement = screen.queryByText('http://nart.com')
    const likesElement = screen.queryByText('120 likes')

    expect(urlElement).not.toBeInTheDocument()
    expect(likesElement).not.toBeInTheDocument()
  })

  test('after clicking view, likes and url are shown', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText('http://nart.com')
    const likesElement = screen.getByText('120 likes')

    expect(urlElement).toBeVisible()
    expect(likesElement).toBeVisible()
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
 
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
  
  })
})

