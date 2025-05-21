document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const currentYearSpan = document.getElementById("currentYear");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const navLinks = document.querySelectorAll("header nav a");

  const mainContainer = document.getElementById("mainContainer");
  const pageHeader = document.getElementById("pageHeader");
  const headerPromptEl = document.getElementById("headerPrompt");
  const mainNavItems = document.querySelectorAll("#mainNav .nav-item");
  const themeSwitcherEl = document.querySelector(".theme-switcher");
  const pageFooter = document.getElementById("pageFooter");
  const allSections = document.querySelectorAll(".page-section");

  // --- Global Config ---
  const VERY_FAST_TYPE_SPEED = 15;
  const QUICK_STAGGER_DELAY = 60;

  // --- Utility: Rapid Typing/Reveal Effect ---
  function quickRevealText(element, text, speed, callback) {
    let i = 0;
    element.innerHTML = "";
    element.classList.add("visible");

    function typing() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typing, speed);
      } else {
        if (callback) callback();
      }
    }
    if (text && text.length > 0) {
      typing();
    } else if (callback) {
      element.textContent = text;
      callback();
    }
  }

  // --- Utility: Sequential Class Adder (Fast) ---
  async function revealSequentially(
    elements,
    className = "visible",
    delay = QUICK_STAGGER_DELAY
  ) {
    for (let i = 0; i < elements.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      elements[i].classList.add(className);
    }
  }

  // --- Page Load Animation ---
  async function animatePageLoad() {
    mainContainer.classList.remove("hidden-initially");
    mainContainer.classList.add("loaded");

    pageHeader.classList.add("visible");
    quickRevealText(
      headerPromptEl,
      "C:\\Users\\Bibesh>",
      VERY_FAST_TYPE_SPEED,
      async () => {
        await revealSequentially(
          Array.from(mainNavItems),
          "visible",
          QUICK_STAGGER_DELAY / 2
        );
        themeSwitcherEl.classList.add("visible");
      }
    );

    let cumulativeDelay = 300;
    for (const section of allSections) {
      await new Promise((resolve) => setTimeout(resolve, cumulativeDelay));
      await animateSection(section);
      const divider = section.nextElementSibling;
      if (divider && divider.classList.contains("section-divider")) {
        divider.classList.add("visible");
      }
      cumulativeDelay = QUICK_STAGGER_DELAY;
    }

    setTimeout(
      () => pageFooter.classList.add("visible"),
      cumulativeDelay + allSections.length * QUICK_STAGGER_DELAY
    );
  }

  async function animateSection(section) {
    const promptEl = section.querySelector(".section-prompt");
    const titleEl = section.querySelector(".section-title");
    const contentWrapper = section.querySelector(".section-content");

    const contentItems = section.querySelectorAll(
      ".section-content > *:not(script):not(style):not(.skills-category-title):not(.skill-items-container), " +
        ".timeline > .timeline-item, .education-item, .project-subsection > h3, .project-subsection > .project-item, .social-links > a, .social-links > .button"
    );

    const sectionName =
      section.id === "home"
        ? "Introduction"
        : section.id.charAt(0).toUpperCase() + section.id.slice(1);

    if (promptEl) {
      await new Promise((resolve) =>
        quickRevealText(
          promptEl,
          `C:\\Users\\Bibesh\\${sectionName}>`,
          VERY_FAST_TYPE_SPEED,
          resolve
        )
      );
    }
    if (titleEl) {
      titleEl.classList.add("visible");
    }

    if (contentWrapper) contentWrapper.classList.add("visible");

    if (section.id === "skills") {
      await animateSkillsItems(contentWrapper);
    } else if (contentItems.length > 0) {
      await revealSequentially(
        Array.from(contentItems),
        "visible",
        QUICK_STAGGER_DELAY / 2
      );
    }
  }

  // --- Theme Switcher ---
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    document.body.classList.add(currentTheme);
    if (currentTheme === "light-theme") {
      themeToggle.checked = true;
    }
  } else {
    document.body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark-theme");
  }

  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      localStorage.setItem("theme", "light-theme");
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark-theme");
    }
  });

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  async function animateSkillsItems(skillsGridEl) {
    if (!skillsGridEl) return;
    skillsGridEl.innerHTML = ""; 

    const skillsData = [
      {
        category: "Languages & Frameworks",
        skills: [
          { name: "C#", logo: "[C#]", color: "var(--blue-accent)" },
          {
            name: ".NET Core / .NET 6+",
            logo: "[.NET]",
            color: "var(--blue-accent)",
          },
          {
            name: "ASP.NET Core (MVC, Web API, Razor)",
            logo: "[ASP]",
            color: "var(--blue-accent)",
          },
          {
            name: "Entity Framework Core",
            logo: "[EF]",
            color: "var(--blue-accent)",
          },
          { name: "LINQ", logo: "[LINQ]", color: "var(--blue-accent)" },
          { name: "HTML5", logo: "[H5]", color: "#e34c26" },
          { name: "CSS3", logo: "[C3]", color: "#2965f1" },
          { name: "JavaScript", logo: "[JS]", color: "#f0db4f" },
          { name: "jQuery", logo: "[jQ]", color: "#0769ad" },
          { name: "Blazor", logo: "[Blzr]", color: "var(--blue-accent)" },
          { name: "Dart", logo: "[Dart]", color: "#0175C2" },
          { name: "Flutter", logo: "[Fltr]", color: "#02569B" },
        ],
      },
      {
        category: "Databases",
        skills: [
          {
            name: "SQL Server",
            logo: "[SQLS]",
            color: "var(--current-accent1)",
          },
          { name: "PostgreSQL", logo: "[PgSQL]", color: "#336791" },
          { name: "MySQL", logo: "[MySQL]", color: "#4479A1" },
        ],
      },
      {
        category: "Cloud & DevOps",
        skills: [
          { name: "Docker", logo: "[Dockr]", color: "#2496ed" },
          { name: "Git", logo: "[Git]", color: "#F05032" },
          { name: "GitHub", logo: "[GH]", color: "var(--current-text)" },
        ],
      },
      {
        category: "Tools & Concepts",
        skills: [
          {
            name: "Visual Studio / VS Code",
            logo: "[VS/VSC]",
            color: "#007ACC",
          },
          {
            name: "RESTful APIs",
            logo: "[API]",
            color: "var(--current-accent2)",
          },
          {
            name: "Unit Testing (xUnit, NUnit)",
            logo: "[Test]",
            color: "var(--current-accent1)",
          },
          {
            name: "Dependency Injection",
            logo: "[DI]",
            color: "var(--current-accent2)",
          },
          {
            name: "SOLID Principles",
            logo: "[SOLID]",
            color: "var(--current-accent2)",
          },
          {
            name: "Agile/Scrum",
            logo: "[Agile]",
            color: "var(--current-accent1)",
          },
        ],
      },
    ];

    const allCategoryTitlesForReveal = [];
    const allSkillItemsForReveal = [];

    skillsData.forEach((categoryObj) => {
      const categoryTitle = document.createElement("h3");
      categoryTitle.className = "skills-category-title hidden-initially";
      categoryTitle.textContent = categoryObj.category;
      skillsGridEl.appendChild(categoryTitle);
      allCategoryTitlesForReveal.push(categoryTitle);

      const itemsContainer = document.createElement("div");
      itemsContainer.className = "skill-items-container";

      categoryObj.skills.forEach((skill) => {
        const skillItem = document.createElement("div");
        skillItem.className = "skill-item hidden-initially";

        const logoSpan = document.createElement("span");
        logoSpan.className = "skill-logo";
        logoSpan.textContent = skill.logo;
        if (skill.color) logoSpan.style.color = skill.color;

        const nameSpan = document.createElement("span");
        nameSpan.className = "skill-name";
        nameSpan.textContent = skill.name;

        const statusSpan = document.createElement("span");
        statusSpan.className = "skill-status";
        statusSpan.textContent = "[OK]";

        skillItem.appendChild(logoSpan);
        skillItem.appendChild(nameSpan);
        skillItem.appendChild(statusSpan);
        itemsContainer.appendChild(skillItem);
        allSkillItemsForReveal.push(skillItem);
      });
      skillsGridEl.appendChild(itemsContainer);
    });

    await revealSequentially(
      allCategoryTitlesForReveal,
      "visible",
      QUICK_STAGGER_DELAY
    );
    await revealSequentially(
      allSkillItemsForReveal,
      "visible",
      QUICK_STAGGER_DELAY / 2.5
    );
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formStatus.textContent = "";
      formStatus.style.color = "";
      formStatus.classList.remove("visible");

      let isValid = true;
      const nameField = {
        el: document.getElementById("name"),
        msg: "Name is required.",
      };
      const emailField = {
        el: document.getElementById("email"),
        msg: "Email is required.",
        invalidMsg: "Invalid email format.",
      };
      const messageField = {
        el: document.getElementById("message"),
        msg: "Message is required.",
      };

      [nameField, emailField, messageField].forEach((field) =>
        clearError(field.el)
      );

      if (!nameField.el.value.trim()) {
        displayError(nameField.el, nameField.msg);
        isValid = false;
      }
      if (!emailField.el.value.trim()) {
        displayError(emailField.el, emailField.msg);
        isValid = false;
      } else if (!isValidEmail(emailField.el.value.trim())) {
        displayError(emailField.el, emailField.invalidMsg);
        isValid = false;
      }
      if (!messageField.el.value.trim()) {
        displayError(messageField.el, messageField.msg);
        isValid = false;
      }

      if (isValid) {
        const submitButton = contactForm.querySelector(".contactForm-submit");
        submitButton.disabled = true;
        submitButton.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Sending...';

        emailjs
          .sendForm("service_yl2hki7", "template_e2f9xvk", contactForm)
          .then(() => {
            submitButton.innerHTML =
              '<i class="fas fa-check"></i> Message Sent!';
            submitButton.style.backgroundColor = "#38a169";

            formStatus.textContent = "Message sent successfully!";
            formStatus.style.color = "var(--current-accent1)";
            formStatus.classList.add("visible");

            setTimeout(() => {
              contactForm.reset();
              submitButton.innerHTML = "Send Message";
              submitButton.style.backgroundColor = "";
              submitButton.disabled = false;
              formStatus.textContent = "";
              formStatus.classList.remove("visible");
            }, 3000);
          })
          .catch((error) => {
            console.error("EmailJS Error:", error);
            submitButton.innerHTML =
              '<i class="fas fa-times"></i> Failed to Send';
            submitButton.style.backgroundColor = "#e53e3e";

            formStatus.textContent = "Failed to send message. Try again.";
            formStatus.style.color = "var(--current-error)";
            formStatus.classList.add("visible");

            setTimeout(() => {
              submitButton.innerHTML = "Send Message";
              submitButton.style.backgroundColor = "";
              submitButton.disabled = false;
              formStatus.textContent = "";
              formStatus.classList.remove("visible");
            }, 3000);
          });
      } else {
        formStatus.textContent = "Please correct the errors above.";
        formStatus.style.color = "var(--current-error)";
        formStatus.classList.add("visible");
      }
    });
  }

  function displayError(fieldElement, message) {
    const errorElement = fieldElement.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.textContent = message;
    }
    fieldElement.style.borderColor = "var(--current-error)";
  }
  function clearError(fieldElement) {
    const errorElement = fieldElement.nextElementSibling;
    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.textContent = "";
    }
    fieldElement.style.borderColor = "var(--current-accent2)";
  }
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const headerOffset = pageHeader.offsetHeight + 10;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    });
  });

  animatePageLoad();
});
