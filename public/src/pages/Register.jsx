import React, { useEffect, useState } from 'react';
import axios from "axios";
import Logo from "../assets/Logo.png";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerRoute } from '../utils/APIRoutes';

const Register = () => {

	const navigate = useNavigate();

	const toastOptions = {
		position: "bottom-right",
		autoClose: 8000,
		pauseOnHover: true,
		draggable: true,
		theme: "dark",
	};

	useEffect(() => {

		if (localStorage.getItem('gupshup')) {
			navigate('/');
		}

	}, [])

	const [values, setValues] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: ""
	});

	const handleValidation = () => {
		const { password, confirmPassword, username, email } = values;
		if (password !== confirmPassword) {
			toast.error(
				"Password and confirm password should be same.",
				toastOptions
			);
			return false;
		} else if (username.length < 3) {
			toast.error(
				"Username should be greater than 3 characters.",
				toastOptions
			);
			return false;
		} else if (password.length < 8) {
			toast.error(
				"Password should be equal or greater than 8 characters.",
				toastOptions
			);
			return false;
		} else if (email === "") {
			toast.error("Email is required.", toastOptions);
			return false;
		}

		return true;
	};


	const handleSubmit = async (event) => {
		event.preventDefault();
		if (handleValidation()) {
			const { email, username, password } = values;
			const { data } = await axios.post(registerRoute, {
				username,
				email,
				password,
			});

			// console.log(data);
			// console.log(data.data);

			if (data.status === false) {
				toast.error(data.msg, toastOptions);
			}
			if (data.status === true) {
				localStorage.setItem(
					"gupshup",
					JSON.stringify(data.data)
				);
				navigate("/setavatar");
			}
		};
	};

	const handleChange = (event) => {
		setValues({ ...values, [event.target.name]: event.target.value });
	};

	return (
		<>
			<div className="flex items-center justify-center h-screen bg-gray-900 text-white">
				<form className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-lg" onSubmit={(e) => handleSubmit(e)}>
					<div className="text-center mb-8">
						<img src={Logo} alt="logo" className="w-12 mb-4 mx-auto" />
						<h1 className="text-3xl font-semibold text-gray-300">GupShup</h1>
					</div>
					<div className="mb-4">
						<input
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 bg-gray-700 text-white"
							type="text"
							placeholder="Username"
							name="username"
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<div className="mb-4">
						<input
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 bg-gray-700 text-white"
							type="email"
							placeholder="Email"
							name="email"
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<div className="mb-4">
						<input
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 bg-gray-700 text-white"
							type="password"
							placeholder="Password"
							name="password"
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<div className="mb-4">
						<input
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 bg-gray-700 text-white"
							type="password"
							placeholder="Confirm Password"
							name="confirmPassword"
							onChange={(e) => handleChange(e)}
						/>
					</div>
					<button
						className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200 bg-blue-800 text-white hover:bg-blue-600"
						type="submit"
					>
						Create User
					</button>
					<div className="mt-4 text-center">
						<span className="text-gray-400">
							Already have an account? <Link to="/login" className="text-blue-300 hover:underline">Login</Link>
						</span>
					</div>
				</form>
			</div>

			<ToastContainer />

		</>
	)
};

export default Register