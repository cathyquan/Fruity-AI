// import React, { useState, useEffect } from 'react';
// import './App.css';
// import axios from 'axios';
// import AWS from 'aws-sdk';

// // Hard-coded credentials for development purposes only (NOT recommended for production)
// AWS.config.update({
//   accessKeyId: 'AKIAXU7C5FZ5GQMBWN5S',
//   secretAccessKey: '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',
//   region: 'us-east-2'
// });

// const s3 = new AWS.S3();

// function FetchBackendString() {
//   const [backendString, setBackendString] = useState('');

//   useEffect(() => {
//     axios.get('http://localhost:3001/get-prediction')
//       .then(response => {
//         setBackendString(response.data.prediction);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the prediction:', error);
//       });
//   }, []);  // Include setImageUploaded in the dependency array

//   return (
//     <div>
//       <p>Prediction from backend: {backendString}</p>
//     </div>
//   );
// }

// function App() {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [image, setImage] = useState(null);
//   const [result, setResult] = useState(null);
//   const [imageUploaded, setImageUploaded] = useState(false);
//   const [imageUrl, setImageUrl] = useState('');


//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//     setImage(URL.createObjectURL(event.target.files[0]));
//   };

//   const handleUpload = async () => {
//     const params = {
//       Bucket: 'frubucket', // Updated bucket name
//       Key: selectedFile.name,
//       Body: selectedFile,
//       ContentType: selectedFile.type,
//       //ACL: 'public-read' // Optional, set ACL as per your requirement
//     };

//     try {
//       const uploadResponse = await s3.upload(params).promise();
//       const uploadedImageUrl = uploadResponse.Location; // URL of the uploaded image
//       setImageUrl(uploadedImageUrl); // Set the image URL to the state
//       setSelectedFile(null); // Optionally clear the selected file after upload

//       // Further processing of the image, sending it to the backend
//       const response = await axios.post('https://7poz2qtm2b.execute-api.us-east-2.amazonaws.com/dev/frubucket/upload', { imageUrl: uploadedImageUrl });
//       setResult(response.data.result);
//     } catch (error) {
//       console.error('Error:', error);
//       setResult('Upload failed');
//       setImageUploaded(!imageUploaded);  // Update imageUploaded state after successful upload
//     }
//   };

//   return (
//     <div className="App-header">
//       <h1>Fruit Identifier</h1>
//       <b>Made by Kushal Gaddam, Justin Galin, Helena He, Cathy Quan, and Taylor Tillander</b>
//       <br />
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//       {result && <div>Result: {result}</div>}
//       {selectedFile && <div>Uploaded</div>}
//       {/* {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />} */}
//       {image && <img src={image} alt="Uploaded" style={{ maxWidth: '50%', marginTop: '10px' }} />}
//       <FetchBackendString imageUploaded={imageUploaded} />
//     </div>
//   );
// }

// export default App;
// export {FetchBackendString};

import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import AWS from 'aws-sdk';

// Update AWS configuration directly in your environment, not in code for production
AWS.config.update({
  accessKeyId: 'AKIAXU7C5FZ5GQMBWN5S',
  secretAccessKey: 'ZItsL+izdouOAut4TyV9ECfwXsjZRfyvtj5bFBmT',
  region: 'us-east-2'
});

const s3 = new AWS.S3();

function ImageUploader({ setImageUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleUpload = async () => {
    const params = {
      Bucket: 'frubucket',
      Key: selectedFile.name,
      Body: selectedFile,
      ContentType: selectedFile.type,
    };

    try {
      await s3.upload(params).promise();
      setResult('Upload successful');
      setImageUploaded(true);
    } catch (error) {
      console.error('Error:', error);
      setResult('Upload failed');
      setImageUploaded(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {result && <div>Result: {result}</div>}
      {image && <img src={image} alt="Uploaded" style={{ maxWidth: '50%', marginTop: '10px' }} />}
    </div>
  );
}

function FetchBackendString({ imageUploaded }) {
  const [backendString, setBackendString] = useState('');

  useEffect(() => {
    if (imageUploaded) {
      axios.get('http://localhost:3001/get-prediction')
        .then(response => {
          setBackendString(response.data.prediction);
          // Optionally reset imageUploaded state here if managed globally
        })
        .catch(error => {
          console.error('There was an error fetching the prediction:', error);
        });
    }
  }, [imageUploaded]);

  return (
    <div>
      <p>Prediction from backend: {backendString}</p>
    </div>
  );
}

function App() {
  const [imageUploaded, setImageUploaded] = useState(false);

  return (
    <div className="App-header">
      <h1>Fruit Identifier</h1>
      <b>Made by Kushal Gaddam, Justin Galin, Helena He, Cathy Quan, and Taylor Tillander</b>
      <br />
      <ImageUploader setImageUploaded={setImageUploaded} />
      <FetchBackendString imageUploaded={imageUploaded} />
    </div>
  );
}

export default App;