export function getCookie(name) {
  // Set result to null
  let result = null;
  // Get all cookies in an array
  let cookies = document.cookie.split("; ");
  // Loop trought cookies
  cookies.forEach(cookie => {
    cookie = cookie.split("=");
    // Check if cookie name equals name
    if (cookie[0] == name) {
      // Set result to current cookie
      result = cookie[1];
    }
  });
  // Return cookie of null
  return result;
}

export function setCookie(name, value, minutes) {
  // Convert minutes to milliseconds
  minutes = minutes * 60000;
  // Get time minutes from now
  let expires = new Date(new Date().getTime() + minutes);
  // Set cookie
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/;`;
}

export function removeCookie(name) {
  // Set cookie value to empty and expires to 1970
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
