// Tiny Easter egg: if someone types the four digits, send them “out”.
let buffer = "";
window.addEventListener("keydown", (e) => {
  buffer = (buffer + e.key).slice(-4);
  if (buffer.includes("2521")) {
    window.location.href = "exit.html";
  }
});
