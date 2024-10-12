import { useState } from 'react'
import './App.css'


function App() {
	const [file, setFile] = useState();
	function handleChange(e) {
	    console.log(e.target.files);
	    setFile(URL.createObjectURL(e.target.files[0]));
	    document.getElementById("papaya").style.margin = "1rem auto 1rem auto";
	    
	}
	// ถ้าจะใส่ api แล้ว แสดงผลออกให้ใส่มาที่ตรงนี้
	function sendAPI(e){
		console.log('Hello');
	}
	//

  return (
  	<>
	
	<main className=''> 
		<div className=''>
			<h1 className='text-3xl font-bold text-red-500 m-4'>นวัตกรรมช่วยคนกินแซ่บ</h1>
			
			
			<input className='m-4' type="file" onChange={handleChange} />
            		<img src={file} className='block max-w-2xl max-h-72 ' id='papaya' />
			<button className='btn m-4' onClick={sendAPI}>submit</button>

		</div>
	</main>

	</>

	
	)
}

export default App
