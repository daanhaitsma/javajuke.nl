import * as cookieHelper from "../utils/cookieHelper.js";

let apiBaseUrl = "http://localhost:8080";

export function getApiHeaders() {
  return { "X-Authorization": cookieHelper.getCookie("auth_token") };
}

export function registerUrl() {
  return `${apiBaseUrl}/register`;
}

export function loginUrl(id) {
  return `${apiBaseUrl}/login`;
}

export function getUserUrl() {
  return `${apiBaseUrl}/users`;
}

export function getTracksUrl() {
  return `${apiBaseUrl}/tracks`;
}

export function searchTracksUrl() {
  return `${apiBaseUrl}/tracks`;
}

export function getTrackUrl(id) {
  return `${apiBaseUrl}/tracks/${id}`;
}

export function deleteTrackUrl(id) {
  return `${apiBaseUrl}/tracks/${id}`;
}

export function getPlaylistsUrl() {
  return `${apiBaseUrl}/playlists`;
}

export function removeFromPlaylistUrl(playlist, track) {
  return `${apiBaseUrl}/playlists/${playlist}/tracks/${track}`;
}

export function addToPlaylistUrl(playlist, track) {
  return `${apiBaseUrl}/playlists/${playlist}/tracks/${track}`;
}

export function createPlaylistUrl() {
  return `${apiBaseUrl}/playlists`;
}

export function getPlaylistUrl(id) {
  return `${apiBaseUrl}/playlists/${id}`;
}

export function removePlaylistUrl(id) {
  return `${apiBaseUrl}/playlists/${id}`;
}

export function getStateUrl() {
  return `${apiBaseUrl}/player/state`;
}

export function togglePlayUrl() {
  return `${apiBaseUrl}/player/toggleplay`;
}

export function toggleShuffleUrl() {
  return `${apiBaseUrl}/player/shuffle`;
}

export function toggleRepeatUrl() {
  return `${apiBaseUrl}/player/repeat`;
}

export function nextTrackUrl() {
  return `${apiBaseUrl}/player/next`;
}

export function previousTrackUrl() {
  return `${apiBaseUrl}/player/previous`;
}

export function playPlaylistUrl(id) {
  return `${apiBaseUrl}/playlists/${id}/play`;
}
