import { useState } from "react"

function FileForm() {

        const [file, setFile] = useState(null);

        const handleFileInputChange = (event) => {
                console.log(event.target.files)
                setFile(URL.createObjectURL(event.target.files[0]))
        }

        const handleSubmit = async (event) => {
                event.preventDeault();

                const formData = new FormData();
                formData.append('file', file)

                try {
                        const endpoint = "http://127.0.0.1:8000/classify"
                        const response = await fetch(endpoint, {
                                method: "POST",
                                body: formData
                        });

                        if (response.ok) {
                                console.log("file upload done")
                        } else {
                                console.error("fail")
                        }
                } catch(error) {
                        console.error(error)
                }
        }

        return (
                <div>

                        <form onSubmit={handleSubmit}>
                                <div style={{marginBottom: "20px"}}>
                                <input type="file" onChange={handleFileInputChange} />
                                </div>

                                <button type="submit">Upload</button>
                        </form>
                        {file && <p>{file.name}</p>}
                </div>
        )
}

export default FileForm