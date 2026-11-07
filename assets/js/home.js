// 自定义首页的少量交互脚本。
// 只做一件事：为“近期文章”卡片添加滚动淡入效果。
// 尊重系统的“减弱动态效果”(prefers-reduced-motion) 偏好，并兼容不支持
// IntersectionObserver 的环境——这两种情况下卡片都保持默认可见，不受影响。
(function () {
  "use strict";

  var wrapEls = document.querySelectorAll("[data-home-reveal-wrap]");
  var revealEls = document.querySelectorAll("[data-home-reveal]");

  if (!wrapEls.length || !revealEls.length) {
    return;
  }

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    return; // 保持默认可见状态，不使用淡入
  }

  // 由脚本接管显示：先让卡片进入“待显现”状态，再由观察器逐个显现。
  // 若脚本未执行，卡片始终保持可见，避免“白屏”风险。
  wrapEls.forEach(function (el) {
    el.classList.add("home-reveal-active");
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
