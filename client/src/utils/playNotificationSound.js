// simple reusable notification sound player
// keeps logic separated from UI (clean architecture)

let audio;

// preload once (performance + no delay)
export const playNotificationSound = () => {
  try {
    if (!audio) {
      audio = new Audio("/sounds/notification.mp3");
      audio.volume = 0.6; // soft professional volume
    }

    // restart sound if already playing
    audio.currentTime = 0;
    audio.play().catch(() => {
      // browser may block autoplay until user interaction
      // ignore silently (normal behavior)
    });
  } catch (err) {
    console.error("Sound error:", err);
  }
};