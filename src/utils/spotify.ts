export const getSpotifyToken = async (clientId: string, clientSecret: string) => {
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error('Failed to get Spotify token');
  }

  const data = await res.json();
  return data.access_token;
};


export const searchSpotifyTracks = async (
  query: string,
  token: string
): Promise<any[]> => {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Spotify search failed');
  }

  const data = await res.json();
  return data.tracks.items;
};
