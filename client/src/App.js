import { useState } from 'react';
import './App.css';
import Chat from './components/Chat';

function App() {

  const [user, setUser] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState('room1');

  const login = (e) => {
    e.preventDefault();
    handleSelectRoom();
    if (user) {
      setLoggedIn(true);
    }
  };

  const handleSelectRoom = () => {
    console.log(room);
  }

  return (
    <div className="App">
      {
        loggedIn ? (<Chat name={user} room={room} />) : (
          <form onSubmit={login}>
            <label htmlFor="">Enter your name</label>
            <input value={user} onChange={e => setUser(e.target.value)} />
            <select name="select" value={room} onChange={e => setRoom(e.target.value)}>
              <option value="room1">Room 1</option>
              <option value="room2">Room 2</option>
              <option value="room3">Room 3</option>
            </select>
            <button onClick={login}>Submit</button>
          </form>
        )
      }

    </div>
  );
};

export default App;
