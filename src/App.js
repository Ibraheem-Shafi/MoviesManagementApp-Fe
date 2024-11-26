import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';

import Home from './Components/Home';
import Signup from './Components/User/Signup';
import Profile from './Components/User/Profile';
import Verification from './Components/User/Verification';
import ForgotPassword from './Components/User/ForgotPassword';
import ResetPassword from './Components/User/ResetPassword';
import ResetPasswordEmailSent from './Components/User/ResetPasswordEmailSent';
import Login from './Components/User/Login';

import VideoDetails from './Components/VideoDetails';
import FavoritesPage from './Components/User/FavoritesPage';

import './App.css';
import { ThemeProvider } from "./ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verification/:userId" element={<Verification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/reset-password-email-sent" element={<ResetPasswordEmailSent />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/login" element={<Login />} />

            <Route path="/movie/:id" element={<VideoDetails />} />
            <Route path="/favorites/:userId" element={<FavoritesPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
