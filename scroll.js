document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const root = (() => {
    if ("scrollingElement" in document) return document.scrollingElement;
    const start = document.documentElement.scrollTop;
    document.documentElement.scrollTop = start + 1;
    const end = document.documentElement.scrollTop;
    document.documentElement.scrollTop = start;
    return end > start ? document.documentElement : document.body;
  })();

  const ease = (duration, elapsed, start, end) =>
    Math.round(end * (-Math.pow(2, -10 * elapsed/duration) + 1) + start);

  const hash = link => link.getAttribute("href");

  const target = link => document.querySelector(hash(link));

  const getCoordinates = link => {
    const start = root.scrollTop;
    const top = Math.round(target(link).getBoundingClientRect().top);
    const max = root.scrollHeight - window.innerHeight;
    const end = start + top < max ? top : max - start;
    return new Map([["start", start], ["end", end]]);
  };

  const scroll = link => {
    const progress = new Map([["duration", 850]]);
    const coordinates = getCoordinates(link);
    const tick = timestamp => {
      progress.set("elapsed", timestamp - start);
      root.scrollTop = ease(...progress.values(), ...coordinates.values());
      progress.get("elapsed") < progress.get("duration")
      ? requestAnimationFrame(tick)
      : history.pushState(null, null, hash(link));
    };
    const start = performance.now();
    requestAnimationFrame(tick);
  };

  Array.from(document.querySelectorAll("a.scroll")).forEach(link =>
    link.addEventListener("click", event => {
      event.preventDefault();
      scroll(link);
    }));
});
