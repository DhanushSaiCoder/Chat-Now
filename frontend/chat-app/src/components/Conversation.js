import React, { useState, useEffect } from 'react';
import '../styles/Conversation.css'
import defaultProfile from '../profiles/defaultProfile.jpg';


const Conversation = (props) => {
    const { userName, userId, lastMessage, displayMessages } = props;
    const baseURL = 'http://localhost:5000';
    const token = localStorage.getItem('token');

    const [messagesData, setMessagesData] = useState([]);
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId ] = useState('')
    var trimmedLastMessage;
    const openConversation = () => {
        if (!token) {
            console.error("Token is missing");
            return;
        }
        //get messages and format them;

        fetch(`${baseURL}/message/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('messages: ', data);
                if(data.length){
                    setConversationId(data[0].conversationId)

                }
                else{
                    //fetch data
                    fetch(`${baseURL}/conversation/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then((data) => {
                            console.log('conversation doc: ', data);
                            setConversationId(data._id)
                            console.log("fetchedID", conversationId)
                          
                        })
                        .catch((error) => {
                            console.error('Error fetching messages:', error);
                        });
                
                }
                setMessagesData(data);
            })
            .catch((error) => {
                console.error('Error fetching messages:', error);
            });
            props.togglePage()
    };

    useEffect(() => {
        const msg = [];
        messagesData.forEach((message) => {
            if (message.reciverId === userId) {
                msg.push({
                    message: message.message,
                    sender: "user"
                });
            } else {
                msg.push({
                    message: message.message,
                    sender: "otherUser"
                });
            }
        });

        console.log('messages: ', msg);

        setMessages(msg);
    }, [messagesData]);

    if(lastMessage)
        trimmedLastMessage = lastMessage.slice(0,17) + '...'
    useEffect(() => {
        console.log('sending conversationID: ', conversationId)
        displayMessages(messages,userName,userId,conversationId)
    }, [messages])
    return (
        <div onClick={openConversation} className='conversation'>
            <img className='profilePic' src={defaultProfile} alt="profile" />
            <div className='userDetailsDiv'>
                <h4>{userName}</h4>
                <p className='lastMessage'>{lastMessage}</p>
            </div>
        </div>
    );
};



export default Conversation;