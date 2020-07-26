const animation = makeAnimation({
  delayTime: 0.05,
  maxCircles: 10,
  container: document.body,
});
animation.start();

/**
 * @typedef {Object} AnimationConfig
 * @property {number} delayTime - seconds until a new circle appears
 * @property {number} maxCircles - maximum circles to have in SVG at same time
 * @property {HTMLElement} container - a <svg> will be added to this element
 */

/**
 * main function, holds the animation state, sets keyboard listeners
 * @param {AnimationConfig} config
 */
function makeAnimation(config) {
  const drawingContainer = create("svg");
  config.container.append(drawingContainer);

  const frameRate = 1 / 60; // 60 frames per second
  let count = 0;
  let dx = -1;
  let dy = 1;
  let frame = 0;
  let lastTimestamp = 0;
  let stopped = false;

  const animation = (timestamp) => {
    if (stopped) return;
    const elapsed = timestamp - lastTimestamp;
    if (elapsed < frameRate * 1000)
      return window.requestAnimationFrame(animation);
    lastTimestamp = timestamp;
    frame++;
    Array.from(drawingContainer.querySelectorAll("circle")).forEach((circle) =>
      applyAttributes(circle, {
        cx: +circle.getAttribute("cx") + dx,
        cy: +circle.getAttribute("cy") + dy,
      })
    );
    if (frame % framesPerAnimation(frameRate, config.delayTime) === 0) {
      ++count;
      if (count > config.maxCircles) {
        drawingContainer.removeChild(drawingContainer.firstChild);
      }
      drawingContainer.append(createRandomCircle());
    }
    window.requestAnimationFrame(animation);
  };

  const handleKeydown = ({ key, shiftKey }) => {
    switch (key) {
      case " ":
        stopped = !stopped;
        if (!stopped) window.requestAnimationFrame(animation);
        return;
      case "j":
      case "ArrowDown":
        if (shiftKey) config.delayTime += 0.1;
        else ++dy;
        return;
      case "k":
      case "ArrowUp":
        if (shiftKey) {
          if (config.delayTime > 0.1) config.delayTime -= 0.1;
        } else --dy;
        return;
      case "h":
      case "ArrowLeft":
        --dx;
        return;
      case "l":
      case "ArrowRight":
        ++dx;
        return;
      default:
        return;
    }
  };

  config.container.addEventListener("keydown", handleKeydown);

  return {
    start: () => {
      window.requestAnimationFrame(animation);
    },
  };
}

function applyAttributes(el, attributes = {}) {
  for (const [key, value] of Object.entries(attributes)) {
    el.setAttribute(key, value);
  }
  return el;
}

/**
 * @param {string} name
 * @param {{[k: string]: number | string}} attributes
 * @returns {HTMLElement | SVGElement} element
 */
function create(name, attributes) {
  if (isSvgName(name)) {
    return applyAttributes(
      document.createElementNS("http://www.w3.org/2000/svg", name),
      attributes
    );
  }
  return applyAttributes(document.createElement(name), attributes);
}

/**
 * @returns {SVGCircleElement}
 */
function createRandomCircle() {
  const randomX = randomRange({ min: 0, max: window.innerWidth });
  const randomY = randomRange({ min: 0, max: window.innerHeight });
  const randomRadius = randomRange({ min: 10, max: 100 });
  return create("circle", {
    cx: randomX(),
    cy: randomY(),
    r: randomRadius(),
    fill: randomHexColorString(),
  });
}

/**
 * Helper to use a delay in seconds with frames
 * @param {number} frameRate
 * @param {number} delay
 * @returns {number} frames per animation
 */
function framesPerAnimation(frameRate, delay) {
  return Math.floor(delay / frameRate);
}

/**
 * Helper for the `create` function to register which names are SVG
 * @param {string} name
 * @returns {boolean}
 */
function isSvgName(name) {
  switch (name) {
    case "svg":
    case "circle":
      return true;
    default:
      return false;
  }
}

function randomRange({ min = 1, max = 10 } = {}) {
  return function () {
    return randomNumber({ min, max });
  };
}

function randomNumber({ min = 0, max = 1 }) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomHexColorString() {
  return `#${randomNumber({ min: 0, max: 16 ** 6 - 1 }).toString(16)}`;
}
