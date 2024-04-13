import React, { useEffect, useState } from 'react';
import axios from "axios";
import Loader from "../assets/Loader.gif";
import { Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from "buffer";

const SetAvatar = () => {

  const api = "https://api.multiavatar.com";
  const navigate = useNavigate();

  const [avatarOptions, setAvatarOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Set Profile Picture

    if (selectedAvatar === undefined) {
      toast.error("Please select  an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("gupshup"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatarOptions[selectedAvatar]
      });

      // console.log(avatarOptions[selectedAvatar]);
      // console.log(data);
      // console.log(data.image);

      if (data) {
        // console.log(data.image);
        user.isAvatarImageSet = true;
        // console.log(data.image);
        user.avatarImage = data.image;
        // console.log(user.avatarImage);
        localStorage.setItem("gupshup", JSON.stringify(user));
        // user.avatarImage = avatarOptions[selectedAvatar];
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try  again", toastOptions);
      }

    }

    // console.log('Selected Avatar:', selectedAvatar);
  };

  const fetchData = async () => {
    try {
      const data = [];

      for (let i = 0; i < 4; i++) {
        const url = `${api}/${Math.round(Math.random() * 1000)}`;
        // console.log(url);
        const image = await axios.get(url);
        const buffer = Buffer.from(image.data);
        data.push(buffer.toString("base64"));
      }

      // console.log(data);

      setAvatarOptions(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching avatar data:', error);
      // Handle error as needed
    }
  };

  const handleAvatarSelection = (index) => {
    setSelectedAvatar(index);
  };

  const handleReloadAvatars = () => {
    fetchData();
  };

  useEffect(() => {

    if (!localStorage.getItem('gupshup')) {
      navigate('/login');
    }
    fetchData();
  }, []); // Run on mount



  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <img src={Loader} alt="Loader" />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-semibold text-gray-300 mb-6">Choose Your Avatar</h1>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {avatarOptions.map((avatar, index) => (
                  <div
                    key={index}
                    onClick={() => handleAvatarSelection(index)}
                    className={`cursor-pointer rounded-full overflow-hidden ${selectedAvatar === index
                      ? 'border-4 border-blue-500 shadow-md'
                      : ''
                      }`}
                  >
                    <img
                      src={`data:image/svg+xml;base64,${avatar}`}
                      alt={`Avatar ${index + 1}`}
                      className="border-4 border-transparent shadow-md w-full h-full object-cover rounded-full "
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Submit
              </button>

              <button
                onClick={handleReloadAvatars}
                className="w-full bg-gray-500 text-white py-2 mt-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-200"
              >
                Reload Avatars
              </button>
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  )
}

export default SetAvatar