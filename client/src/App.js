import { useState } from 'react';
import './App.css';
import socket from './components/Socket';
import Chat from './components/Chat';

function App() {

  const [user, setUser] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (user) {
      setLoggedIn(true);
    }
  };

  return (
    <div className="App">
      {
        loggedIn ? (<Chat name={user} />) : (
          <form onSubmit={login}>
            <label htmlFor="">Enter your name</label>
            <input value={user} onChange={e => setUser(e.target.value)} />
            <button onClick={login}>Submit</button>
          </form>
        )
      }

    </div>
  );
};

export default App;
