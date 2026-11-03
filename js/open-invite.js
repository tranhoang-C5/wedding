(function () {
  var btn = document.querySelector('button[class*="-open-btn"]');
  var cover = btn && btn.closest('[class*="-cover "]');
  if (!cover || !btn) return;
  var m = /(\w+)-open-btn/.exec(btn.className);
  var P = m[1];
  var audio = document.querySelector("audio");
  var musicBtn = document.querySelector('button[aria-label="Phát nhạc"], button[aria-label="Tắt nhạc"]');
  var ACCENT = getComputedStyle(btn).backgroundColor || "#7d1a1a";

  var reveals = document.querySelectorAll("." + P + "-reveal");
  var observer = null;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-" + P + "-shown", "");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
  }

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  function open() {
    if (cover.classList.contains(P + "-cover-opening")) return;
    cover.classList.add(P + "-cover-opening");
    if (audio) audio.play().catch(function () {});
    setTimeout(function () {
      cover.style.display = "none";
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.querySelectorAll("." + P + "-reveal").forEach(function (el) {
        if (observer) observer.observe(el);
        else el.setAttribute("data-" + P + "-shown", "");
      });
    }, 1100);
  }
  btn.addEventListener("click", open);

  if (audio && musicBtn) {
    musicBtn.addEventListener("click", function () {
      if (audio.paused) audio.play().catch(function () {});
      else audio.pause();
    });
  }

  var PHOTOS = [
    "JPEG/DSC09129.jpg", "JPEG/DSC08838.jpg", "JPEG/DSC08362.jpg", "JPEG/DSC08219.jpg", "AFnZj0BYNdpU.jpg"
  ].map(function (f) { return "images/" + f; });

  function initGallery() {
    var dialog = document.querySelector("dialog.modal");
    var current = 0;
    var openLightbox = function () {};

    if (dialog) {
      var counter = dialog.querySelector(".rounded-full.bg-black\\/40");
      var mainImg = dialog.querySelector('img[alt^="Ảnh cưới"]');
      var strip = dialog.querySelector(".overflow-x-auto");
      var prev = dialog.querySelector('[aria-label="Previous image"]');
      var next = dialog.querySelector('[aria-label="Next image"]');
      var thumbTpl = strip.querySelector("button").cloneNode(true);
      var thumbs = [];
      strip.innerHTML = "";
      PHOTOS.forEach(function (src, i) {
        var b = thumbTpl.cloneNode(true);
        b.setAttribute("aria-label", "View image " + (i + 1));
        b.querySelector("img").src = src;
        b.addEventListener("click", function () { show(i); });
        strip.appendChild(b);
        thumbs.push(b);
      });
      var outline = thumbTpl.style.outline;
      var show = function (i) {
        current = (i + PHOTOS.length) % PHOTOS.length;
        mainImg.src = PHOTOS[current];
        mainImg.alt = "Ảnh cưới " + (current + 1);
        counter.textContent = current + 1 + " / " + PHOTOS.length;
        thumbs.forEach(function (b, k) {
          var on = k === current;
          b.setAttribute("aria-current", on ? "true" : "false");
          b.classList.toggle("scale-105", on);
          b.classList.toggle("shadow-lg", on);
          b.classList.toggle("opacity-60", !on);
          b.style.outline = on ? outline || "#c5a165 solid 2px" : "";
          b.style.outlineOffset = on ? "2px" : "";
        });
        if (thumbs[current].scrollIntoView) thumbs[current].scrollIntoView({ block: "nearest", inline: "center" });
      };
      prev.addEventListener("click", function (e) { e.stopPropagation(); show(current - 1); });
      next.addEventListener("click", function (e) { e.stopPropagation(); show(current + 1); });
      dialog.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") show(current - 1);
        if (e.key === "ArrowRight") show(current + 1);
      });
      dialog.addEventListener("click", function (e) {
        if (e.target === dialog || e.target.classList.contains("modal-box")) dialog.close();
      });
      openLightbox = function (i) {
        show(i);
        if (!dialog.open) dialog.showModal();
      };
    }

    var more = document.querySelector(".bg-black\\/55 span");
    if (more) more.textContent = "+" + Math.max(PHOTOS.length - 4, 0);
    var tiles = document.querySelectorAll('img[alt^="Wedding photo"]');
    tiles.forEach(function (im, i) {
      im.src = PHOTOS[i];
      var tile = im.parentElement;
      tile.style.cursor = "pointer";
      tile.addEventListener("click", function () { openLightbox(i); });
    });
  }

  // Thông tin mừng cưới mẫu - thay bằng thông tin thật (và đổi ảnh QR trong images/)
  var GIFTS = [
    { who: "Chú Rể - THIEP DEMO", qr: "images/qr-groom.png", bank: "VietinBank", number: "0000000000", name: "THIEP DEMO" },
    { who: "Cô Dâu - THIEP DEMO", qr: "images/qr-bride.png", bank: "VietinBank", number: "0000000000", name: "THIEP DEMO" }
  ];

  function initGift() {
    var gbtn = document.querySelector('button[aria-label="Mở hộp mừng cưới"]');
    if (!gbtn) return;
    var dlg = document.createElement("dialog");
    dlg.className = "gift-dlg";
    dlg.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;border:0;border-radius:8px;padding:0;overflow:hidden;width:min(576px,94vw);background:#fff;color:" + ACCENT + ";font-family:'Montserrat','Segoe UI',sans-serif";
    var html = '<style>dialog.gift-dlg::backdrop{background:rgba(0,0,0,.6)}</style>' +
      '<div style="position:relative;background:' + ACCENT + ';color:#fff;text-align:center;padding:22px 16px;font-size:22px;font-family:\'cormorant garamond\',serif">Quà cưới' +
      '<button type="button" data-close aria-label="Đóng" style="position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:0;color:#fff;font-size:20px;cursor:pointer">✕</button></div>' +
      '<div style="display:flex;justify-content:center;gap:20px;padding:24px 12px 20px">';
    GIFTS.forEach(function (g) {
      html += '<div style="flex:1;text-align:center;min-width:0"><div style="font-size:13px;margin-bottom:16px">' + g.who + '</div>' +
        '<div style="width:min(160px,100%);aspect-ratio:1;margin:0 auto;border-radius:16px;border:2px solid #eee;box-shadow:0 4px 12px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;background:#fff"><img src="' + g.qr + '" alt="QR ' + g.who + '" style="width:82%;height:82%;object-fit:contain"></div>' +
        '<div style="font-size:10px;margin-top:12px">' + g.bank + '</div><div style="font-size:10px;margin-top:2px;letter-spacing:.05em">' + g.number + '</div>' +
        '<div style="font-size:11px;font-weight:600;margin-top:4px">' + g.name + '</div>' +
        '<a href="' + g.qr + '" download="' + g.qr.split("/").pop() + '" style="display:inline-block;margin-top:10px;background:#f1ece6;color:' + ACCENT + ';border-radius:999px;padding:6px 14px;font-size:11px;text-decoration:none">⭳ Lưu QR</a></div>';
    });
    html += "</div>";
    dlg.innerHTML = html;
    document.body.appendChild(dlg);
    gbtn.addEventListener("click", function () { if (!dlg.open) dlg.showModal(); });
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.hasAttribute("data-close")) dlg.close();
    });
  }

  function initCountdown() {
    var labels = ["ngày", "giờ", "phút", "giây"];
    var units = labels.map(function (label) {
      var labelEl = Array.prototype.find.call(
        document.querySelectorAll("main span"),
        function (el) { return el.textContent.trim() === label; }
      );
      return labelEl && labelEl.parentElement.querySelector("span");
    });
    if (units.some(function (el) { return !el; })) return;

    var target = new Date("2026-12-20T10:30:00+07:00").getTime();
    function update() {
      var remaining = Math.max(0, target - Date.now());
      var values = [
        Math.floor(remaining / 86400000),
        Math.floor((remaining % 86400000) / 3600000),
        Math.floor((remaining % 3600000) / 60000),
        Math.floor((remaining % 60000) / 1000)
      ];
      units.forEach(function (el, i) {
        el.textContent = String(values[i]).padStart(2, "0");
      });
    }
    update();
    window.setInterval(update, 1000);
  }

  function initRsvp() {
    var trigger = document.querySelector('[data-landing-screenshot-id="invite-rsvp"]');
    if (!trigger) return;

    var dialog = document.createElement("dialog");
    dialog.className = "rsvp-dialog";
    dialog.innerHTML =
      '<style>' +
      'dialog.rsvp-dialog{position:fixed;inset:auto;top:50%;left:50%;transform:translate(-50%,-50%);margin:0;border:0;border-radius:16px;padding:0;width:min(448px,calc(100vw - 32px));max-width:none;max-height:85vh;overflow:hidden;background:#fff;color:#171b26;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.24)}' +
      'dialog.rsvp-dialog::backdrop{background:rgba(0,0,0,.62);backdrop-filter:blur(3px)}' +
      '.rsvp-content{position:relative;max-height:85vh;overflow-y:auto;padding:40px 24px 24px}' +
      '.rsvp-close{position:absolute;right:16px;top:16px;display:flex;width:32px;height:32px;align-items:center;justify-content:center;border:0;border-radius:50%;background:#f1f2f5;color:#596273;font-size:19px;cursor:pointer}' +
      '.rsvp-title{margin:0 0 4px;font-size:20px;font-weight:600;line-height:1.35}' +
      '.rsvp-description{margin:0 0 22px;color:#778196;font-size:13px;line-height:1.55}' +
      '.rsvp-name{display:block;margin:0 0 16px;font-size:13px;font-weight:600}' +
      '.rsvp-name input{display:block;box-sizing:border-box;width:100%;height:46px;margin-top:8px;padding:0 15px;border:1px solid #dce1e9;border-radius:13px;background:#fff;color:#202633;font:inherit;font-size:14px;font-weight:400;outline:none}' +
      '.rsvp-name input:focus{border-color:#b8966a;box-shadow:0 0 0 2px rgba(184,150,106,.16)}' +
      '.rsvp-name input::placeholder{color:#a0a9b8}' +
      '.rsvp-legend{margin:0 0 8px;padding:0;font-size:13px;font-weight:600}' +
      '.rsvp-choice{display:flex;align-items:center;gap:12px;min-height:54px;margin-top:8px;padding:0 12px;border:2px solid #f0f1f3;border-radius:13px;background:#fafbfc;color:#374151;font-size:14px;font-weight:500;cursor:pointer;transition:border-color .2s,background-color .2s}' +
      '.rsvp-choice:hover{border-color:#e5e7eb;background:#f8f9fa}' +
      '.rsvp-choice input{position:absolute;width:1px;height:1px;opacity:0}' +
      '.rsvp-choice-icon{display:flex;width:32px;height:32px;flex:none;align-items:center;justify-content:center;border-radius:50%;background:#e5e7eb;color:#667085;font-size:17px}' +
      '.rsvp-choice input:checked+.rsvp-choice-icon{background:#b8966a;color:#fff}' +
      '.rsvp-choice input:focus-visible+.rsvp-choice-icon{outline:2px solid #b8966a;outline-offset:2px}' +
      '.rsvp-submit{width:100%;height:48px;margin-top:16px;border:0;border-radius:12px;background:#b8966a;color:#fff;font:inherit;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.14);transition:transform .2s,box-shadow .2s}' +
      '.rsvp-submit:hover:not(:disabled){transform:scale(1.02);box-shadow:0 8px 18px rgba(0,0,0,.18)}' +
      '.rsvp-submit:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}' +
      '.rsvp-status{margin:12px 0 0;color:#596273;font-size:12px;line-height:1.5}' +
      '</style>' +
      '<div class="rsvp-content">' +
      '<button class="rsvp-close" type="button" aria-label="Đóng">×</button>' +
      '<h2 class="rsvp-title">Xác nhận tham dự</h2>' +
      '<p class="rsvp-description">Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi. Xin xác nhận để chúng tôi chuẩn bị chu đáo nhất.</p>' +
      '<form>' +
      '<label class="rsvp-name">Tên của bạn<input name="guestName" type="text" autocomplete="off" maxlength="120" placeholder="Nhập tên của bạn" required></label>' +
      '<fieldset style="border:0;margin:0;padding:0"><legend class="rsvp-legend">Bạn sẽ đến chứ?</legend>' +
      '<label class="rsvp-choice"><input type="radio" name="attendance" value="yes" checked><span class="rsvp-choice-icon" aria-hidden="true">✓</span><span>Tôi sẽ đến</span></label>' +
      '<label class="rsvp-choice"><input type="radio" name="attendance" value="no"><span class="rsvp-choice-icon" aria-hidden="true">×</span><span>Rất tiếc, tôi không thể đến</span></label>' +
      '</fieldset>' +
      '<button class="rsvp-submit" type="submit" disabled>Gửi xác nhận</button>' +
      '<p class="rsvp-status" role="status" aria-live="polite" hidden></p>' +
      '</form></div>';
    document.body.appendChild(dialog);

    var form = dialog.querySelector("form");
    var nameInput = form.querySelector('input[name="guestName"]');
    var submit = form.querySelector(".rsvp-submit");
    var status = dialog.querySelector(".rsvp-status");
    function updateSubmitState() {
      submit.disabled = nameInput.value.trim().length === 0;
    }
    trigger.addEventListener("click", function () {
      form.reset();
      nameInput.value = "";
      form.querySelector('input[value="yes"]').checked = true;
      updateSubmitState();
      status.hidden = true;
      if (!dialog.open) dialog.showModal();
    });
    nameInput.addEventListener("input", updateSubmitState);
    dialog.querySelector(".rsvp-close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      status.textContent = "Đây là bản xem thử; phản hồi chưa được gửi đến cô dâu chú rể.";
      status.hidden = false;
    });
  }

  initGallery();
  initGift();
  initCountdown();
  initRsvp();

  // Các khối không có sẵn lớp reveal trong bản lưu
  var extra = [];
  document.querySelectorAll('img[alt^="Wedding photo"]').forEach(function (im, i) {
    var tile = im.parentElement;
    tile.style.transitionDelay = i * 120 + "ms";
    extra.push(tile);
  });
  var giftSec = document.querySelector('button[aria-label="Mở hộp mừng cưới"]');
  giftSec = giftSec && giftSec.closest("section");
  if (giftSec) [].forEach.call(giftSec.children, function (c) { extra.push(c); });
  var thanks = document.querySelector("main section:last-of-type");
  if (thanks && thanks !== giftSec) [].forEach.call(thanks.children, function (c) { if (!c.querySelector("." + P + "-reveal")) extra.push(c); });
  extra.forEach(function (el) { el.classList.add(P + "-reveal"); });
})();
