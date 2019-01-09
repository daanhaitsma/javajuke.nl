let apiBaseUrl = "http://localhost:8080";

export function getTracksUrl() {
  return `${apiBaseUrl}/tracks`;
}

export function getTrackUrl(id) {
  return `${apiBaseUrl}/tracks/${id}`;
}

export function getPlaylistsUrl() {
  return `${apiBaseUrl}/playlists`;
}

export function getPlaylistUrl(id) {
  return `${apiBaseUrl}/playlists/${id}`;
}
