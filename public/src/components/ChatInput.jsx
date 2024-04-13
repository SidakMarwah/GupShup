import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const ChatInput = ({ handleSendMsg }) => {

    const [msg, setMsg] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(prevState => !prevState);
    };


    const handleEmojiClick = (emojiObject, event) => {
        setMsg(prevMsg => prevMsg + emojiObject.emoji);
    };

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        }
    };

    return (
        <>
            <form onSubmit={(e) => sendChat(e)} className="flex flex-row items-center h-16 rounded-xl bg-gray-800 w-full px-4 relative">
                <div className="flex-grow ml-4">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10 bg-gray-700"
                            placeholder="type your message here"
                            onChange={(e) => setMsg(e.target.value)}
                            value={msg}
                        />
                        <button type='button' onClick={handleEmojiPickerhideShow} className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
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
                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="ml-4">
                    <button type='submit' className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                        <span>Send</span>
                        <span className="ml-2">
                            <svg
                                className="w-4 h-4 transform rotate-45 -mt-px"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                ></path>
                            </svg>
                        </span>
                    </button>
                </div>
                <div className='absolute bottom-16 right-20 '>
                    {showEmojiPicker && <EmojiPicker
                        theme='dark'
                        onEmojiClick={handleEmojiClick}
                    />}
                </div>
            </form>
        </>
    )
}

export default ChatInput