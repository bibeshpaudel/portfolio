document.addEventListener("DOMContentLoaded", () => {
  const tabsContainer = document.querySelector(".tabs");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");
  const themeToggleButton = document.getElementById("theme-toggle");
  const body = document.body;
  const currentYearSpan = document.getElementById("current-year");
  const portfolioContainer = document.querySelector(".portfolio-container");

  const revealElements = () => {
    const elements = document.querySelectorAll(
      ".job, .project, .education-entry, .skill-category"
    );
    elements.forEach((element, index) => {
      const delay = index * 100;
      setTimeout(() => {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, delay);
    });
  };

  tabsContainer.addEventListener("click", (event) => {
    const clickedButton = event.target.closest(".tab-button");
    if (!clickedButton) return;

    const targetTabId = clickedButton.getAttribute("data-tab");
    const targetTabContent = document.getElementById(targetTabId);

    tabContents.forEach((content) => {
      content.classList.remove("active");
      content.style.opacity = "0";
    });

    tabButtons.forEach((button) => button.classList.remove("active"));

    clickedButton.classList.add("active");

    if (targetTabContent) {
      setTimeout(() => {
        targetTabContent.classList.add("active");
        targetTabContent.style.opacity = "1";
        revealElements();
      }, 300);
    }
  });

  const initAnimations = () => {
    const elements = document.querySelectorAll(
      ".job, .project, .education-entry, .skill-category"
    );
    elements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });
  };

  initAnimations();
  setTimeout(revealElements, 500);

  const applyTheme = (theme) => {
    body.setAttribute("data-theme", theme);
    localStorage.setItem("portfolioTheme", theme);
    if (theme === "dark") {
      themeToggleButton.setAttribute("aria-label", "Switch to light mode");
      portfolioContainer.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
    } else {
      themeToggleButton.setAttribute("aria-label", "Switch to dark mode");
      portfolioContainer.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
    }
  };

  themeToggleButton.addEventListener("click", () => {
    // Add rotation animation
    themeToggleButton.style.transform = "rotate(360deg)";
    setTimeout(() => {
      themeToggleButton.style.transform = "rotate(0)";
    }, 300);

    const currentTheme = body.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(newTheme);
  });

  const savedTheme = localStorage.getItem("portfolioTheme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (prefersDark) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const formInputs = contactForm.querySelectorAll("input, textarea");
    formInputs.forEach((input) => {
      input.addEventListener("focus", () => {
        input.style.transform = "translateY(-3px)";
        input.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
      });

      input.addEventListener("blur", () => {
        input.style.transform = "translateY(0)";
        input.style.boxShadow = "none";
      });
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      let isValid = true;
      const requiredFields = contactForm.querySelectorAll("[required]");

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = "#e53e3e";
          field.style.boxShadow = "0 0 0 3px rgba(229, 62, 62, 0.15)";

          setTimeout(() => {
            field.style.borderColor = "";
            field.style.boxShadow = "";
          }, 2000);
        }
      });

      if (isValid) {
        const submitButton = contactForm.querySelector(".submit-button");
        submitButton.disabled = true;
        submitButton.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Sending...';

        emailjs
          .sendForm("service_id", "template_id", contactForm)
          .then(() => {
            submitButton.innerHTML =
              '<i class="fas fa-check"></i> Message Sent!';
            submitButton.style.backgroundColor = "#38a169";

            setTimeout(() => {
              contactForm.reset();
              submitButton.innerHTML = "Send Message";
              submitButton.style.backgroundColor = "";
              submitButton.disabled = false;
            }, 3000);
          })
          .catch((error) => {
            console.error("EmailJS Error:", error);
            submitButton.innerHTML =
              '<i class="fas fa-times"></i> Failed to Send';
            submitButton.style.backgroundColor = "#e53e3e";

            setTimeout(() => {
              submitButton.innerHTML = "Send Message";
              submitButton.style.backgroundColor = "";
              submitButton.disabled = false;
            }, 3000);
          });
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    document
      .querySelectorAll(
        ".tab-content h2, .skill-category, .job, .project, .education-entry"
      )
      .forEach((element) => {
        observer.observe(element);
      });
  }
});
