import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import HomePage from './containers/HomePage';
import SongsPage from './containers/SongsPage';
import SongViewer from './containers/SongViewer';
import AddSongPage from './containers/AddSongPage';
import UpdateSongPage from './containers/UpdateSongPage'; // Import UpdateSongPage
import UpdateSongForm from './containers/UpdateSongForm'; // Import UpdateSongForm
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        {/* Navigation bar */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/songs">Songs</Link></li>
            <li><Link to="/add-song">Add Song</Link></li> {/* Add navigation to AddSongPage */}
            <li><Link to="/update-songs">Update Songs</Link></li> {/* Add navigation to UpdateSongPage */}
          </ul>
        </nav>

        {/* Route configuration */}
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/add-song" component={AddSongPage} />
          <Route path="/songs" component={SongsPage} />
          <Route path="/song/:songName" component={SongViewer} />
          <Route path="/update-songs" component={UpdateSongPage} /> {/* Route for listing songs to update */}
          <Route path="/update-song/:songName" component={UpdateSongForm} /> {/* Route for the song update form */}
        </Switch>
      </div>
    </Router>
  );
};

export default App;
