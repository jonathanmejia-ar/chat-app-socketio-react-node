import { Button, Heading, Input, Select, Stack } from '@chakra-ui/react';
import { useState } from 'react';
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
  };

  return (
    <>
      {
        loggedIn ? (<Chat name={user} room={room} />) : (
          <form onSubmit={login}>
            <Stack height="100vh" alignItems="center" justifyContent="center">
              <Stack direction="column" background="gray.700" p={12} rounded={6} spacing={3}>
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
              </Stack>
            </Stack>
          </form>
        )
      }
    </>
  );
};

export default App;