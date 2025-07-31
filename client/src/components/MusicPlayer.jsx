import { useState,useEffect } from 'react';

// Music data with actual file paths
const songs = [
    { 
        id: 1, 
        title: "Calm Study", 
        thumbnail: "/songs/calm-study/cover.png",
        audioFile: "/songs/calm-study/track.mp3"
    },
    { 
        id: 2, 
        title: "Gentle Rain", 
        thumbnail: "/songs/gentle-rain/cover.png",
        audioFile: "/songs/gentle-rain/track.mp3"
    },
    { 
        id: 3, 
        title: "Forest Sounds", 
        thumbnail: "/songs/forest-sounds/cover.png",
        audioFile: "/songs/forest-sounds/track.mp3"
    },
    { 
        id: 4, 
        title: "Ocean Waves", 
        thumbnail: "/songs/ocean-waves/cover.png",
        audioFile: "/songs/ocean-waves/track.mp3"
    },
    { 
        id: 5, 
        title: "Soft Piano", 
        thumbnail: "/songs/soft-piano/cover.png",
        audioFile: "/songs/soft-piano/track.mp3"
    }
];

export default function MusicPlayer() {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);

    // Initialize or cleanup audio on component mount/unmount
    useEffect(() => {
        return () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                setIsPlaying(false);
                setCurrentSong(null);
                setAudio(null);
            }
        };
    }, [audio]);

    const handleSongSelect = (song) => {
        // If the same song is clicked again, toggle play/pause
        if (currentSong && currentSong.id === song.id) {
            togglePlayPause();
            return;
        }
        
        // Otherwise, play the new song
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        const newAudio = new Audio(song.audioFile);
        newAudio.loop = true;
        setAudio(newAudio);
        setCurrentSong(song);
        newAudio.play();
        setIsPlaying(true);
    };

    const togglePlayPause = () => {
        if (!audio) return;
        
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="music-player">
            <div className="now-playing">
                <h3>Now playing: {currentSong ? currentSong.title : 'Select a song'}</h3>
                <button 
                    className={`play-button ${isPlaying ? 'playing' : ''}`}
                    onClick={togglePlayPause}
                    disabled={!currentSong}
                >
                    <div className="play-icon"></div>
                </button>
            </div>
            <div className="song-list">
                {songs.map(song => (
                    <div 
                        key={song.id}
                        className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}
                        onClick={() => handleSongSelect(song)}
                    >
                        <div className="song-thumbnail">
                            <img 
                                src={song.thumbnail} 
                                alt={song.title}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <div className="thumbnail-placeholder" style={{ display: 'none' }}></div>
                        </div>
                        <span className="song-title">{song.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
