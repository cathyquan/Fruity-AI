import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    // Here you can connect with your models trained in .jpynb
    // and perform any necessary processing on the uploaded image
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fruit Identifier Image Upload</h1>
        <b>Created by Kushal Gaddam, Justin Galin, Helena He, Cathy Quan, and Taylor Tillander</b>
        <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        {selectedImage && (
          <img src={selectedImage} alt="Uploaded" className="uploaded-image" />
        )}
      </header>
    </div>
  );
}

export default App;
