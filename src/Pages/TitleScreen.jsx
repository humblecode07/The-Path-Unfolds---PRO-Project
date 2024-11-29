import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Modal from "../Components/MusicModal/Modal";
import { motion } from "framer-motion";
import backgroundMusic from "../assets/TitleScreen Music/TitleScreenBGM.mp3";
import SettingsModal from "../Components/SettingsModal/Settings";
import Particles from "react-tsparticles"; // Import particles
import "./TitleScreen.css";

const TitleScreen = () => {
  const importAll = (requireContext) =>
    requireContext.keys().map(requireContext);
  const backgrounds = importAll(
    require.context("../assets/Game BG", false, /\.(png|jpe?g|svg)$/)
  );

  const [bgImage, setBgImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [musicVolume, setMusicVolume] = useState(0.5);
  const [narratorVolume, setNarratorVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const savedMusicVolume = localStorage.getItem("musicVolume");
    const savedNarratorVolume = localStorage.getItem("narratorVolume");
    const savedIsMuted = localStorage.getItem("isMuted");

    if (savedMusicVolume !== null) setMusicVolume(parseFloat(savedMusicVolume));
    if (savedNarratorVolume !== null)
      setNarratorVolume(parseFloat(savedNarratorVolume));
    if (savedIsMuted !== null) setIsMuted(savedIsMuted === "true");
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (!isMuted) {
        audio.volume = musicVolume;
      } else {
        audio.volume = 0;
      }
    }
  }, [musicVolume, narratorVolume, isMuted]);

  const startMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.play();
    }

    setIsModalOpen(false);
    setIsStarted(true);
    setBgImage(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
  };

  const saveSettings = (newMusicVolume, newNarratorVolume, newIsMuted) => {
    setMusicVolume(newMusicVolume);
    setNarratorVolume(newNarratorVolume);
    setIsMuted(newIsMuted);

    localStorage.setItem("musicVolume", newMusicVolume);
    localStorage.setItem("narratorVolume", newNarratorVolume);
    localStorage.setItem("isMuted", newIsMuted);

    const audio = audioRef.current;
    if (!newIsMuted) {
      audio.volume = newMusicVolume;
    } else {
      audio.volume = 0;
    }
  };

  const titleVariants = {
    initial: { opacity: 0, y: -50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.2, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 25 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, delay: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div
      className="h-screen w-screen flex flex-col relative"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : "none",
        backgroundColor: !bgImage ? "black" : "transparent",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Particle Effect */}
      <Particles
        id="tsparticles"
        options={{
          particles: {
            number: {
              value: 100,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 0.8, // Increase opacity for better visibility
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1, // Slightly higher min opacity
              },
            },
            size: {
              value: 4, // Increase size for better visibility
              random: true,
            },

            move: {
              enable: true,
              speed: 1,
              direction: "none",
              random: true,
              straight: false,
            },
          },
          interactivity: {
            events: {
              onhover: {
                enable: true,
                mode: "repulse",
              },
            },
          },
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 100, // Set the z-index to 0 (or lower) so that particles stay behind the content
        }}
      />

      <motion.div
        className="absolute inset-0 bg-black opacity-70 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isStarted ? 0.7 : 0 }}
        transition={{ duration: 1 }}
      />

      <motion.div
        className="z-0"
        variants={titleVariants}
        initial="initial"
        animate={isStarted ? "animate" : "initial"}
      >
        <h1 className="font-breatheFire text-[2.5rem] sm:text-[5rem] lg:text-[10rem] text-transparent sm:ml-[2rem] mt-[15rem] ml-[1rem] sm:mt-[2rem] lg:ml-[5rem] lg:mt-[3rem] leading-[1] tracking-widest gradient-text">
          The <br />
          Path Unfolds
        </h1>
      </motion.div>

      <motion.div
        className="flex flex-col space-y-1 mt-auto mb-8 items-end font-morris text-[3rem] mr-[2rem]"
        variants={buttonVariants}
        initial="initial"
        animate={isStarted ? "animate" : "initial"}
      >
        <Link to="/game">
          <button className="relative py-10 text-white rounded-full pr-[2rem] pl-[15rem] text-xl group overflow-hidden flex">
            <span className="relative text-[5rem] z-10">Start Game</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-[#8a6fff] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          </button>
        </Link>

        <button
          className="relative py-10 text-white rounded-full pr-[2rem] pl-[15rem] text-xl group overflow-hidden flex"
          onClick={() => setIsSettingsOpen(true)}
        >
          <span className="relative text-[5rem] z-10">Settings</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent to-[#8a6fff] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
        </button>

        <Link to="/about">
          <button className="relative py-10 text-white rounded-full pr-[2rem] pl-[15rem] text-xl group overflow-hidden flex">
            <span className="relative text-[5rem] z-10">About</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-[#8a6fff] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          </button>
        </Link>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={startMusic}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={saveSettings}
        musicVolume={musicVolume}
        narratorVolume={narratorVolume}
        isMuted={isMuted}
      />

      <audio ref={audioRef} src={backgroundMusic} />
    </div>
  );
};

export default TitleScreen;
