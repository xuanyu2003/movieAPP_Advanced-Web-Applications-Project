import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import Reviews from './components/Reviews';
import Groups from './components/Groups';
import Showtimes from './components/Showtimes';
import MoviePage from './components/MoviePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import SearchPage from './components/SearchPage';
import UserPage from './components/UserPage';
import Notifications from './components/Notifications';
import GroupPage from './components/GroupPage';
import PublicFavoritesPage from './components/PublicFavoritesPage';
import CreateGroup from './components/Creategroup';
import { Toaster } from 'react-hot-toast';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  

  return (
    <div className="App">
      <Router>
      <Header setSelectedMovie={setSelectedMovie} />
      <Toaster />
        <Routes>
          <Route path="/" element={<Home setSelectedMovie={setSelectedMovie} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/MoviePage/:movieId" element={<MoviePage />} />
          {/* <Route path="/GroupPage" element={<GroupPage />} /> */}

          <Route path="/group/:groupId" element={<GroupPage />} />

          <Route path="/showtimes" element={<Showtimes />} />
          <Route path="/search" element={<SearchPage setSelectedMovie={setSelectedMovie} />} />
          <Route path="/user" element={<UserPage setSelectedMovie={setSelectedMovie} />} />
          <Route path='/notifications' element={<Notifications/>} />
          <Route path='/ResetPassword' element={<ResetPassword/>} />
          <Route path='/publicFavorites/:userId' element={<PublicFavoritesPage/>} />
          <Route path='/createGroup' element={<CreateGroup/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;