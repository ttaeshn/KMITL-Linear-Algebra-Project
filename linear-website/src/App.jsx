import React, { useState, useEffect } from 'react'
import api from './api'
import axios from 'axios';
import FormData from 'form-data';
import './App.css'

function App() {
	const [file, setFile] = useState(null);
	const [image, setImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	
	const handleChange = (e)=>{
		if (e.target.files && e.target.files[0]) {
			setFile(URL.createObjectURL(e.target.files[0]));
			setImage(e.target.files[0]);
		}
		document.getElementById("papaya").style.margin = "1rem auto 1rem auto";
	    }

	const [message, setMessage] = useState('');

	const handleSubmit = async (event) => {
		setIsLoading(true);
		event.preventDefault();
		if (!file) {
			alert("Please select a file first.");
			return;
		}

		
		let formData = new FormData();
		formData.append('file', image);
		
	    
		try {
			let config = {
				method: 'post',
				maxBodyLength: Infinity,
				url: 'http://localhost:8000/classify',
				headers: { 
				  'Content-Type': 'image'
				},
				data : formData
			};
			const res = await axios(config);
			const  response = JSON.stringify(res.data);
			console.log(res.data.message);
			
			setMessage(res.data.message);
			// const data = await response.json();
		} catch (error) {
			console.error('Error:', error);
			setMessage('Failed to classify image');
		}
		setIsLoading(false);
	};

	const sendTest = async (event) => {
		try {
			const response = await axios.post("http://localhost:8000/send-test", {
				message: "name"
			},  {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			console.log("successful la i sus",response)
		} catch (error) {
			console.error('Error:', error);
		}
	};


	// ถ้าจะใส่ api แล้ว แสดงผลออกให้ใส่มาที่ตรงนี้
	// function sendAPI(e){
	// 	console.log('Hello');
	// 	const response = async api.get('/')
	// }
	//

  return (
  	<>
	
	<main className=''> 
		<div className=''>
			<h1 className='text-3xl font-bold text-red-500 m-4'>นวัตกรรมช่วยคนกินแซ่บ</h1>
			<input className='m-4' type="file" onChange={handleChange} />
            		<img src={file} className='block max-w-2xl max-h-72 ' id='papaya' />
			<button className='btn m-4' onClick={handleSubmit}>submit</button>
			{/* <button className='btn m-4' onClick={sendTest}>Test</button> */}
			{isLoading ? <p>Loading...</p> : <p>{message}</p>}

		</div>
	</main>

	</>

	
	)
}

export default App
