import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';

const TalkToSpeech = ({ text, voice, shouldPlayTTS }) => {
   const [audioUrl, setAudioUrl] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);
   const [isAudioReady, setIsAudioReady] = useState(false);
   const audioRef = useRef(null);
   const previousTextRef = useRef(text);
   const location = useLocation();

   const generateSpeech = async () => {
      setIsLoading(true);
      setError(null);
      setIsAudioReady(false); // Reset audio ready state when generating new speech

      try {
         const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}`,
            {
               text: text,
               model_id: "eleven_turbo_v2_5",
               voice_settings: {
                  stability: 0.7,
                  similarity_boost: 0.97,
                  style: 1,
                  use_speaker_boost: true
               }
            },
            {
               headers: {
                  'xi-api-key': 'sk_a9f69387ed3c15e26b64ac4cbf2e9ea15f18f44cc4cbe52f',
                  'Content-Type': 'application/json',
                  'Accept': 'audio/mpeg'
               },
               responseType: 'blob'
            }
         );

         // Clean up previous audio URL if it exists
         if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
         }

         const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
         const newAudioUrl = URL.createObjectURL(audioBlob);
         setAudioUrl(newAudioUrl);
         setIsAudioReady(true); // Mark audio as ready after successful generation
      } catch (error) {
         console.log(error);
         setError('Failed to generate speech');
         console.error(error);
      } finally {
         setIsLoading(false);
      }
   };

   // Effect to handle text changes and trigger speech generation
   useEffect(() => {
      if (text && text !== previousTextRef.current) {
         generateSpeech();
         previousTextRef.current = text;
      }
   }, [text]);

   const savedNarratorVolume = parseFloat(localStorage.getItem('narratorVolume')) || 1.0;

   // Effect to handle audio playback based on image loading and audio readiness
   useEffect(() => {
      if (audioUrl && audioRef.current && isAudioReady && shouldPlayTTS) {
         const savedIsMuted = localStorage.getItem('isMuted') === 'true';
         const validVolume = !isNaN(savedNarratorVolume) ? Math.min(Math.max(savedNarratorVolume, 0), 1) : 1;

         console.log('Audio ready and image loaded. Playing audio with volume:', validVolume);

         if (audioRef.current) {
            audioRef.current.volume = validVolume;
            audioRef.current.muted = savedIsMuted;

            // Reset audio to start
            audioRef.current.currentTime = 0;

            audioRef.current.play().catch((err) => {
               console.error('Failed to play audio:', err);
            });
         }
      } else if (audioRef.current && !shouldPlayTTS) {
         // Pause audio if image isn't loaded
         console.log('Image not loaded, pausing audio');
         audioRef.current.pause();
      }
   }, [audioUrl, savedNarratorVolume, shouldPlayTTS, isAudioReady]);
   
   // Cleanup effect
   useEffect(() => {
      return () => {
         if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
         }
         if (audioRef.current) {
            audioRef.current.pause();
         }
      };
   }, []);

   return (
      <>
         {location.pathname === '/game' && (
            <>
               {error && <div style={{ color: 'red' }}>{error}</div>}
               {isLoading && <div className='text-white'>Generating speech...</div>}
               <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }}>
                  Your browser does not support the audio element.
               </audio>
            </>
         )}
      </>
   );
}

export default TalkToSpeech;