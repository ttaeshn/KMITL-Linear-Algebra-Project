import React, { useState, useEffect, useRef } from 'react'
import { SpeakerWaveIcon } from "@heroicons/react/24/outline"
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid"

// import { backgroundMusic } from "./assets/background-music-cut.mp3"

import axios from 'axios';

import FormData from 'form-data';
import './App.css'

function App() {
	const [file, setFile] = useState(null);
	const [image, setImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef(new Audio('/background-music-cut.mp3'));

	// const BackgroundAudio = new Audio("src/background-music-cut.mp3");

	useEffect(() => {
		const BackgroundAudio = audioRef.current;
		if (!isPlaying) {
		BackgroundAudio.addEventListener('ended', () => {
			BackgroundAudio.currentTime = 0;
			BackgroundAudio.play();          // เล่นเพลงใหม่
		});
	    
		return () => {
			BackgroundAudio.removeEventListener('ended', () => {});
		};
		}
	}, []);

	const handlePlayPause = () => {
		const BackgroundAudio = audioRef.current;
		if (isPlaying) {
			BackgroundAudio.pause(); // หยุดเพลง
		} else {
			BackgroundAudio.play();  // เล่นเพลง
		}
		setIsPlaying(!isPlaying); // สลับสถานะการเล่น
	};

	

	
	const handleChange = (e)=>{
		if (e.target.files && e.target.files[0]) {
			setFile(URL.createObjectURL(e.target.files[0]));
			setImage(e.target.files[0]);
		}
		document.getElementById("papaya").style.margin = "auto auto auto auto";
	    }

	const [message, setMessage] = useState('');

	const handleSubmit = async (event) => {
		
		event.preventDefault();
		if (!file) {
			alert("Please select a file first.");
			return;
		} else {
			setIsLoading(true);
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

  return (
  	<>
	
	<main className=''> 
		<div className='b'>
			<h1 className='text-3xl font-bold text-red-500 m-4'></h1>
			<div className='flex ml-auto mr-auto  absolute left-0 right-0' style={{width: "33rem", height: "288px", maxHeight: "288px"}}>
				
				<img src={file} className='object-contain mt-0 mb-0 align-middle justify-center' class="clearfix" id='papaya'  style={{maxHeight:"288px", lineHeight:"288px"}}/>
			</div>
            		
			<div className='pt-52  w-40' >
				<button onClick={handlePlayPause} className='relative'>
					{isPlaying ?  (
						<div className='h-28 w-40'/>
						// <PauseIcon className='h-28 w-40' aria-hidden="true"/>
					) :(
						<div className='h-28 w-40'/>
						// <PlayIcon className='h-28 w-40 bg-red-300' aria-hidden="true"/>
					)}
				</button>
			</div>
			
			<div>
				<label for="file-upload" class="custom-file-upload">
					อัปโหลดรูปภาพ
				</label>
				<input id="file-upload" type="file"   onChange={handleChange}/>
				{/* <input className='m-4 relative' type="file" onChange={handleChange} /> */}
				<button className='btn relative' onClick={handleSubmit}>ยืนยัน</button>
				{/* <button className='btn m-4' onClick={sendTest}>Test</button> */}
				{isLoading ? <p className='text-4xl mt-14'>Loading...</p> : <p className='text-4xl mt-14'>{message}</p>}
				{/* <audio ref={musicRef} loop src='./linear-website/public/background-music(cut).mp3'/> */}
			</div>
			

		</div>
	</main>

	</>

	
	)
}

export default App
