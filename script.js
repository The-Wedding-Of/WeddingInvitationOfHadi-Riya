"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // PENGATURAN (UBAH DI SINI)
  // ==========================================
  // Nomor WhatsApp penerima RSVP. Format: 62 + nomor tanpa 0 di depan.
  const RSVP_WA_NUMBER = "6285774779700";

  // ELEMEN
  const $ = (selector) => document.querySelector(selector);

  const opening = $("#opening");
  const site = $("#site");
  const audio = $("#bgMusic");
  const musicButton = $("#musicToggle");
  const toast = $("#toast");

  let opened = false;
  let particleInterval = null;
  let toastTimer = null;

  // ==========================================
  // NAMA TAMU OTOMATIS DARI TAUTAN UNDANGAN
  // Contoh: ?to=Budi%20Santoso
  // ==========================================
  const params = new URLSearchParams(window.location.search);
  const invitedName = params.get("to");

  const guestName = $("#guestName");
  const rsvpName = $("#rsvpName");

  if (invitedName && invitedName.trim()) {
    const name = invitedName.trim().slice(0, 100);
    if (guestName) guestName.value = name;
    if (rsvpName) rsvpName.value = name;
  }

  // NOTIFIKASI
  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }

  // BUKA UNDANGAN
  const openButton = $("#openButton");

  if (openButton) {
    openButton.addEventListener("click", async function () {
      if (opened) return;
      opened = true;

      const currentGuestName = $("#guestName");
      const currentRsvpName = $("#rsvpName");

      if (currentGuestName && currentRsvpName && currentGuestName.value.trim()) {
        currentRsvpName.value = currentGuestName.value.trim();
      }

      if (opening) opening.classList.add("closed");
      if (site) site.classList.add("ready");

      startParticles();

      if (audio) {
        try {
          await audio.play();
          setMusicState(true);
        } catch (error) {
          showToast("Undangan terbuka. Tekan tombol musik untuk memutar lagu.");
        }
      }

      setTimeout(function () {
        if (opening) opening.style.display = "none";
      }, 1100);
    });
  }

  // MUSIK
  function setMusicState(playing) {
    if (!musicButton) return;

    musicButton.classList.toggle("playing", playing);
    musicButton.textContent = playing ? "♫" : "♪";
    musicButton.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
  }

  if (musicButton && audio) {
    musicButton.addEventListener("click", async function () {
      if (audio.paused) {
        try {
          await audio.play();
          setMusicState(true);
        } catch (error) {
          showToast("Musik tidak dapat diputar.");
        }
      } else {
        audio.pause();
        setMusicState(false);
      }
    });

    audio.addEventListener("play", function () { setMusicState(true); });
    audio.addEventListener("pause", function () { setMusicState(false); });
    audio.addEventListener("ended", function () { setMusicState(false); });
  }

  // COUNTDOWN PERNIKAHAN
  const weddingDate = new Date("2026-12-12T12:00:00+07:00").getTime();

  function updateCountdown() {
    const daysElement = $("#days");
    const hoursElement = $("#hours");
    const minutesElement = $("#minutes");
    const secondsElement = $("#seconds");
    const countdownMessage = $("#countdownMessage");

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
      return;
    }

    let remaining = weddingDate - Date.now();

    if (remaining <= 0) {
      daysElement.textContent = "000";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      if (countdownMessage) {
        countdownMessage.textContent =
          "Hari istimewa kita telah tiba atau telah berlalu.";
      }
      return;
    }

    const days = Math.floor(remaining / 86400000);
    remaining %= 86400000;

    const hours = Math.floor(remaining / 3600000);
    remaining %= 3600000;

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    daysElement.textContent = String(days).padStart(3, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");

    if (countdownMessage) {
      countdownMessage.textContent =
        "Kami menantikan hari bahagia ini bersama Anda.";
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // TAMBAHKAN KE KALENDER
  const calendarButton = $("#calendarButton");

  if (calendarButton) {
    calendarButton.addEventListener("click", function () {
      const calendarData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Hadi and Riya//Wedding Invitation//ID",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        "UID:hadi-riya-20261212@wedding",
        "DTSTAMP:20261016T000000Z",
        "DTSTART:20261212T050000Z",
        "DTEND:20261212T070000Z",
        "SUMMARY:Pemberkatan Pernikahan Hadi & Riya",
        "LOCATION:Vihara Sila Paramita, Jakarta Timur",
        "DESCRIPTION:Pemberkatan Hadianto Kurniawan Tan dan Ilmi Riadoh",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([calendarData], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "Pemberkatan-Hadi-Riya.ics";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  }

  // ANIMASI SCROLL
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("visible"); });
  }

  // PARTIKEL EMAS
  function createParticle() {
    if (document.hidden || !opened) return;

    const container = $("#particles");
    if (!container) return;

    const particle = document.createElement("span");
    const symbols = ["✧", "✦", "❋", "·"];

    particle.className = "particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.left = Math.random() * 100 + "%";
    particle.style.fontSize = 8 + Math.random() * 12 + "px";
    particle.style.setProperty("--drift", Math.round(Math.random() * 160 - 80) + "px");
    particle.style.animationDuration = 7 + Math.random() * 7 + "s";

    container.appendChild(particle);

    setTimeout(function () { particle.remove(); }, 15000);
  }

  function startParticles() {
    if (particleInterval) return;

    for (let i = 0; i < 15; i++) {
      setTimeout(createParticle, i * 180);
    }

    particleInterval = setInterval(createParticle, 650);
  }

  // PARALLAX FOTO
  const heroPhoto = $(".hero-photo");

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("mousemove", function (event) {
      if (!opened || !heroPhoto) return;

      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;

      heroPhoto.style.translate = x + "px " + y + "px";
    });
  }

  // GALERI FOTO
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const closeLightboxButton = $("#closeLightbox");

  document.querySelectorAll(".gallery-item").forEach(function (item) {
    item.addEventListener("click", function () {
      if (!lightbox || !lightboxImage) return;

      const imagePath = item.dataset.image;
      if (!imagePath) return;

      lightboxImage.src = imagePath;
      lightbox.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove("show");
    if (lightboxImage) lightboxImage.removeAttribute("src");
    document.body.style.overflow = "";
  }

  if (closeLightboxButton) {
    closeLightboxButton.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLightbox();
  });

  // SALIN REKENING DAN GOPAY
  document.querySelectorAll(".copy-button").forEach(function (button) {
    button.addEventListener("click", async function () {
      const number = button.dataset.copy || "";

      if (!number) {
        showToast("Nomor rekening belum tersedia.");
        return;
      }

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(number);
          showToast("Nomor berhasil disalin: " + number);
        } else {
          showToast("Silakan salin nomor secara manual: " + number);
        }
      } catch (error) {
        showToast("Silakan salin nomor secara manual: " + number);
      }
    });
  });

  // ==========================================
  // RSVP DAN UCAPAN
  // Disimpan di browser tamu (untuk tampilan) DAN dikirim ke WhatsApp.
  // ==========================================
  const storageKey = "hadiRiyaWedding2026";

  function getEntries() {
    try {
      const entries = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(entries) ? entries : [];
    } catch (error) {
      return [];
    }
  }

  function renderEntries() {
    const container = $("#notesContainer");
    if (!container) return;

    container.replaceChildren();

    const entries = getEntries().slice().reverse();

    if (entries.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted small";
      empty.textContent = "Jadilah yang pertama mengirimkan doa dan ucapan.";
      container.appendChild(empty);
      return;
    }

    entries.forEach(function (entry) {
      const article = document.createElement("article");
      article.className = "guest-note";

      const name = document.createElement("strong");
      name.textContent = entry.name || "Tamu";

      const status = document.createElement("small");
      status.textContent =
        "Konfirmasi: " +
        (entry.attendance || "Belum diisi") +
        (entry.attendance === "Hadir" ? " · " + (entry.count || "1") + " orang" : "");

      article.append(name, status);

      if (entry.message) {
        const message = document.createElement("p");
        message.textContent = entry.message;
        article.appendChild(message);
      }

      container.appendChild(article);
    });
  }

  function sendRsvpToWhatsApp(data) {
    if (!RSVP_WA_NUMBER) return;

    let text =
      "RSVP Pernikahan Hadi & Riya\n" +
      "Nama: " + data.name + "\n" +
      "Kehadiran: " + data.attendance;

    if (data.attendance === "Hadir") {
      text += "\nJumlah: " + data.count + " orang";
    }

    if (data.message) {
      text += "\nUcapan: " + data.message;
    }

    const url =
      "https://wa.me/" + RSVP_WA_NUMBER + "?text=" + encodeURIComponent(text);

    // Jika popup diblokir browser, buka di tab yang sama.
    const win = window.open(url, "_blank");
    if (!win) window.location.href = url;
  }

  const guestForm = $("#guestForm");

  if (guestForm) {
    guestForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const currentRsvpName = $("#rsvpName");
      const attendanceInput = $("#attendance");
      const guestCount = $("#guestCount");
      const guestMessage = $("#guestMessage");
      const status = $("#formStatus");

      if (!currentRsvpName || !attendanceInput || !guestCount || !guestMessage || !status) {
        showToast("Formulir belum lengkap.");
        return;
      }

      const name = currentRsvpName.value.trim();
      const attendance = attendanceInput.value;
      const count = guestCount.value;
      const message = guestMessage.value.trim();

      if (!name || !attendance) {
        status.textContent = "Mohon isi nama dan konfirmasi kehadiran.";
        return;
      }

      const entry = {
        name: name,
        attendance: attendance,
        count: attendance === "Hadir" ? count : "0",
        message: message,
        date: new Date().toISOString()
      };

      // Simpan di browser (agar tamu bisa melihat ucapannya sendiri)
      try {
        const entries = getEntries();
        entries.push(entry);
        localStorage.setItem(storageKey, JSON.stringify(entries));
        renderEntries();
      } catch (error) {
        // Abaikan; yang utama adalah pengiriman ke WhatsApp.
      }

      status.textContent = "Terima kasih! Silakan tekan Kirim di WhatsApp untuk menyelesaikan RSVP.";

      guestMessage.value = "";
      attendanceInput.value = "";
      guestCount.value = "1";

      // Kirim ke WhatsApp pengantin
      sendRsvpToWhatsApp(entry);
    });
  }

  renderEntries();

  // PEMERIKSAAN FOTO
  document.querySelectorAll("img").forEach(function (image) {
    image.addEventListener("error", function () {
      console.warn("Foto gagal dimuat. Periksa nama file:", image.getAttribute("src"));
    });
  });
});
