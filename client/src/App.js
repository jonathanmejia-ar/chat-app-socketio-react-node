import { Button, Flex, Heading, Input, Select, Stack, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import './App.css';
import Chat from './components/Chat';

function App() {

  const [user, setUser] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState('Technology');

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

  const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue("blue.100", "gray.700");

  return (
    <div className="App">
      {
        loggedIn ? (<Chat name={user} room={room} />) : (
          <form onSubmit={login}>
            <Flex height="100vh" alignItems="center" justifyContent="center">
              <Flex direction="column" background={formBackground} p={12} rounded={6}>
                <Heading mb={6}>Join Chat Room</Heading>
                <Input placeholder="Nickname" variant="filled" mb={3} type="text" value={user} onChange={e => setUser(e.target.value)} />
                <Stack marginBottom="3">
                  <Select size="md" variant="filled" value={room} onChange={e => setRoom(e.target.value)}>
                    <option value="Technology">Technology </option>
                    <option value="Games">Games </option>
                    <option value="Sports">Sports </option>
                  </Select>
                </Stack>
                <Button mb={6} colorScheme="messenger" onClick={login}>Join</Button>
                <Button onClick={toggleColorMode}> Toggle Color Mode</Button>
              </Flex>
            </Flex>
          </form>
        )
      }
    </div>
  );
};

export default App;

/*
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
*/