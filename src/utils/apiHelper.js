import * as cookieHelper from "../utils/cookieHelper.js";

// Base url for all endpoints
let apiBaseUrl = "http://localhost:8080";

// Return a header object containing the auth_token if it exists
export function getApiHeaders() {
  let authToken = cookieHelper.getCookie("auth_token") || "";
  return { "X-Authorization": authToken };
}

// Return the url for the registration endpoint
export function registerUrl() {
  return `${apiBaseUrl}/register`;
}

// Return the url for the login endpoint
export function loginUrl() {
  return `${apiBaseUrl}/login`;
}

// Return the url for the logout endpoint
export function logoutUrl() {
  return `${apiBaseUrl}/logout`;
}

// Return the url for the user data endpoint
export function getUserUrl() {
  return `${apiBaseUrl}/users`;
}

// Return the url for the tracks list endpoint
export function getTracksUrl() {
  return `${apiBaseUrl}/tracks`;
}

// Return the url for the search tracks endpoint
export function searchTracksUrl() {
  return `${apiBaseUrl}/tracks`;
}

// Return the url for the upload tracks endpoint
export function uploadTracksUrl() {
  return `${apiBaseUrl}/tracks`;
}

// Return the url for the get track by id endpoint
export function getTrackUrl(id) {
  return `${apiBaseUrl}/tracks/${id}`;
}

// Return the url for the delete track endpoint
export function deleteTrackUrl(id) {
  return `${apiBaseUrl}/tracks/${id}`;
}

// Return the url for the sync tracks endpoint
export function syncTracksUrl() {
  return `${apiBaseUrl}/tracks/sync`;
}

// Return the url for the playlists list endpoint
export function getPlaylistsUrl() {
  return `${apiBaseUrl}/playlists`;
}

// Return the url for the remove from playlist endpoint
export function removeFromPlaylistUrl(playlist, track) {
  return `${apiBaseUrl}/playlists/${playlist}/tracks/${track}`;
}

// Return the url for the add to playlist endpoint
export function addToPlaylistUrl(playlist, track) {
  return `${apiBaseUrl}/playlists/${playlist}/tracks/${track}`;
}

// Return the url for the create playlist endpoint
export function createPlaylistUrl() {
  return `${apiBaseUrl}/playlists`;
}

// Return the url for the get playlist by id endpoint
export function getPlaylistUrl(id) {
  return `${apiBaseUrl}/playlists/${id}`;
}

// Return the url for the remove playlist endpoint
export function removePlaylistUrl(id) {
  return `${apiBaseUrl}/playlists/${id}`;
}

// Return the url for the player state endpoint
export function getStateUrl() {
  return `${apiBaseUrl}/player/state`;
}

// Return the url for the player volume endpoint
export function setVolumeUrl() {
  return `${apiBaseUrl}/player/volume`;
}

// Return the url for the add to queue endpoint
export function addToQueueUrl() {
  return `${apiBaseUrl}/player/queue`;
}

// Return the url for the play/pause endpoint
export function togglePlayUrl() {
  return `${apiBaseUrl}/player/toggleplay`;
}

// Return the url for the shuffle endpoint
export function toggleShuffleUrl() {
  return `${apiBaseUrl}/player/toggleshuffle`;
}

// Return the url for the repeat endpoint
export function toggleRepeatUrl() {
  return `${apiBaseUrl}/player/togglerepeat`;
}

// Return the url for the next track endpoint
export function nextTrackUrl() {
  return `${apiBaseUrl}/player/next`;
}

// Return the url for the previous track endpoint
export function previousTrackUrl() {
  return `${apiBaseUrl}/player/previous`;
}

// Return the url for the play playlist endpoint
export function playPlaylistUrl(id) {
  return `${apiBaseUrl}/playlists/${id}/play`;
}
