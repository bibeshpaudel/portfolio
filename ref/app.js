// Image Path
const flightPath = {
  curviness: 1.25,
  autoRotate: true,
  values: [
    { x: 100, y: -20 },
    { x: 300, y: 10 },
    { x: 500, y: 100 },
    { x: 750, y: -100 },
    { x: 350, y: -50 },
    { x: 600, y: 100 },
    { x: 800, y: 0 },
    { x: window.innerWidth, y: -250 }
  ]
};

// New GSAP Timeline
const tween = new TimelineLite();

// Timeline Settings
tween.add(
  TweenLite.to(".paper-plane", 1, {
    bezier: flightPath,
    ease: Power1.easeInOut
  })
);

// Animation Controller
const controller = new ScrollMagic.Controller();

// Set where the animation should start - section with animation class
const scene = new ScrollMagic.Scene({
  triggerElement: ".animation",
  duration: 4000,
  triggerHook: 0
})
  // Set the animation to the timeline tween variable so it animates when mouse scrolls
  .setTween(tween)
  // Helps visualize the area for the animation
  //   .addIndicators()
  // Sticks top of animation section to top of page until animation finishes playing
  .setPin(".animation")
  .addTo(controller);
