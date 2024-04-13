import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import ChatInput from './ChatInput'
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";


const ChatContainer = ({ currentUser, currentChat, socket }) => {

  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {

    if (currentChat) {
      const fetchData = async () => {
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
        // console.log(response.data);
      }

      fetchData();
    }

  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg
    });

    socket.current.emit("send-msg", {
      from: currentUser._id,
      to: currentChat._id,
      message: msg
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    // console.log(scrollRef.current);
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>

      <div className="flex flex-col flex-auto h-full p-6">
        {/* Container for current user */}
        <div className="flex items-center mb-4">
          <img
            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
            alt={currentChat.username}
            className="h-10 w-10 rounded-full"
          />
          <div className="ml-2 text-lg font-semibold">{currentChat.username}</div>
        </div>
        <hr className='border-gray-400' />
        <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-800 p-4">
          <div className="flex flex-col h-full overflow-x-auto mb-4">
            <div className="flex flex-col h-full">
              <div className="grid grid-cols-12 gap-y-2 max-h-[475px] overflow-y-auto">

                {
                  messages.map((message, index) => (
                    <div ref={scrollRef} key={index} className={`${message.fromSelf ? "col-start-6 col-end-13" : "col-start-1 col-end-8"} p-3 rounded-lg`}>
                      <div className={`flex flex-row items-center ${message.fromSelf ? "justify-start flex-row-reverse" : ""}`}>
                        <img
                          src={`data:image/svg+xml;base64,${message.fromSelf ? currentUser.avatarImage : currentChat.avatarImage}`}
                          alt={`${message.fromSelf ? currentUser.avatarImage : currentChat.avatarImage}`}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className={`relative ${message.fromSelf ? "mr-3 bg-blue-500" : "ml-3 bg-gray-700"} text-sm py-2 px-4 shadow rounded-xl`}>
                          <div>{message.message}</div>
                        </div>
                      </div>
                    </div>
                  ))
                }

              </div>
            </div>
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </div>
      </div>
    </>
  )
}

export default ChatContainer