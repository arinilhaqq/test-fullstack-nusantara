import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

const API_URL = 'host.docker.internal:8000/api'; 

async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error.response.data.errors);
    throw error;
  }
}

async function loginUser(userData) {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    localStorage.setItem("token", response.data.token)
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}

async function logoutUser() {
    try {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the session token in the Authorization header
        },
      };
      const response = await axios.delete(`${API_URL}/user/logout`, config);
      return response.data;
    } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
    }
}

async function showUser() {
    try {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/user`, config);
      return response.data;
    } catch (error) {
      console.error('Error show user:', error);
      throw error;
    }
}


async function fetchBooks() {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/books`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}

async function createBook(bookData) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${API_URL}/books/add`, bookData, {
        headers: {
          Authorization:  `Bearer ${token}`, 
        },
      });
      console.log('Book created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating book:', error.message);
      throw error
    }
  }

  async function updateBook(bookId, bookData) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`${API_URL}/books/${bookId}/edit`, bookData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Book updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Error updating book: ' + error.message); // Display the error message in a pop-up
      throw error;
    }
}
  
async function deleteBook(bookId) {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`${API_URL}/books/${bookId}`, {
            headers: {
            Authorization:  `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
}

async function fetchBook(bookId) {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/books/${bookId}`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
        return response.data;
    } catch (error) {
        console.error('Error fetching book:', error);
        throw error;
    }
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchBooksData();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, password_confirmation } = e.target.elements;
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    };
    try {
      const response = await registerUser(newUser);
      alert(response.message);
      e.target.reset();
    } catch (error) {
      alert('Error registering user');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    const userData = {
      email: email.value,
      password: password.value,
    };
    try {
      const response = await loginUser(userData);
      setUser(response.token);
      alert(response.message);
      e.target.reset();
    } catch (error) {
      alert('Invalid email or password');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      alert('Logout successful');
    } catch (error) {
      console.error('Error logging out user:', error);
      alert('Error logging out user');
    }
  };

  const handleSelectUser = async () => {
    try {
      const user = await showUser();
      setSelectedUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      alert('Error fetching user');
    }
  };  

//   const showUserData = async () => {
//     try {
//         const userData = await showUser();
//         selectedUser(userData);
//     } catch (error) {
//         console.error('Error fetching user data:', error);
//         alert('Error fetching user data');
//     }
//   };

  const handleClearSelectedUser = () => {
    setSelectedUser(null);
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    const { isbn, title, subtitle, author, published, publisher, pages, description, website } = e.target.elements;
    const newBook = {
      isbn: isbn.value,
      title: title.value,
      subtitle: subtitle.value,
      author: author.value,
      published: published.value,
      publisher: publisher.value,
      pages: pages.value,
      description: description.value,
      website: website.value
    };
    try {
      const response = await createBook(newBook);
      alert(response.message);
      e.target.reset();
      fetchBooksData();
    } catch (error) {
      alert('Error creating book');
    }
  };

  const handleUpdateBook = async (bookId, e) => {
    e.preventDefault();
    const { isbn, title, subtitle, author, published, publisher, pages, description, website } = e.target.elements;
    const updatedBook = {
        isbn: isbn.value,
        title: title.value,
        subtitle: subtitle.value,
        author: author.value,
        published: published.value,
        publisher: publisher.value,
        pages: pages.value,
        description: description.value,
        website: website.value
    };
    try {
      const response = await updateBook(bookId, updatedBook);
      alert(response.message);
      e.target.reset();
      fetchBooksData();
    } catch (error) {
      alert('Error updating book');
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const response = await deleteBook(bookId);
      alert(response.message);
      fetchBooksData();
    } catch (error) {
      alert('Error deleting book');
    }
  };

  const fetchBooksData = async () => {
    const token = localStorage.getItem("token")
    if (!!!token) return;
    try {
        const booksData = await fetchBooks();
        setBooks(booksData);
        } catch (error) {
        alert("hsi");
    }
    }

  const handleSelectBook = async (bookId) => {
    try {
      const book = await fetchBook(bookId);
      setSelectedBook(book);
    } catch (error) {
      console.error('Error fetching book:', error);
      alert('Error fetching book');
    }
  };

  const handleClearSelectedBook = () => {
    setSelectedBook(null);
  };

  return (
    <div className="container mt-5">
      {!user ? (
        <div className="row">
          <div className="col-md-6">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
               <div className="mb-3">
                 <input type="text" className="form-control" name="name" placeholder="Name" required />
               </div>
               <div className="mb-3">
                 <input type="email" className="form-control" name="email" placeholder="Email" required />
               </div>
               <div className="mb-3">
                 <input type="password" className="form-control" name="password" placeholder="Password" required />
               </div>
               <div className="mb-3">
                 <input
                  type="password"
                  className="form-control"
                  name="password_confirmation"
                  placeholder="Confirm Password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Register</button>
            </form>
          </div>
          <div className="col-md-6">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
               <div className="mb-3">
                 <input type="text" className="form-control" name="email" placeholder="Email" required />
               </div>
               <div className="mb-3">
                 <input type="password" className="form-control" name="password" placeholder="Password" required />
               </div>
               <button type="submit" className="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Welcome, User!</h2>
            <div>
              <button className="btn btn-primary me-2" onClick={handleSelectUser}>Detail User</button>
              <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
            </div>
          </div>
          {selectedUser ? (
            <>
              <div className="mb-3">
                <h2>User Details</h2>
                <button className="btn btn-secondary mb-3" onClick={handleClearSelectedUser}>Back</button>
                <div>
                  <strong>Id: </strong>
                  {selectedUser.id}
                </div>
                <div>
                  <strong>Name: </strong>
                  {selectedUser.name}
                </div>
                <div>
                  <strong>Email: </strong>
                  {selectedUser.email}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-3">
                <h2>Books</h2>
                <form onSubmit={handleCreateBook}>
                    <div className="row">
                    <div className="col-md-3">
                        <input type="text" className="form-control mb-3" name="isbn" placeholder="ISBN" required />
                        <input type="text" className="form-control mb-3" name="title" placeholder="Title" required />
                        <input
                        type="text"
                        className="form-control mb-3"
                        name="subtitle"
                        placeholder="Subtitle"
                        required
                      />
                      <input type="text" className="form-control mb-3" name="author" placeholder="Author" required />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control mb-3"
                        name="published"
                        placeholder="Published"
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-3"
                        name="publisher"
                        placeholder="Publisher"
                        required
                      />
                      <input
                        type="number"
                        className="form-control mb-3"
                        name="pages"
                        placeholder="Total Pages"
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-3"
                        name="description"
                        placeholder="Description"
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control mb-3"
                        name="website"
                        placeholder="Book Url"
                        required
                      />
                      <button type="submit" className="btn btn-primary">Create Book</button>
                    </div>
                  </div>

                </form>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>
                          <form onSubmit={(e) => handleUpdateBook(book.id, e)}>             
                             <div className="row">
                                <div className="col-md-3">
                                 <input type="text" className="form-control" name="isbn" placeholder="ISBN" required />
                                 <input type="text" className="form-control" name="title" placeholder="Title" required />
                                 <input
                                  type="text"
                                  className="form-control"
                                  name="subtitle"
                                  placeholder="Subtitle"
                                  required
                                />
                                <input
                                  type="text"
                                  className="form-control"
                                  name="author"
                                  placeholder="Author"
                                  required
                                />
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="published"
                                  placeholder="Published"
                                  required
                                />
                                <input
                                  type="text"
                                  className="form-control"
                                  name="publisher"
                                  placeholder="Publisher"
                                  required
                                />
                                <input
                                  type="number"
                                  className="form-control"
                                  name="pages"
                                  placeholder="Total Pages"
                                  required
                                />
                                <input
                                  type="text"
                                  className="form-control"
                                  name="description"
                                  placeholder="Description"
                                  required
                                />
                              </div>
                              <div className="col-md-3">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="website"
                                  placeholder="Book Url"
                                  required
                                />
                                <button type="submit" className="btn btn-success me-2">Update</button>
                              </div>
                            </div>
                          </form>
                          <button className="btn btn-primary" onClick={() => handleSelectBook(book.id)}>Detail</button>
                          <button className="btn btn-danger" onClick={() => handleDeleteBook(book.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {selectedBook && (
            <>
              <div className="mb-3">
                <h2>Book Details</h2>
                <button className="btn btn-secondary mb-3" onClick={handleClearSelectedBook}>Back</button>
                <div>
                  <strong>Title: </strong>
                  {selectedBook.title}
                </div>
                <div>
                  <strong>Subtitle: </strong>
                  {selectedBook.subtitle || 'N/A'}
                </div>
                <div>
                  <strong>Author: </strong>
                  {selectedBook.author || 'N/A'}
                </div>
                <div>
                  <strong>Published: </strong>
                  {selectedBook.published || 'N/A'}
                </div>
                <div>
                  <strong>Publisher: </strong>
                  {selectedBook.publisher || 'N/A'}
                </div>
                <div>
                  <strong>Pages: </strong>
                  {selectedBook.pages || 'N/A'}
                </div>
                <div>
                  <strong>Description: </strong>
                  {selectedBook.description || 'N/A'}
                </div>
                <div>
                  <strong>Website: </strong>
                  {selectedBook.website || 'N/A'}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
