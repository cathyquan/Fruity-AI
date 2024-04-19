import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
  region: 'YOUR_S3_REGION'
});

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleUpload = async () => {
    const params = {
      Bucket: 'YOUR_S3_BUCKET_NAME',
      Key: selectedFile.name,
      Body: selectedFile,
      ACL: 'public-read' // Optional, set ACL as per your requirement
    };

    try {
      const uploadResponse = await s3.upload(params).promise();
      setImageUrl(uploadResponse.Location);
      setResult('Upload successful');
    } catch (error) {
      console.error('Error:', error);
      setResult('Upload failed');
    }
  };

  return (
    <div className="App">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {result && <div>Result: {result}</div>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />}
      <br />
      {image && <img src={image} alt="Uploaded" style={{ maxWidth: '50%', marginTop: '10px' }} />}
    </div>
  );
}

function App() {
  return (
    <div className="App-header">
      <h1>Fruit Identifier</h1>
      <b>Made by Kushal Gaddam, Justin Galin, Helena He, Cathy Quan, and Taylor Tillander</b>
      <br />
      <ImageUploader />
    </div>
  );
}

export default App;
