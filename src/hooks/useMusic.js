import soundfile from '../assets/sound/music.mp3';

const url = soundfile;
const audio = new Audio(url);
audio.volume = 0.3;
audio.loop = true;

export const useMusic = () => {

    const playSong = (music) => {
        if (music){
            audio.play(); 
            console.log('playing');
        }
        else if (!music) {
            audio.currentTime = 0;
            audio.pause();
            console.log('pauseSong');
        }
      }
      return [playSong]
};
