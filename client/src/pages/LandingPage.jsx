import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalWrapper from "../components/ModalWrapper";
import Login from "../components/Login";
import Register from "../components/Register";
import BtnMain from "../components/BtnMain";
import Copyright from "../components/Copyright";
import logo from "../assets/logo.png";
import videoPoster from "../assets/video_poster.jpg";
import bgVid_mp4 from "../assets/bgVideo.mp4";
import bgVid_webm from "../assets/bgVideo.webm";
import "../css/LandingPage.css";
import "../css/fonts.css";
import "../css/Login.css";
import "../css/Register.css";

const LandingPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("login");
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const switchToRegister = () => setModalContent("register");
  const switchToLogin = () => setModalContent("login");

  return (
    <div className="landing-page-container">
   
    <div className="video-background-container">
        <video className="bgVid" poster={videoPoster} playsInline autoPlay muted loop preload="auto" aria-label="Abstract cosmic background animation">
            <source src={bgVid_webm} type="video/webm" />
            <source src={bgVid_mp4} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    </div>

    <header className="header">
        <section className="hero">
            <img src={logo} className="logo" alt="Noted" />
            <div className="btn-container">
                <BtnMain onClick={openModal} />
            </div>
        </section>
    </header>

    <ModalWrapper
        className="model-backdrop"
        isVisible={isModalVisible}
        toggleModal={closeModal}
     >
        {modalContent === "login" ? (
             <Login
                switchToRegister={switchToRegister}
                closeModal={closeModal}
              />
         ) : (
             <Register
                switchToLogin={switchToLogin}
                closeModal={closeModal}
              />
         )}
    </ModalWrapper>

    <Copyright />
  </div>
  );
};

export default LandingPage;
