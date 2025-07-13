import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Divider,
  Paper
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useGetPlaylistByIdQuery,
  useUpdatePlaylistMutation,
} from "../features/playlist/playlistApi";
import { getSpotifyToken, searchSpotifyTracks } from "../utils/spotify";
import { useState, useEffect, useRef } from "react";

// Replace with environment variables or move to backend for production
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;


const PlaylistDetail = () => {
  const { id = "" } = useParams();
  const { data, refetch } = useGetPlaylistByIdQuery(id);
  const [updatePlaylist] = useUpdatePlaylistMutation();

  const playlist = data?.data;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState("");

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Spotify token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getSpotifyToken(CLIENT_ID, CLIENT_SECRET);
        setSpotifyToken(token);
      } catch (err) {
        console.error("Failed to fetch Spotify token:", err);
      }
    };
    fetchToken();
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || !spotifyToken) {
      setResults([]);
      setSearchOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const items = await searchSpotifyTracks(query, spotifyToken);
        setResults(items);
        setSearchOpen(true);
      } catch (err) {
        console.error("Spotify search error:", err);
      }
    }, 400);
  }, [query, spotifyToken]);

  const handleAddSong = async (track: any) => {
    const song = {
      spotifyId: track.id,
      title: track.name,
      artists: track.artists.map((a: any) => ({ name: a.name, id: a.id })),
      album: {
        name: track.album.name,
        coverUrl: track.album.images?.[0]?.url || '',
        albumId: track.album.id,
      },
      durationMs: track.duration_ms,
      previewUrl: track.preview_url,
      explicit: track.explicit,
      trackNumber: track.track_number,
      uri: track.uri,
    };

    await updatePlaylist({ id, data: { songs: [...playlist?.songs, song] } });
    refetch();
    setSearchOpen(false);
  };

  return (
    <Box maxWidth="md" mx="auto" px={{ xs: 2, sm: 4 }} py={4} position="relative">
      <Typography variant="h5" mb={2}>{playlist?.name}</Typography>
      <Typography variant="body1" mb={3}>{playlist?.description}</Typography>

      {/* Search input */}
      <Box position="relative" mb={2}>
        <TextField
          label="Search songs"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          onFocus={() => query && setSearchOpen(true)}
        />

        {searchOpen && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              mt: 1,
              zIndex: 10,
              maxHeight: 300,
              overflowY: "auto",
              border: "1px solid #ccc",
            }}
          >
            <List>
              {results.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No results found" />
                </ListItem>
              ) : (
                results.map((track) => {
                  const alreadyAdded = playlist?.songs?.some(
                    (s: any) => s.spotifyId === track.id
                  );
                  return (
                    <ListItem
                      key={track.id}
                      sx={{ justifyContent: "space-between" }}
                    >
                      <ListItemText
                        primary={`🎵 ${track.name} - ${track.artists
                          .map((a: any) => a.name)
                          .join(", ")}`}
                      />
                      {alreadyAdded ? (
                        <Button variant="text" disabled color="success">
                          ✅ Added
                        </Button>
                      ) : (
                        <Button
                          variant="text"
                          onMouseDown={() => handleAddSong(track)}
                        >
                          ➕ Add
                        </Button>
                      )}
                    </ListItem>
                  );
                })
              )}
            </List>
          </Paper>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" mb={2}>
        Songs in Playlist
      </Typography>
      <List>
        {playlist?.songs.map((song: any) => (
          <ListItem
            key={song.spotifyId}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
            }}
          >
            <ListItemText
              primary={`🎵 ${song.title} - ${song.artists
                .map((a: any) => a.name)
                .join(", ")}`}
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={async () => {
                const updatedSongs = playlist.songs.filter(
                  (s: any) => s.spotifyId !== song.spotifyId
                );
                await updatePlaylist({ id, data: { songs: updatedSongs } });
                refetch();
              }}
            >
              🗑 Remove
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PlaylistDetail;
