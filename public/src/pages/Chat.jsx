import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import Contacts from '../components/Contacts';
import { allUsersRoute, host } from '../utils/APIRoutes';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import Logout from '../components/Logout';

const Chat = () => {
    const navigate = useNavigate();
    const socket = useRef();
    const [contacts, setContacts] = useState(null);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        if (!localStorage.getItem('gupshup')) {
            navigate('/login');
        }
        const fetchAllUsers = async () => {
            const userData = JSON.parse(localStorage.getItem('gupshup'));
            setCurrentUser(userData);
            if (userData.isAvatarImageSet) {
                try {
                    const response = await axios.get(`${allUsersRoute}/${userData._id}`);
                    setContacts(response.data);
                    // console.log(response.data);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            } else {
                navigate('/setavatar');
            }
        };

        fetchAllUsers();
    }, []);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <div className="flex h-screen antialiased text-white bg-gray-900">
            <div className="flex flex-row h-full w-full overflow-x-hidden">
                <div className="flex flex-col py-8 pl-6 pr-6 w-72 bg-gray-800 flex-shrink-0">
                    <div className="flex flex-row items-center justify-center h-12 w-full">
                        <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                ></path>
                            </svg>
                        </div>
                        <div className="ml-2 font-bold text-2xl">GupShup</div>
                    </div>

                    {contacts !== null && (
                        <div className="mt-8">
                            <Contacts contacts={contacts} changeChat={handleChatChange} />
                        </div>
                    )}
                    <div className="mt-8 bg-gray-700 p-2 rounded-md border-2 border-blue-500">
                        {currentUser && currentUser.avatarImage && (<div className='mt-2 flex items-center justify-center gap-2'>
                            <img
                                src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                                alt={currentUser.username}
                                className="h-10 w-10 rounded-full border-2 border-white "
                            />
                            <p className='text-white text-2xl'>
                                {currentUser.username}
                            </p>
                        </div>)}
                        <div className="mt-6 flex items-center justify-center">
                            <Logout />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-auto h-full p-6">
                    <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-800 h-full p-4">
                        {currentChat === undefined ? <Welcome /> : <ChatContainer currentUser={currentUser} currentChat={currentChat} socket={socket} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat;
