import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Badge, Box, Button, Heading, IconButton, Input, InputGroup, InputRightElement, List, ListIcon, ListItem, Stack, Text, useBreakpointValue } from '@chakra-ui/react';
import { FaUser, FaRegSmile } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import socket from './Socket';
import useWindowDimensions from '../hooks/useWindowDimensions';
import chatSound from '../assets/sounds/sound.mp3';

const Chat = ({ name, room }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userTyping, setUserTyping] = useState('');
    const [users, setUsers] = useState([]);
    const { width: windowSizeWidth } = useWindowDimensions();
    const notiSound = useMemo(() => new Audio(chatSound), []);

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
            if (msg.name !== name) notiSound.play();
        });

        return () => { socket.off() };
    }, [messages, name, notiSound]);

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
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message) return;
        socket.emit('message', name, message);
        setMessage('');
    };

    //validate if it's my message
    const myMsg = (msg) => msg.name === name;
    //responsive breakpoint
    const breakpointSmMd = useBreakpointValue({ base: "sm", md: "md" })

    return (
        <Box w="100%" height="100vh">
            <Box d="flex" w="100%" h="90vh" p={4} color="white" position="relative">
                <Stack direction="row" spacing={3} w="100%">
                    <Stack direction="column" width="100%">
                        <Stack direction="row">
                            <Stack flex={1} height="100%">
                                <Heading ml={1} fontSize={{ base: "24px", sm: "18px", md: "20px", lg: "22px" }}>{room} Room</Heading>
                            </Stack>
                        </Stack>
                        <Box bg="gray.700" w="100%" h="100%" p={{ base: 2, md: 3 }} color="white" borderRadius={5}>
                            <Stack spacing={3} direction="column" padding={2} overflowY="auto" height={{ base: "72vh", md: "67vh" }} width="100%">
                                {messages.map((msg, index) => (
                                    <Box key={index} style={{ display: 'flex', justifyContent: myMsg(msg) ? 'flex-end' : 'flex-start' }}>
                                        <Stack backgroundColor="gray.600" borderRadius={myMsg(msg) ? ("12px 0px 12px 12px") : ("0px 12px 12px 12px")} p={{ base: 1.5, md: 2 }} height="auto" maxWidth="90%" spacing={0}>
                                            {myMsg(msg) ? (
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
                                            )}
                                            <Stack>
                                                <Text padding={1} fontWeight="600" fontSize={{ base: "xs", sm: "sm", md: "md" }} >{msg.message}</Text>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                ))}
                                <div ref={divRef}></div>
                            </Stack>
                            <Stack position="absolute" bottom="8">
                                {userTyping && (
                                    <Text fontWeight="600" fontStyle="italic" fontSize={{ base: "sm", md: "md" }} ml={1
                                    }>
                                        {`${userTyping} is typing...`}
                                    </Text>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                    {windowSizeWidth > 600 && (
                        <Stack direction="column" width="20wh" p={1}>
                            <Heading mb={2} textAlign="center" fontSize={{ base: "11px", sm: "11px", md: "13px", lg: "15px" }}> {`Users online (${users.length})`}
                            </Heading>
                            <Box w="100%" h="100%" p={2} color="white" borderRadius={5}>
                                <Stack overflowY="auto" overflowX="hidden" w="100%" height="100%" maxHeight="80vh" alignItems="center">
                                    <Stack spacing={4} direction="column" padding={{ base: 2, md: 4 }}>
                                        <List spacing={4}>
                                            {users.map((user, index) => (
                                                <ListItem key={index} d="flex" alignItems="center" >
                                                    <ListIcon as={FaUser} color="teal.300" boxSize={{ base: "11px", md: "15px" }} />
                                                    <Text fontWeight="600" fontSize={{ base: "10px", sm: "12px", md: "14px", lg: "16px", xl: "18px" }}>{user.name}</Text>
                                                </ListItem>))}
                                        </List>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>
                    )}
                </Stack>
            </Box>
            <Box as="form" p={4} d="flex" w="100%" h="10vh" justifyContent="center">
                <Stack width="100%" direction="row" spacing={1}>
                    <InputGroup size={breakpointSmMd}>
                        <Input
                            pr="4.5rem"
                            type="text"
                            placeholder="Type a message..."
                            size={breakpointSmMd}
                            bg="gray.700"
                            value={message} onChange={e => setMessage(e.target.value)}
                            variant="filled"
                            maxLength={150}
                        />
                        <InputRightElement width="2.5rem">
                            <IconButton
                                colorScheme="blue"
                                aria-label="Search database"
                                size={breakpointSmMd}
                                icon={<FaRegSmile />}
                                variant="ghost"
                            />
                        </InputRightElement>
                    </InputGroup>
                    <Button rightIcon={<IoSend />} size={breakpointSmMd} mb={2} colorScheme="messenger" onClick={handleSubmit} type="submit" disabled={!message}>Send</Button>
                </Stack>
            </Box>
        </Box>
    )
}

export default Chat;