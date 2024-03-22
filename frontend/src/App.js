import React, { useState } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';

function App() {
  return (
    <div>
      <h1>Fruit Identifier</h1>
      <b>Made by Kushal Gaddam, Justin Galin, Helena He, Cathy Quan, and Taylor Tillander</b>
      <ImageUploader />
    </div>
  );
}

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const params = {
      Bucket: 'YOUR_S3_BUCKET_NAME',
      Key: selectedFile.name,
      Body: selectedFile,
      ACL: 'public-read' // Optional, set ACL as per your requirement
    };

    try {
      await s3.upload(params).promise();
      setImageUrl(`https://${params.Bucket}.s3.amazonaws.com/${params.Key}`);
      const response = await axios.post('http://your-backend-url/process-image', { imageUrl });
      setResult(response.data.result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
      {result && <div>Result: {result}</div>}
    </div>
  );
}

export default ImageUploader;
