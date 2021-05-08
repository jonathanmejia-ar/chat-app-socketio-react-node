import React, { useEffect, useState, useRef } from 'react';
import { Badge, Box, Button, Flex, Heading, List, ListIcon, ListItem, Stack, Text, Textarea } from '@chakra-ui/react';
import { FiSend } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import socket from './Socket';
import '../App.css';

const Chat = ({ name, room }) => {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userTyping, setUserTyping] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.emit('connected', name, room);
    }, [name, room]);

    useEffect(() => {
        socket.on('users-online', (users) => {
            setUsers(users);
        });
    });

    useEffect(() => {
        socket.on('messages', msg => {
            setMessages([...messages, msg]);
        })

        return () => { socket.off() };
    }, [messages]);

    useEffect(() => {
        if (message.length !== 0) {
            socket.emit('typing', name);
        } else {
            socket.emit('typing', '');
        }
    }, [message, name]);

    useEffect(() => {
        socket.on('user-typing', user => {
            setUserTyping(user);;
        });
    });

    const divRef = useRef(null);
    useEffect(() => {
        divRef.current.scrollIntoView({ behavior: 'smooth' });
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message) return;
        socket.emit('message', name, message);
        setMessage('');
    };

    return (
        <>
            <Box d="flex" w="100%" h="75vh" p={4} color="white" position="relative">
                <Stack direction="row" spacing={3} w="100%" justifyContent="center">
                    <Flex direction="column" maxWidth="700px" width="100%">
                        <Heading mb={6}> Chat {room}</Heading>
                        <Box bg="gray.700" w="100%" h="100%" p={4} color="white" borderRadius={10}>
                            <Stack spacing={3} direction="column" padding={2} overflowY="auto" minHeight="50vh" maxHeight="50vh">
                                {messages.map((msg, index) => (
                                    <Box key={index} style={{ display: 'flex', justifyContent: msg.name === name ? 'flex-end' : 'flex-start' }}>
                                        <Box backgroundColor="gray.600" borderRadius={10} p={1.5} height="auto" maxWidth="100%" >
                                            {msg.name === name ? (
                                                <Stack direction="row" justifyContent="flex-end">
                                                    <Box color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="xs" textTransform="uppercase" ml="2">
                                                        {msg.time}
                                                    </Box>
                                                    <Badge borderRadius="full" px="2" colorScheme="teal" textTransform="none">Me</Badge>

                                                </Stack>
                                            ) : (
                                                <Stack direction="row" justifyContent="flex-start">
                                                    <Badge borderRadius="full" px="2" colorScheme="teal" textTransform="none"> {msg.name}</Badge>
                                                    <Box color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="xs" textTransform="uppercase" ml="2">
                                                        {msg.time}
                                                    </Box>

                                                </Stack>
                                            )
                                            }
                                            <Stack>
                                                <Text padding={1} fontWeight="600">{msg.message}</Text>
                                            </Stack>
                                        </Box>
                                    </Box>
                                ))}
                                <div ref={divRef}></div>
                            </Stack>
                            <Stack position="absolute" bottom="8">
                                {userTyping && (
                                    <Text fontWeight="600" fontStyle="italic">
                                        {`${userTyping} is typing...`}
                                    </Text>
                                )}
                            </Stack>
                        </Box>
                    </Flex>
                    <Flex direction="column" width="auto">
                        <Heading mb={6} textAlign="center"> Users</Heading>
                        <Box bg="gray.700" w="100%" h="100%" p={2} color="white" borderRadius={10} overflowY="auto">
                            <Stack spacing={4} direction="column" padding={4}>
                                <List spacing={4}>
                                    {users.map((user, index) => (
                                        <ListItem key={index} d="flex" alignItems="center" >
                                            <ListIcon as={FaUser} color="teal.300" />
                                            <Text fontWeight="600">{user.name}</Text>
                                        </ListItem>))}
                                </List>
                            </Stack>

                        </Box>
                    </Flex>
                </Stack>
            </Box>
            <Box p={4} d="flex" w="100%" justifyContent="center">
                <Stack maxWidth="850px" width="100%">
                    <Textarea resize="none" placeholder="Type your message..." rows="3" value={message} onChange={e => setMessage(e.target.value)} variant="filled" bg="gray.700" maxLength="70" />
                    <Button rightIcon={<FiSend />} mb={2} colorScheme="messenger" onClick={handleSubmit} type="submit">Send</Button>
                </Stack>

            </Box>
        </>
    )
}

export default Chat;

/*
 <div>
            <div className="chat-room">
                <div className="chat">
                    {messages.map((msg, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: msg.name === name ? 'flex-end' : 'flex-start' }} className="message-content">
                            <span>{`${msg.name === name ? 'Yo' : msg.name} : ${msg.message}`} </span>
                        </div>
                    ))}
                    {userTyping && (
                        <p className="typing">
                            {`${userTyping} is typing...`}
                        </p>
                    )}
                    <div ref={divRef}></div>
                </div>
                <div className="users-online">
                    <span style={{ fontWeight: '700' }}>Users Online</span>
                    <ul>
                        {users.map((user, index) => (<li key={index}> {user.name}</li>))}
                    </ul>
                </div>
            </div>

            <form>
                <label htmlFor="">Write a message</label>
                <textarea name="" id="" cols="30" rows="10" value={message} onChange={e => setMessage(e.target.value)} />
                <button onClick={handleSubmit} type="submit">Send</button>
            </form>
        </div>


        ///// input send
        <form onSubmit={handleSubmit}>
                    <InputGroup size="lg">
                        <Input
                            type="text"
                            placeholder="Type your message..."
                            bg="gray.700"
                            maxLength="50"
                            value={message} onChange={e => setMessage(e.target.value)}
                        />
                        <InputRightElement width="7rem">
                            <Button h="1.75rem" size="md" rightIcon={<FiSend />} colorScheme="messenger" type="submit" >
                                Send
                        </Button>
                        </InputRightElement>
                    </InputGroup>
                </form>
 */