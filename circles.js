// setup
const drawingContainer = create("svg");
document.body.append(drawingContainer);
const delayTime = 0.1; // seconds
const maxCircles = 100;
let count = 0;
let timeOfLastFrame = 0;
window.requestAnimationFrame(animateCircles);

//--- end of "script" ---
//--- start function library ---

/**
 * Main animation function
 * @param {number} timestamp
 */
function animateCircles(timestamp) {
  const elapsed = timestamp - timeOfLastFrame;
  // TODO add a time based condition to this animation for consistency
  Array.from(drawingContainer.querySelectorAll("circle")).forEach(
    moveDownAndLeft
  );
  if (timeOfLastFrame !== 0 && elapsed < delayTime * 1000) {
    return window.requestAnimationFrame(animateCircles);
  }
  timeOfLastFrame = timestamp;
  ++count;
  if (count > maxCircles) {
    drawingContainer.removeChild(drawingContainer.firstChild);
  }
  drawingContainer.append(createRandomCircle());
  window.requestAnimationFrame(animateCircles);
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

/**
 *
 * @param {SVGCircleElement} circle
 */
function moveDownAndLeft(circle) {
  circle.setAttribute("cy", +circle.getAttribute("cy") + 1);
  circle.setAttribute("cx", +circle.getAttribute("cx") - 1);
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
