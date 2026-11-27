/* ==========================================================================
   VETALOV Carpinteros — comportamiento del sitio
   ========================================================================== */

(() => {
  "use strict";

  const SITE = window.VETALOV || {};
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* Datos de contacto ---------------------------------------------------- */
  const phoneHref = "tel:" + String(SITE.phone || "").replace(/[^\d+]/g, "");

  document.querySelectorAll("[data-site]").forEach((el) => {
    const value = SITE[el.dataset.site];
    if (value) el.textContent = value;
  });

  document.querySelectorAll("[data-site-link]").forEach((el) => {
    const key = el.dataset.siteLink;
    let href = "";

    if (key === "phone") href = phoneHref;
    if (key === "email") href = "mailto:" + SITE.email;
    if (key === "whatsapp") {
      href =
        "https://wa.me/" +
        SITE.whatsapp +
        "?text=" +
        encodeURIComponent(
          "Hola VETALOV, me gustaría pedir presupuesto para un proyecto de carpintería."
        );
    }
    if (key === "instagram") href = SITE.instagram;

    if (!href) return;
    el.href = href;

    if (key === "whatsapp" || key === "instagram") {
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    }
  });

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* Cabecera ------------------------------------------------------------- */
  const header = document.querySelector("[data-header]");
  const isHome = document.body.classList.contains("home");

  if (header) {
    const updateHeader = () => {
      const scrolled = window.scrollY > 24;
      header.classList.toggle("is-scrolled", scrolled);
      if (isHome) {
        header.classList.toggle("site-header--transparent", !scrolled);
      }
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* Menú móvil ----------------------------------------------------------- */
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileMenu = document.getElementById("menu-movil");

  if (navToggle && mobileMenu) {
    const setMenu = (open) => {
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      mobileMenu.classList.toggle("is-open", open);
      mobileMenu.setAttribute("aria-hidden", String(!open));
      mobileMenu.inert = !open;
      document.body.classList.toggle("menu-open", open);

      if (open) {
        const firstLink = mobileMenu.querySelector("a");
        if (firstLink) window.setTimeout(() => firstLink.focus(), 60);
      }
    };

    mobileMenu.inert = true;

    navToggle.addEventListener("click", () => {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080 && navToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
      }
    });
  }

  /* Animaciones al hacer scroll ------------------------------------------ */
  const revealItems = document.querySelectorAll("[data-reveal]");

  if (revealItems.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((el) => el.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );

      revealItems.forEach((el) => observer.observe(el));
    }
  }

  /* Galería + lightbox --------------------------------------------------- */
  const gallery = document.querySelector("[data-gallery]");
  const lightbox = document.getElementById("lightbox");

  if (gallery && lightbox) {
    const tiles = Array.from(gallery.querySelectorAll("[data-cat]"));
    const filters = Array.from(document.querySelectorAll("[data-filter]"));
    const countEl = document.querySelector("[data-gallery-count]");

    const imgEl = lightbox.querySelector(".lightbox__img");
    const titleEl = lightbox.querySelector("[data-lb-title]");
    const metaEl = lightbox.querySelector("[data-lb-meta]");
    const countLabel = lightbox.querySelector("[data-lb-count]");
    const closeBtn = lightbox.querySelector("[data-lb-close]");
    const prevBtn = lightbox.querySelector("[data-lb-prev]");
    const nextBtn = lightbox.querySelector("[data-lb-next]");
    let currentIndex = 0;

    const visibleTiles = () => tiles.filter((tile) => !tile.hidden);

    const render = (index) => {
      const list = visibleTiles();
      if (!list.length) return;

      currentIndex = (index + list.length) % list.length;
      const tile = list[currentIndex];

      imgEl.src = tile.dataset.full;
      imgEl.alt = tile.dataset.alt || "";
      if (titleEl) titleEl.textContent = tile.dataset.title || "";
      if (metaEl) {
        metaEl.textContent = [tile.dataset.project, tile.dataset.catLabel]
          .filter(Boolean)
          .join(" · ");
      }
      if (countLabel) {
        countLabel.textContent = currentIndex + 1 + " / " + list.length;
      }
    };

    const openLightbox = () => {
      document.body.classList.add("lightbox-open");
      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
      } else {
        lightbox.setAttribute("open", "");
      }
    };

    const closeLightbox = () => {
      if (typeof lightbox.close === "function") {
        lightbox.close();
      } else {
        lightbox.removeAttribute("open");
        document.body.classList.remove("lightbox-open");
      }
    };

    tiles.forEach((tile) => {
      tile.addEventListener("click", () => {
        render(visibleTiles().indexOf(tile));
        openLightbox();
      });
    });

    filters.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.filter;

        filters.forEach((btn) => {
          btn.setAttribute("aria-pressed", String(btn === button));
        });

        let shown = 0;
        tiles.forEach((tile) => {
          const visible = value === "all" || tile.dataset.cat === value;
          tile.hidden = !visible;
          if (visible) shown += 1;
        });

        if (countEl) {
          countEl.textContent = shown + (shown === 1 ? " proyecto" : " proyectos");
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", () => render(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => render(currentIndex + 1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        render(currentIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        render(currentIndex + 1);
      }
    });

    lightbox.addEventListener("close", () => {
      document.body.classList.remove("lightbox-open");
    });
  }

  /* Formulario de contacto ----------------------------------------------- */
  const contactForm = document.querySelector("[data-contact-form]");

  if (contactForm) {
    const status = contactForm.querySelector("[data-form-status]");

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const data = new FormData(contactForm);
      const lines = [
        "Nombre: " + (data.get("nombre") || ""),
        "Teléfono: " + (data.get("telefono") || ""),
        "Email: " + (data.get("email") || "—"),
        "Tipo de proyecto: " + (data.get("tipo") || ""),
        "Localidad: " + (data.get("localidad") || "—"),
        "",
        String(data.get("mensaje") || ""),
      ];

      const subject =
        "Presupuesto · " + data.get("tipo") + " · " + data.get("nombre");
      const href =
        "mailto:" +
        SITE.email +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));

      if (status) {
        status.textContent =
          "Abriendo tu programa de correo… Si no se abre, escríbenos por WhatsApp.";
      }

      window.location.href = href;
    });
  }
})();
