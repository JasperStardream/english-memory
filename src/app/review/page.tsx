'use client';

import { useState, useEffect } from 'react';
import { Check, X, HelpCircle, Volume2, Eye, EyeOff } from 'lucide-react';

function getDaysUntilNextReview(nextReviewDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const reviewDate = new Date(nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);
  const diffTime = reviewDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function ReviewPage() {
  const [items, setItems] = useState<Array<{
    id: string;
    text: string;
    translation: string;
    audioUrl?: string;
    progress: Array<{
      nextReviewDate: string;
    }>;
  }>>([]);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [isLooping, setIsLooping] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchDueItems = async () => {
      try {
        const response = await fetch('/api/review');
        if (response.ok) {
          const data = await response.json();
          console.log('Review items:', data);
          setItems(data.items);
        }
      } catch (error) {
        console.error('Failed to fetch review items:', error);
      }
    };

    fetchDueItems();
  }, []);

  const updateStatus = async (itemId: string, status: string) => {
    try {
      stopCurrentAudio();
      const response = await fetch(`/api/progress/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
        setVisibleItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const [audioError, setAudioError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const stopCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsPlaying(null);
      setIsLooping(new Set());
    }
  };

  const playAudio = async (itemId: string, audioUrl: string) => {
    if (!audioUrl) return;
    
    try {
      // If there's already an audio playing, stop it
      stopCurrentAudio();
      
      // If we're clicking the same button that's currently playing, just stop
      if (isPlaying === itemId) {
        return;
      }

      setAudioError(null);
      setIsPlaying(itemId);
      const audio = new Audio(audioUrl);
      audio.loop = true;
      
      audio.addEventListener('ended', () => {
        if (!isLooping.has(itemId)) {
          setIsPlaying(null);
          setCurrentAudio(null);
        }
      });
      audio.addEventListener('error', () => {
        setAudioError('Failed to play audio');
        setIsPlaying(null);
        setCurrentAudio(null);
      });
      
      await audio.play();
      setCurrentAudio(audio);
      setIsLooping(prev => {
        const newSet = new Set(prev);
        newSet.add(itemId);
        return newSet;
      });
    } catch (error) {
      console.error('Audio playback error:', error);
      setAudioError('Failed to play audio');
      setIsPlaying(null);
    }
  };

  const toggleItemVisibility = (itemId: string) => {
    setVisibleItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Review Session</h1>
        
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-semibold">Words to Review</h2>
          {items.map((item) => {
            const daysUntilNextReview = item.progress[0] ? getDaysUntilNextReview(item.progress[0].nextReviewDate) : 0;
            return (
              <div
                key={item.id}
                className="p-3 sm:p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-5">
                    {item.audioUrl && (
                      <button
                        onClick={() => {
                          if (item.audioUrl) {
                            playAudio(item.id, item.audioUrl);
                          }
                        }}
                        disabled={false}
                        aria-label={isPlaying === item.id ? "Playing..." : "Play pronunciation"}
                        className="p-2 text-gray-600 hover:text-blue-600"
                        title="Play pronunciation"
                      >
                        <Volume2 className={`w-5 h-5 ${isPlaying === item.id ? 'text-blue-600' : ''}`} />
                      </button>
                    )}
                    <button
                      onClick={() => updateStatus(item.id, 'mastered')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      title="I know this well"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, 'familiar')}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                      title="I'm somewhat familiar"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, 'forgotten')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="I need to review this"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleItemVisibility(item.id)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                      title={visibleItems.has(item.id) ? "Hide text" : "Show text"}
                    >
                      {visibleItems.has(item.id) ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className={`space-y-1 mt-2 sm:mt-0 ${visibleItems.has(item.id) ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                    <h3 className="text-base sm:text-lg font-medium">{item.text}</h3>
                    <p className="text-sm sm:text-base text-gray-600">{item.translation}</p>
                  </div>
                  <div className="flex items-center space-x-1 mt-2 sm:mt-0">
                    <p className="text-xs sm:text-sm text-blue-600">
                      {daysUntilNextReview} days
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}