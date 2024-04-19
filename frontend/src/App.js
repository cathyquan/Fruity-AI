import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'AKIAXU7C5FZ5GQMBWN5S',  // Replace with your access key ID
  secretAccessKey: 'ZItsL+izdouOAut4TyV9ECfwXsjZRfyvtj5bFBmT',  // Replace with your secret access key
  region: 'us-east-2'
});

const s3 = new AWS.S3();

function ImageUploader({ onUploadSuccess }) {
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
      onUploadSuccess();  // Call the passed function to increment the upload count
    } catch (error) {
      console.error('Error:', error);
      setResult('Upload failed');
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

function FetchBackendString({ uploadCount }) {
  const [backendString, setBackendString] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/get-prediction')
      .then(response => {
        setBackendString(response.data.prediction);
      })
      .catch(error => {
        console.error('There was an error fetching the prediction:', error);
      });
  }, [uploadCount]);  // Depend on the uploadCount to re-run the fetch operation

  return (
    <div>
      <p>Prediction from backend: {backendString}</p>
    </div>
  );
}

function App() {
  const [uploadCount, setUploadCount] = useState(0);

  const incrementUploadCount = () => {
    setUploadCount(prevCount => prevCount + 1);
  };

  return (
    <div className="App-header">
      <h1>Fruit Identifier</h1>
      <ImageUploader onUploadSuccess={incrementUploadCount} />
      <FetchBackendString uploadCount={uploadCount} />
    </div>
  );
}

export default App;
