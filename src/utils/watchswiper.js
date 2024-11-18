function watchSwiper(containerSelector, swiperInstance) {
  const container = document.querySelector(containerSelector);

  if (!container || !swiperInstance) {
    console.error("Invalid container or Swiper instance provided.");
    return;
  }

  // Intersection Observer to monitor visibility
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          swiperInstance.enable(); // Enable Swiper when in view
          swiperInstance.autoplay?.start(); // Start autoplay if defined
        } else {
          swiperInstance.disable(); // Disable Swiper when out of view
          swiperInstance.autoplay?.stop(); // Stop autoplay if defined
        }
      });
    },
    { threshold: 0.1 } // Trigger when 10% of the container is visible
  );

  // Observe the Swiper container
  observer.observe(container);
}

export default watchSwiper;
