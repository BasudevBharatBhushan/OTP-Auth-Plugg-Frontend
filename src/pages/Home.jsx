import React, { useEffect, useState } from "react";
import { BsFillShieldLockFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { useParams } from "react-router-dom";
import OtpInput from "otp-input-react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { auth } from "../firebase.config";

const Home = () => {
  const API = "https://plugg-python-otp-backend.onrender.com";
  const { mobileNumber } = useParams();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    saveNumberToDatabase("+91" + mobileNumber);
    onSignup();
  }, []);

  function saveNumberToDatabase(number) {
    console.log(number);
    const newUser = {
      phoneNumber: number,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fetch(`${API}/user/${number}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.found === true) {
          // Phone number exists, update the updatedAt field
          console.log("User exist");
          const updatedUser = {
            updatedAt: new Date().toISOString(),
          };

          fetch(`${API}/user/${number}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("User doesn't exist");
          // Phone number doesn't exist, create a new user
          fetch(`${API}/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          })
            .then((response) => response.json())

            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+91" + mobileNumber;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;

        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);

        const updatedUser = {
          isVerified: true,
          updatedAt: new Date().toISOString(),
        };
        const formattedNumber = "+91" + mobileNumber;
        fetch(`${API}/user/${formattedNumber}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error("Error in verifying OTP \n\n Please try again!");
      });
  }

  return (
    <div className="cntr">
      <div className="text-white text-center font-custom">
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        <h1 className="text-9xl font-bold	mb-20" style={{ color: "#D1F73B" }}>
          PLUGG
        </h1>
        {user ? (
          <h2 className="text-4xl font-bold">
            "Hurray! You are part of A team now. Let's roll!"
          </h2>
        ) : (
          <div>
            <>
              <div className="mb-8 flex items-center justify-center">
                <BsFillShieldLockFill size={60} />
              </div>
              <h3 className="text-4xl mb-6">Enter your OTP</h3>
              <OtpInput
                value={otp}
                onChange={setOtp}
                OTPLength={6}
                otpType="number"
                disabled={false}
                autoFocus
                className="opt-container "
              ></OtpInput>
              <button
                onClick={onOTPVerify}
                className="relative bg-transparent hover:bg-yellow-300 hover:text-black text-white border-2 border-yellow-400 font-semibold rounded-3xl px-6 py-3 mt-4 flex items-center justify-center mx-auto"
              >
                {loading && (
                  <CgSpinner size={20} className="animate-spin mr-2" />
                )}
                <span>Verify</span>
              </button>
            </>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
