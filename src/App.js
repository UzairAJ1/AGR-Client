import logo from './logo.svg';
import './App.css';
import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
function App() {
  const [image, setImage] = useState(
    "https://imgd.aeplcdn.com/1056x594/n/cw/ec/124013/hunter-350-right-front-three-quarter.jpeg?isig=0&q=75"
  );
  const [cropData, setCropData] = useState("");
  const [cropper, setCropper] = useState();
  const imageRef = useRef(null);
  const imageRef1 = useRef(null);
  const [brightnessValue, setBrightnessValue] = useState(200);
  const [contrastValue, setContrastValue] = useState(100);
  const [base64, setBase64] = useState("");

  function convertImageToBase64(imgUrl) {
    if (imgUrl) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.height = image.naturalHeight;
        canvas.width = image.naturalWidth;
        ctx.drawImage(image, 0, 0);
        const dataUrl = canvas.toDataURL();
        setCropData(dataUrl);
      };
      image.src = imgUrl;
    }
  }

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const rotate = () => {
    cropper.rotate(90);
    setCropData(cropper.getCroppedCanvas().toDataURL());
    setBase64(cropper.getCroppedCanvas().toDataURL());
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      setBase64(cropper.getCroppedCanvas().toDataURL());
    }
  };

  const handleChange = (e) => {
    setImage(e.target.value);
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = imageRef1.current.src;
    a.download = "styled-image.png";
    a.click();
  };

  const handleEffect = (e, effect) => {
    let val = e.target.value;
    console.log("The value is: ",val)
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = cropData;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      if (effect === "brightness") {
        ctx.filter = `brightness(${val}%) contrast(${contrastValue}%)`; // Apply desired styles
      } else {
        ctx.filter = `brightness(${brightnessValue}%) contrast(${val}%)`;
      }
      ctx.drawImage(img, 0, 0);
      imageRef1.current.src = canvas.toDataURL("image/png");
      setBase64(canvas.toDataURL("image/png"));
    };

    if (effect === "brightness") {
      setBrightnessValue(val);
    } else {
      setContrastValue(val);
    }
  };

  return (
    <div className="App">
       <div>
        <div>
        <h1>AGR</h1>
        </div>
       
      <div className="parent">
       
        <div className="child1">
          <h1>Upload Image</h1>
          <input type="file" onChange={onChange} />
        </div>
        <div className="child2">
          <h1>Image URL</h1>
          <input placeholder="Paste image URL" onChange={handleChange} />
          <button
            onClick={() => {
              convertImageToBase64(image);
            }}
          >
            Preview
          </button>
        </div>
      </div>

      <div>
        <Cropper
          // style={{ height: "100%", width: "100%" }}
          initialAspectRatio={1} // 16 / 9
          preview=".img-preview"
          src={image}
          ref={imageRef}
          viewMode={1}
          guides={true}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={true}
          responsive={true}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          onInitialized={(instance) => {
            setCropper(instance);
          }}
        />
      </div>

      <div>
        <div style={{ width: "200px" }}>
          <h1>
            <span>Crop</span>
            <div>
              <button onClick={getCropData}>Crop Image</button>
              <button onClick={rotate}>Rotate</button>
              <button onClick={download}>Download Image</button>
              <button
                onClick={() => {
                  console.log(base64);
                }}
              >
                Show Base64 Data in Console
              </button>
            </div>
          </h1>

          <input
            type="range"
            min="0"
            max={200}
            onChange={(e) => {
              handleEffect(e, "brightness");
            }}
            value={brightnessValue}
            style={{ width: "250px" }}
          />

          <input
            type="range"
            min="0"
            max={200}
            onChange={(e) => {
              handleEffect(e, "contrast");
            }}
            value={contrastValue}
            style={{ width: "250px" }}
          />

          {cropData && <img src={cropData} alt="cropped" ref={imageRef1} />}
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;
