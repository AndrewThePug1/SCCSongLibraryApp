import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import HomePage from './containers/HomePage'
import SongsPage from './containers/SongsPage'
import SongViewer from './containers/SongViewer'
import './App.css'
import AddSongPage from './containers/AddSongPage'
const App = () => {
  return (
    <Router>
      <div>
        {/* Navigation bar */}
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/songs">Songs</Link></li>
          </ul>
        </nav>

        {/* Route configuration */}
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path = "/add-song" component={AddSongPage} />
          <Route path="/songs" component={SongsPage} /> {/* Corrected this line */}
          <Route path="/song/:songName" component={SongViewer} /> {/* Ensure this is the path you use */}

        </Switch>
      </div>
    </Router>
  );
};

export default App;
