// Browsers like Chrome on Android add the height of the URL bar to css's vh unit which we don't want.
export const vhCheck = () => {
  // Calculate the expected viewport height of the page
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  // Update on resize
  window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });
};
