export function getCookie(name) {
  // set result to null
  let result = null;
  // get all cookies in an array
  let cookies = document.cookie.split("; ");
  // loop trought cookies
  cookies.forEach(cookie => {
    cookie = cookie.split("=");
    // check if cookie name equals name
    if (cookie[0] == name) {
      // set result to current cookie
      result = cookie[1];
    }
  });
  // return cookie of null
  return result;
}
export function setCookie(name, value, minutes) {
  // convert minutes to milliseconds
  minutes = minutes * 60000;
  // get time minutes from now
  let expires = new Date(new Date().getTime() + minutes);
  // set cookie
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/;`;
}
export function removeCookie(name) {
  // set cookie value to empty and expires to 1970
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
