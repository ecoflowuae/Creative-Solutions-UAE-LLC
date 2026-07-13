/* ============================================================
   Creative Solutions UAE — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Navbar scroll state ---- */
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 20);
    const toTop = document.querySelector(".to-top");
    if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open);
    });
    links.querySelectorAll("a.nav-link:not(.js-dd)").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.classList.remove("open");
      })
    );
  }

  /* ---- Dropdown (click to toggle on all sizes) ---- */
  document.querySelectorAll(".dropdown").forEach((dd) => {
    const trigger = dd.querySelector(".js-dd");
    if (!trigger) return;
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = dd.classList.contains("open");
      document.querySelectorAll(".dropdown.open").forEach((o) => o.classList.remove("open"));
      dd.classList.toggle("open", !isOpen);
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown.open").forEach((o) => o.classList.remove("open"));
    }
  });

  /* ---- Active nav link by current page ---- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a.nav-link").forEach((a) => {
    const href = a.getAttribute("href");
    if (href && href.split("/").pop() === path && !a.classList.contains("js-dd")) {
      a.classList.add("active");
    }
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---- Catalogue downloads ---- */
  document.querySelectorAll("[data-file]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const file = el.getAttribute("data-file");
      const name = (el.getAttribute("data-name") || "Catalogue").trim();
      if (!file) return;
      const a = document.createElement("a");
      a.href = file;
      a.download = file.split("/").pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast("success", "Download started", name + " is downloading.");
      document.querySelectorAll(".dropdown.open").forEach((o) => o.classList.remove("open"));
    });
  });

  /* ---- Back to top ---- */
  const toTop = document.querySelector(".to-top");
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---- Footer year ---- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Contact form (AJAX → Web3Forms) ---- */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const original = btn.innerHTML;
      const key = form.querySelector("[name=access_key]").value;

      if (!key || key.includes("YOUR_")) {
        showToast(
          "error",
          "Form not configured",
          "Add your Web3Forms access key to enable email delivery."
        );
        return;
      }

      btn.disabled = true;
      btn.innerHTML = "Sending…";
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const data = await res.json();
        if (data.success) {
          form.reset();
          showToast("success", "Message sent", "Thank you — our team will reply to you shortly.");
        } else {
          showToast("error", "Could not send", data.message || "Please try again or email us directly.");
        }
      } catch (err) {
        showToast("error", "Network error", "Please check your connection and try again.");
      } finally {
        btn.disabled = false;
        btn.innerHTML = original;
      }
    });
  }

  /* ---- Toast helper ---- */
  function showToast(type, title, sub) {
    let wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      document.body.appendChild(wrap);
    }
    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    };
    const t = document.createElement("div");
    t.className = "toast " + type;
    t.innerHTML =
      '<div class="ic">' + (icons[type] || icons.success) + "</div>" +
      '<div><div class="tt">' + title + '</div><div class="ts">' + sub + "</div></div>";
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 450);
    }, 4200);
  }
})();
