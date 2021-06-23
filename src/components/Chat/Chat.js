import React, {useState, useEffect} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'
import './Chat.css' //HARUS ADA DIATAS SOCKET
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'

let socket


const Chat = ({location}) => {

const [name, setName] = useState('')
const [room, setRoom] = useState('')
const [messages, setMessages] = useState([])
const [message, setMessage] = useState('')
const [users, setUsers] = useState('')
// const ENDPOINT = 'localhost:5000'

const ENDPOINT = 'https://realtime-chat-with-react.herokuapp.com/'

    useEffect(() => {
        const {name, room} = queryString.parse(location.search)

        socket = io(ENDPOINT)
        
        // console.log(data)
        // console.log(name, room)
       
        setName(name)
        setRoom(room)

        socket.emit('join', { name, room}, () => {

        })

        // console.log(socket)
        return () => {
            // socket.emit('disconnect')
            socket.disconnect()

            socket.off()
        }
    }, [ENDPOINT, location.search])


    useEffect(() => {
        socket.on('message', (message) => {
                setMessages([...messages, message])
    })

    socket.on('roomData', ({users}) => {
        setUsers(users)
    })

}, [messages])


    // function for sending messages
    const sendMessage = (event) => {
        event.preventDefault()

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(message, messages)

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                {/* jangan sampai terbalik urutannya */}
                <Messages messages={messages} name={name} /> 
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
               
               
            </div>
            {/* harus diluar div wkwkwkwkwk */}
            <TextContainer users={users} /> 
        </div>
    )
}

export default Chat

