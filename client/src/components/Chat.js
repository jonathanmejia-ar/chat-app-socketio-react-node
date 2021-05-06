import React, { useEffect, useState, useRef } from 'react'
import socket from './Socket'
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

    )
}

export default Chat;
