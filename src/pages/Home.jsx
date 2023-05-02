import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Home = () => {
  const { mobileNumber } = useParams();
  const blockRefs = useRef([]);
  const [message, setMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: "+91" + mobileNumber }),
    };
    fetch("https://plugg-otp-auth.onrender.com/phone", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessage(data.message);
        if (data.message === "You have already registered") {
          navigate("/registered");
        } else if (data.message !== "OTP Sent") {
          navigate("/error-otp");
        }
      });

    console.log(message);
  }, [mobileNumber]);

  const handleInput = (index, e) => {
    if (e.target.value) {
      if (index < blockRefs.current.length - 1) {
        blockRefs.current[index + 1].focus();
      }
    } else if (index > 0) {
      blockRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const Obtainedotp = blockRefs.current.reduce(
      (otp, block) => otp + block.value,
      ""
    );
    setOtp(Obtainedotp);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: "+91" + mobileNumber, otpCode: otp }),
    };
    fetch("https://plugg-otp-auth.onrender.com/otp", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOtpMessage(data.message);
      });
  };

  return (
    <div className="container">
      <p className="message">OTP sent to {mobileNumber}</p>
      <h1 className="heading">ENTER OTP</h1>
      <div className="otp-blocks">
        <input
          type="text"
          maxLength="1"
          className="otp-block"
          ref={(ref) => (blockRefs.current[0] = ref)}
          onInput={(e) => handleInput(0, e)}
        />
        <input
          type="text"
          maxLength="1"
          className="otp-block"
          ref={(ref) => (blockRefs.current[1] = ref)}
          onInput={(e) => handleInput(1, e)}
        />
        <input
          type="text"
          maxLength="1"
          className="otp-block"
          ref={(ref) => (blockRefs.current[2] = ref)}
          onInput={(e) => handleInput(2, e)}
        />
        <input
          type="text"
          maxLength="1"
          className="otp-block"
          ref={(ref) => (blockRefs.current[3] = ref)}
          onInput={(e) => handleInput(3, e)}
        />
        <input
          type="text"
          maxLength="1"
          className="otp-block"
          ref={(ref) => (blockRefs.current[4] = ref)}
          onInput={(e) => handleInput(4, e)}
        />
        <input
          type="text"
          maxLength="1"
          className="otp-block"
          ref={(ref) => (blockRefs.current[5] = ref)}
          onInput={(e) => handleInput(5, e)}
        />
      </div>
      <button className="submit-button" onClick={handleSubmit}>
        SUBMIT
      </button>
      <p className="message">{otpMessage}</p>
    </div>
  );
};

export default Home;
