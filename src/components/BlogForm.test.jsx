import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './blogForm'
import { vi } from 'vitest'

describe('BlogForm component', () => {
  let mockCreateBlog

  beforeEach(() => {
    mockCreateBlog = vi.fn()
    render(<BlogForm createBlog={mockCreateBlog} />)
  })

  test('calls createBlog with the right details when a new blog is created', async () => {
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Title:'), 'Blog 1')
    await user.type(screen.getByLabelText('Author:'), 'Author 1')
    await user.type(screen.getByLabelText('URL:'), 'exampleblog.com')
    
    const save = screen.getByText('save')
    await user.click(save)

    expect(mockCreateBlog).toHaveBeenCalled()
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Blog 1',
      author: 'Author 1',
      url: 'exampleblog.com'
    })
  })
})
