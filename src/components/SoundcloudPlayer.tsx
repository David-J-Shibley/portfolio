import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SoundCloudPlayerProps {
  soundCloudUsername?: string;
  playlistUrl?: string;
  height?: number;
  autoPlay?: boolean;
  showComments?: boolean;
  showUser?: boolean;
  showReposts?: boolean;
  showTeaser?: boolean;
  visual?: boolean;
  color?: string;
}

const SoundCloudPlayer = ({ 
  soundCloudUsername = "a_udio-i_llusion",
  playlistUrl = "https://soundcloud.com/a_udio-i_llusion/sets/beauty-in-the-darkness",
  height = 300,
  autoPlay = false,
  showComments = true,
  showUser = true,
  showReposts = false,
  showTeaser = true,
  visual = true,
  color = "%23ff5500" // Hex color (default: orange) - %23 is URL encoded '#'
}: SoundCloudPlayerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Encode the playlist URL for embedding
  const encodedUrl = encodeURIComponent(playlistUrl);
  
  // Generate the parameters for the iframe URL
  const params = new URLSearchParams({
    url: playlistUrl,
    color: color,
    auto_play: autoPlay.toString(),
    hide_related: (!showComments).toString(),
    show_comments: showComments.toString(),
    show_user: showUser.toString(),
    show_reposts: showReposts.toString(),
    show_teaser: showTeaser.toString(),
    visual: visual.toString()
  });
  
  const iframeSrc = `https://w.soundcloud.com/player/?${params.toString()}`;
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    setLoading(false);
    toast({
      title: "SoundCloud Playlist Loaded",
      description: "Ready to play 'Beauty in the Darkness'"
    });
  };
  
  const handleIframeError = () => {
    setLoading(false);
    setError("Failed to load SoundCloud playlist. Please check your connection.");
    toast({
      title: "Error Loading SoundCloud",
      description: "Could not connect to SoundCloud's servers. Please try again later.",
      variant: "destructive"
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-card rounded-2xl overflow-hidden">
      {error && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}
        
        <iframe 
          width="100%" 
          height={height} 
          scrolling="no" 
          frameBorder="no" 
          allow="autoplay" 
          src={iframeSrc}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="w-full"
        />
      </div>
      
      <div className="p-4 border-t">
        <div style={{
          fontSize: "10px", 
          color: "#cccccc",
          lineBreak: "anywhere",
          wordBreak: "normal",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis", 
          fontFamily: "Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif",
          fontWeight: 100
        }}>
          <a 
            href={`https://soundcloud.com/${soundCloudUsername}`} 
            title="Audio Illusion" 
            target="_blank" 
            rel="noreferrer"
            style={{ color: "#cccccc", textDecoration: "none" }}
          >
            Audio Illusion
          </a> · 
          <a 
            href={playlistUrl} 
            title="Beauty in the Darkness" 
            target="_blank" 
            rel="noreferrer"
            style={{ color: "#cccccc", textDecoration: "none" }}
          >
            Beauty in the Darkness
          </a>
        </div>
      </div>
    </div>
  );
};

export default SoundCloudPlayer;