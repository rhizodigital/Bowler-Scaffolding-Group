const parseTimeToMs = (time) => {
  if (!time || typeof time !== "string") return 0; // Handle null, undefined, and non-string values
  time = time.trim(); // Remove leading and trailing whitespace

  if (time.endsWith("ms")) return Number.parseFloat(time);
  if (time.endsWith("s")) return Number.parseFloat(time) * 1000;
  return 0;
};

const calcTransitionDuration = (element) => {
  if (!element) return 0;

  try {
    const { transitionDuration, transitionDelay } =
      window.getComputedStyle(element);

    if (!transitionDuration && !transitionDelay) return 0; // No transition properties

    const durations = (transitionDuration || "0s").split(/,\s*/);
    const delays = (transitionDelay || "0s").split(/,\s*/);

    let maxTime = 0;

    for (let i = 0; i < durations.length; i++) {
      const duration = parseTimeToMs(durations[i] || "0s");
      const delay = parseTimeToMs(delays[i] || "0s");
      maxTime = Math.max(maxTime, duration + delay);
    }

    return Math.round(maxTime);
  } catch (error) {
    console.warn("Error caclulating transition duration:", error);
    return 0;
  }
};

const transitionCompleted = (element) => {
  let timeoutId;
  let handler;
  const padding = 10;
  const transitionend = new Promise((resolve) => {
    handler = (e) => {
      if (e.target !== element) return;
      clearTimeout(timeoutId);
      element.removeEventListener("transitionend", handler);
      console.log("transitionend");
      resolve();
    };
    element.addEventListener("transitionend", handler);
  });

  const timeout = new Promise((resolve) => {
    timeoutId = setTimeout(
      () => {
        element.removeEventListener("transitionend", handler);
        console.log("timeout");
        resolve();
      },
      calcTransitionDuration(element) + padding
    );
  });

  return Promise.race([transitionend, timeout]);
};

export default transitionCompleted;
