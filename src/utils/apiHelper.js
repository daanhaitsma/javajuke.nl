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
  return `${apiBaseUrl}/getuser`;
}

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

export function getStateUrl() {
  return `${apiBaseUrl}/playerstate`;
}

export function togglePlayUrl() {
  return `${apiBaseUrl}/toggleplay`;
}

export function toggleShuffleUrl() {
  return `${apiBaseUrl}/shuffle`;
}

export function toggleRepeatUrl() {
  return `${apiBaseUrl}/repeat`;
}

export function nextTrackUrl() {
  return `${apiBaseUrl}/nextsong`;
}

export function previousTrackUrl() {
  return `${apiBaseUrl}/previoussong`;
}

export function playPlaylistUrl(id) {
  return `${apiBaseUrl}/playlists/${id}/play`;
}