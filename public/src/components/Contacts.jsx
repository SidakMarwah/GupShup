import React, { useEffect, useState } from 'react';

const Contacts = ({ contacts, changeChat }) => {

	const [currentUserName, setCurrentUserName] = useState(undefined);
	const [currentUserImage, setCurrentUserImage] = useState(undefined);
	const [currentSelected, setCurrentSelected] = useState(undefined);

	useEffect(() => {
		// console.log(contacts);
		const fetchData = async () => {
			const data = await JSON.parse(localStorage.getItem("gupshup"));
			// console.log(data);
			setCurrentUserName(data.username);
			setCurrentUserImage(data.avatarImage);
			// console.log(currentUserName);
			// console.log(currentUserImage);
		};
		fetchData();
	}, []);

	const changeCurrentChat = (index, contact) => {
		setCurrentSelected(index);
		changeChat(contact);
	};

	return (
		<>
			{currentUserName && currentUserImage && (
				<div>
					<h1>Contacts</h1>
					<div className="flex flex-col space-y-1 mt-4 -mx-2 h-96 overflow-y-auto pr-1">
						{contacts.map((contact, index) => (
							<button
								key={contact._id}
								className={`flex flex-row items-center rounded-xl p-2 ${index === currentSelected ? 'bg-blue-300 text-black' : 'hover:bg-blue-300 hover:text-black'
									}`}
								onClick={() => changeCurrentChat(index, contact)}
							>
								<img
									src={`data:image/svg+xml;base64,${contact.avatarImage}`}
									alt={contact.username}
									className="h-8 w-8 rounded-full"
								/>
								<div className="ml-2 text-sm font-semibold">{contact.username}</div>
							</button>
						))}
					</div>
				</div>
			)}
		</>
	);
};

export default Contacts;