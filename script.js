(function () {
  "use strict";

  var phonenumber = "+6285161159867";

  var yesBtn = document.getElementById("yesBtn");
  var noBtn = document.getElementById("noBtn");
  var hint = document.getElementById("hint");
  var mascot = document.getElementById("mascot");
  var inviteCard = document.getElementById("invite-card");
  var successCard = document.getElementById("success-card");
  var restartBtn = document.getElementById("restartBtn");
  var heartsLayer = document.querySelector(".floating-hearts");

  // pesan lucu yang berganti tiap kali menghindar / klik "iya" makin besar
  var noMessages = [
    "yakin? coba pencet lagi deh 😏",
    "eh jangan yang itu 🙈",
    "tombolnya malu-malu tuh 😆",
    "hmm... yang satunya lebih enak diklik 💕",
    "susah ya milihnya? klik iya aja 🥺",
    "aku tunggu loh... 👉👈",
  ];
  var yesGrowMessages = [
    "iya kan? 😳",
    "tuh tombol iya makin gede 😍",
    "gampang kok, tinggal pencet 💖",
    "aku udah senyum-senyum nih 🥰",
  ];

  var noClicks = 0;
  var yesScale = 1;

  // ---------- hati mengambang ----------
  var HEART_CHARS = ["🛵", "😉", "🔥", "🩷", "🙏", "🎈"];
  function spawnHeart() {
    if (!heartsLayer) return;
    var h = document.createElement("span");
    h.className = "heart";
    h.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 16 + Math.random() * 22 + "px";
    var dur = 6 + Math.random() * 5;
    h.style.animationDuration = dur + "s";
    heartsLayer.appendChild(h);
    setTimeout(function () {
      h.remove();
    }, dur * 1000);
  }

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reduceMotion) {
    setInterval(spawnHeart, 900);
  }

  // ---------- direct ke whatsapp ----------
  var yesBtn = document.getElementById("yesBtn");

  yesBtn.addEventListener("click", function () {
    var nomorHp = "6285161159867"; // Ganti dengan nomor WhatsApp Anda (gunakan kode negara, tanpa tanda +)
    var pesan = encodeURIComponent(" Iya, aku maafin ! 😊"); // Isi pesan otomatis

    // Buka WhatsApp di tab baru
    var urlWhatsapp = "https://wa.me/" + nomorHp + "?text=" + pesan;
    // window.open(urlWhatsapp, "_blank");

   // MENAMBAHKAN FUNGSI SETTIMEOUT (JEDA WAKTU)
    setTimeout(function() {
        // Mengalihkan halaman langsung ke aplikasi WhatsApp setelah 2 detik
        window.location.href = urlWhatsapp;
    }, 4000); // 4000 milidetik = 4 detik
    });

  // ---------- tombol "tidak" yang kabur ----------
  function moveNoButton() {
    // pertama kali: lepaskan dari alur normal
    if (!noBtn.classList.contains("runaway")) {
      var rect = noBtn.getBoundingClientRect();
      noBtn.classList.add("runaway");
      noBtn.style.width = rect.width + "px";
      noBtn.style.top = rect.top + "px";
      noBtn.style.left = rect.left + "px";
    }

    var bw = noBtn.offsetWidth;
    var bh = noBtn.offsetHeight;
    var pad = 12;
    var maxX = window.innerWidth - bw - pad;
    var maxY = window.innerHeight - bh - pad;
    var newX = Math.max(pad, Math.random() * maxX);
    var newY = Math.max(pad, Math.random() * maxY);

    noBtn.style.left = newX + "px";
    noBtn.style.top = newY + "px";
    noBtn.style.transform =
      "rotate(" + (Math.random() * 24 - 12) + "deg) scale(0.95)";
  }

  function growYes() {
    yesScale = Math.min(yesScale + 0.12, 1.9);
    yesBtn.style.transform = "scale(" + yesScale + ")";
  }

  function bumpMascot() {
    if (!mascot) return;
    mascot.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.18)" },
        { transform: "scale(1)" },
      ],
      { duration: 320, easing: "ease-out" }
    );
  }

  function handleNoAttempt() {
    noClicks++;
    moveNoButton();
    growYes();
    bumpMascot();
    if (hint) {
      hint.textContent = noMessages[(noClicks - 1) % noMessages.length];
    }
  }

  // hindari saat hover (desktop) dan saat diklik/disentuh (mobile)
  noBtn.addEventListener("mouseenter", handleNoAttempt);
  noBtn.addEventListener("click", function (e) {
    e.preventDefault();
    handleNoAttempt();
  });
  noBtn.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      handleNoAttempt();
    },
    { passive: false }
  );

  // dorongan lembut kalau user hanya hover tombol iya beberapa kali
  var yesHoverCount = 0;
  yesBtn.addEventListener("mouseenter", function () {
    yesHoverCount++;
    if (hint && yesHoverCount % 2 === 0) {
      hint.textContent =
        yesGrowMessages[
        Math.floor(Math.random() * yesGrowMessages.length)
        ];
    }
  });

  // ---------- konfeti hati saat "iya" ----------
  function celebrate() {
    if (reduceMotion) return;
    for (var i = 0; i < 42; i++) {
      (function (i) {
        setTimeout(function () {
          spawnHeart();
        }, i * 45);
      })(i);
    }
  }

  function showSuccess() {
    celebrate();
    inviteCard.hidden = true;
    // kembalikan tombol tidak ke posisi normal jika layar diulang nanti
    successCard.hidden = false;
    successCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  yesBtn.addEventListener("click", showSuccess);

  // ---------- ulangi ----------
  restartBtn.addEventListener("click", function () {
    successCard.hidden = true;
    inviteCard.hidden = false;

    // reset tombol tidak
    noClicks = 0;
    yesScale = 1;
    yesBtn.style.transform = "scale(1)";
    noBtn.classList.remove("runaway");
    noBtn.removeAttribute("style");
    if (hint) hint.textContent = "psst, tekan tombolnya ya 😳";

    inviteCard.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // jaga tombol kabur tetap di dalam layar saat resize
  window.addEventListener("resize", function () {
    if (noBtn.classList.contains("runaway")) {
      var bw = noBtn.offsetWidth;
      var bh = noBtn.offsetHeight;
      var maxX = window.innerWidth - bw - 12;
      var maxY = window.innerHeight - bh - 12;
      var curX = parseFloat(noBtn.style.left) || 0;
      var curY = parseFloat(noBtn.style.top) || 0;
      noBtn.style.left = Math.min(curX, maxX) + "px";
      noBtn.style.top = Math.min(curY, maxY) + "px";
    }
  });
})();

