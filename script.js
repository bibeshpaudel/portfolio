document.addEventListener("DOMContentLoaded", () => {
  // --- Mouse Grid Spotlight ---
  const spotlight = document.getElementById("gridSpotlight");
  const gameDashboard = document.querySelector(".game-dashboard");
  if (spotlight) {
    let rafPending = false;

    document.addEventListener("mousemove", (e) => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        // Suppress spotlight when mouse is inside the game panel
        if (gameDashboard) {
          const r = gameDashboard.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right &&
            e.clientY >= r.top && e.clientY <= r.bottom) {
            spotlight.style.opacity = "0";
            rafPending = false;
            return;
          }
        }
        spotlight.style.setProperty("--mx", e.clientX + "px");
        spotlight.style.setProperty("--my", e.clientY + "px");
        spotlight.style.opacity = "0.2";
        rafPending = false;
      });
    });

    document.addEventListener("mouseleave", () => {
      spotlight.style.opacity = "0";
    });
  }

  const mainContainer = document.getElementById("mainContainer");
  const sidebarNav = document.getElementById("sidebarNav");
  const navItems = document.querySelectorAll(".sidebar-nav .nav-item, .mobile-nav-dock .dock-item");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const currentYearSpan = document.getElementById("currentYear");
  const scrollProgress = document.getElementById("scrollProgress");

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const sections = document.querySelectorAll(".page-section");

  // --- Dynamic Year Setup ---
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- Theme Switching ---
  const savedTheme = localStorage.getItem("theme") || "light-theme";
  document.body.className = savedTheme;

  themeToggleBtn.addEventListener("click", () => {
    if (document.body.classList.contains("light-theme")) {
      document.body.classList.replace("light-theme", "dark-theme");
      localStorage.setItem("theme", "dark-theme");
    } else {
      document.body.classList.replace("dark-theme", "light-theme");
      localStorage.setItem("theme", "light-theme");
    }
  });

  // --- Smooth Scroll Navigation ---
  navItems.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#home") {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      } else {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const headerHeight = window.innerWidth > 900 ? 80 : 120; // responsive offsets
          const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });

  // --- Scroll Progress Indicator & Active Nav Tracker ---
  function updateScrollSpy() {
    // 1. Scroll Progress Indicator
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight > 0) {
      const percentage = (window.scrollY / scrollHeight) * 100;
      scrollProgress.style.width = `${percentage}%`;
    }

    // 2. Active Section Highlight based on real-time screen position
    const headerOffset = window.innerWidth > 900 ? 80 : 120;
    let activeSection = null;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom > headerOffset) {
        activeSection = section;
      }
    });

    if (activeSection) {
      const id = activeSection.getAttribute("id");
      navItems.forEach((nav) => nav.classList.remove("active"));
      navItems.forEach((item) => {
        if (item.getAttribute("href") === `#${id}`) {
          item.classList.add("active");
        }
      });
    }
  }

  window.addEventListener("scroll", updateScrollSpy);
  // Initial run on load to set correct indicators
  updateScrollSpy();

  // --- Section Intersection Reveal ---
  const sectionOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "-10% 0px -15% 0px"
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
      }
    });
  }, sectionOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // --- Dynamic Skills Rendering (Editorial Text Sentences) ---
  const skillsData = [
    {
      category: "Languages & Frameworks",
      skills: [
        "C#",
        ".NET Core / .NET 6+",
        "ASP.NET Core (MVC, Web API, Razor)",
        "Entity Framework Core",
        "LINQ",
        "HTML5",
        "CSS3",
        "JavaScript",
        "jQuery",
        "Blazor",
        "Dart",
        "Flutter"
      ]
    },
    {
      category: "Databases & Engines",
      skills: [
        "SQL Server",
        "PostgreSQL",
        "MySQL"
      ]
    },
    {
      category: "Cloud & DevOps",
      skills: [
        "Docker",
        "Git",
        "GitHub"
      ]
    },
    {
      category: "Tools & Methodologies",
      skills: [
        "Visual Studio / VS Code",
        "RESTful APIs",
        "Unit Testing (xUnit, NUnit)",
        "Dependency Injection",
        "SOLID Principles",
        "Agile / Scrum"
      ]
    }
  ];

  function renderSkills() {
    const skillsGridEl = document.getElementById("skillsGrid");
    if (!skillsGridEl) return;

    skillsGridEl.innerHTML = "";

    skillsData.forEach((categoryObj) => {
      const categoryWrapper = document.createElement("div");
      categoryWrapper.className = "skills-category";

      const title = document.createElement("h3");
      title.className = "skills-cat-title";
      title.textContent = categoryObj.category;
      categoryWrapper.appendChild(title);

      const itemsListRow = document.createElement("p");
      itemsListRow.className = "skills-line-wrap";

      categoryObj.skills.forEach((skill, index) => {
        const skillSpan = document.createElement("span");
        skillSpan.textContent = skill;
        itemsListRow.appendChild(skillSpan);

        // Add typographic interpunct divider
        if (index < categoryObj.skills.length - 1) {
          const dot = document.createElement("span");
          dot.className = "skill-inter-dot";
          dot.textContent = " · ";
          itemsListRow.appendChild(dot);
        }
      });

      categoryWrapper.appendChild(itemsListRow);
      skillsGridEl.appendChild(categoryWrapper);
    });
  }

  // --- EmailJS Letter Form Integration ---
  if (contactForm) {
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const messageEl = document.getElementById("message");

    const originalPlaceholders = {
      name: nameEl ? nameEl.placeholder : "your name",
      email: emailEl ? emailEl.placeholder : "your email address",
      message: messageEl ? messageEl.placeholder : "a project, database engineering..."
    };

    function adjustSize(el) {
      if (!el) return;
      // Auto-expand height
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";

      // Auto-expand width for name and email fields
      if (el.id === "name" || el.id === "email") {
        const textLength = el.value.length || el.placeholder.length;
        const calculatedWidth = Math.max(150, Math.min(textLength * 13 + 24, 320));
        el.style.width = calculatedWidth + "px";
      }
    }

    // Reset error state and adjust size on user input
    [nameEl, emailEl, messageEl].forEach((el) => {
      if (!el) return;
      el.addEventListener("input", () => {
        el.style.borderColor = "";
        el.classList.remove("field-error-state");
        el.placeholder = originalPlaceholders[el.id];
        adjustSize(el);
      });
      // Initial render resize
      adjustSize(el);
      window.addEventListener("load", () => adjustSize(el));
      window.addEventListener("resize", () => adjustSize(el));
    });

    function triggerPaperPlaneAnimation(planeWrapEl) {
      if (!planeWrapEl) return;

      const rect = planeWrapEl.getBoundingClientRect();
      const clone = planeWrapEl.cloneNode(true);
      clone.classList.add("flying-paper-plane-clone");

      // Style the clone to sit exactly where the original icon was, fixed to viewport
      Object.assign(clone.style, {
        position: "fixed",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: "0",
        padding: "0",
        zIndex: "100000",
        pointerEvents: "none",
        transformOrigin: "center center"
      });

      // Force only outline SVG to show in the clone
      const outlineSVG = clone.querySelector(".plane-outline");
      const filledSVG = clone.querySelector(".plane-filled");
      if (outlineSVG) {
        outlineSVG.style.opacity = "1";
        outlineSVG.style.transform = "none";
      }
      if (filledSVG) {
        filledSVG.style.opacity = "0";
      }

      document.body.appendChild(clone);

      // Hide original button icon
      planeWrapEl.style.opacity = "0";

      // Calculate path relative to the clone's starting position (which is at `rect.left`)
      // It swoops rightward and upward in a beautiful, natural wind-glide wave path.
      const widthFactor = Math.min(window.innerWidth / 1200, 1.25);
      const flightPath = {
        curviness: 1.25,
        autoRotate: [["x", "y", "rotation", 45, false]], // 45deg offset (with useRadians=false) aligns the SVG's custom nose angle to the path tangent
        values: [
          { x: 150 * widthFactor, y: -90 },
          { x: 350 * widthFactor, y: -140 },
          { x: 550 * widthFactor, y: -60 },
          { x: 750 * widthFactor, y: -180 },
          { x: 950 * widthFactor, y: -220 },
          { x: window.innerWidth - rect.left + 150, y: -340 }
        ]
      };

      // Reset transforms on the clone for a clean run
      TweenLite.set(clone, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 });

      const tl = new TimelineLite({
        onComplete: () => {
          clone.remove();
        }
      });

      // Fly along the curved bezier path
      tl.to(clone, 2.8, {
        bezier: flightPath,
        ease: Power2.easeInOut // Slightly stronger easing curves for a lighter, glider-like feel
      }, 0);

      // Fade out as it exits off-screen right
      tl.to(clone, 0.8, { opacity: 0, ease: Power1.easeOut }, "-=0.8");
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formStatus.textContent = "";
      formStatus.className = "";

      let isValid = true;
      const nameVal = nameEl.value.trim();
      const emailVal = emailEl.value.trim();
      const messageVal = messageEl.value.trim();

      // Clear previous error states
      [nameEl, emailEl, messageEl].forEach((el) => {
        if (!el) return;
        el.style.borderColor = "";
        el.classList.remove("field-error-state");
        el.placeholder = originalPlaceholders[el.id];
        adjustSize(el);
      });

      if (!nameVal) {
        nameEl.style.borderColor = "#ef4444";
        nameEl.classList.add("field-error-state");
        nameEl.placeholder = "name is required";
        isValid = false;
      }
      if (!emailVal) {
        emailEl.style.borderColor = "#ef4444";
        emailEl.classList.add("field-error-state");
        emailEl.placeholder = "email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        emailEl.value = "";
        emailEl.style.borderColor = "#ef4444";
        emailEl.classList.add("field-error-state");
        emailEl.placeholder = "invalid email format";
        isValid = false;
      }
      if (!messageVal) {
        messageEl.style.borderColor = "#ef4444";
        messageEl.classList.add("field-error-state");
        messageEl.placeholder = "a topic is required";
        isValid = false;
      }

      if (isValid) {
        const submitButton = contactForm.querySelector(".contactForm-submit");
        const letterTextEl = submitButton.querySelector(".btn-letter-text");
        const planeWrapEl = submitButton.querySelector(".btn-plane-wrap");

        // ── SENDING state ──────────────────────────────────────────────
        submitButton.disabled = true;
        submitButton.classList.add("state-sending");
        letterTextEl.textContent = "Sending...";

        // Trigger the beautiful full-screen paper plane flight animation
        triggerPaperPlaneAnimation(planeWrapEl);

        emailjs
          .sendForm("service_yl2hki7", "template_e2f9xvk", contactForm)
          .then(() => {
            // ── SUCCESS state ─────────────────────────────────────────
            submitButton.classList.remove("state-sending");
            submitButton.classList.add("state-success");
            letterTextEl.textContent = "Letter Sent!";
            planeWrapEl.style.opacity = ""; // Restore visibility

            // Swap plane icons to show filled checkmark feel — use a checkmark SVG
            planeWrapEl.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                style="opacity:1; animation: successPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            `;

            formStatus.textContent = "Letter dispatched successfully!";
            formStatus.style.color = "var(--primary-color)";

            setTimeout(() => {
              contactForm.reset();
              [nameEl, emailEl, messageEl].forEach(el => {
                el.placeholder = originalPlaceholders[el.id];
                adjustSize(el);
              });
              // Restore button
              submitButton.classList.remove("state-success");
              submitButton.disabled = false;
              letterTextEl.textContent = "Send Letter";
              planeWrapEl.innerHTML = `
                <svg class="plane-outline" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 2L11 13"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
                </svg>
                <svg class="plane-filled" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
                </svg>
              `;
              formStatus.textContent = "";
            }, 3000);
          })
          .catch((error) => {
            console.error("EmailJS Error:", error);

            // ── FAIL state ────────────────────────────────────────────
            submitButton.classList.remove("state-sending");
            submitButton.classList.add("state-fail");
            letterTextEl.textContent = "Failed to Dispatch";
            planeWrapEl.style.opacity = ""; // Restore visibility

            formStatus.textContent = "Failed to deliver letter. Try again.";
            formStatus.style.color = "#ef4444";

            // After crash animation settles, show an X icon
            setTimeout(() => {
              planeWrapEl.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  style="opacity:1; animation: failIconPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both; color:#ef4444;">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              `;
            }, 500);

            setTimeout(() => {
              submitButton.classList.remove("state-fail");
              submitButton.disabled = false;
              letterTextEl.textContent = "Send Letter";
              planeWrapEl.innerHTML = `
                <svg class="plane-outline" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 2L11 13"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
                </svg>
                <svg class="plane-filled" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
                </svg>
              `;
              formStatus.textContent = "";
            }, 3500);
          });
      } else {
        formStatus.textContent = "Please check highlighted parts of your letter.";
        formStatus.style.color = "#ef4444";
      }
    });
  }

  // --- Retro Snake Game: Bug Squasher ---
  function initSnakeGame() {
    const canvas = document.getElementById("gameCanvas");
    const scoreVal = document.getElementById("gameScore");
    const overlay = document.getElementById("gameOverlay");
    const startBtn = document.getElementById("startGameBtn");

    // Touch Buttons
    const btnUp = document.getElementById("btnUp");
    const btnDown = document.getElementById("btnDown");
    const btnLeft = document.getElementById("btnLeft");
    const btnRight = document.getElementById("btnRight");

    if (!canvas || !scoreVal || !overlay || !startBtn) return;

    const ctx = canvas.getContext("2d");

    // Grid details (24 columns x 12 rows)
    const gridSizeX = 24;
    const gridSizeY = 12;
    const blockPixelSize = 20;

    let snake = [];
    let bug = { x: 0, y: 0 };
    let dx = 1;
    let dy = 0;
    let score = 0;
    let isRunning = false;
    let gameLoopTimeout = null;
    let nextDirection = { dx: 1, dy: 0 };

    function resetGame() {
      snake = [
        { x: 5, y: 6 },
        { x: 4, y: 6 },
        { x: 3, y: 6 }
      ];
      dx = 1;
      dy = 0;
      nextDirection = { dx: 1, dy: 0 };
      score = 0;
      scoreVal.textContent = score;
      spawnBug();
    }

    function spawnBug() {
      let valid = false;
      while (!valid) {
        bug.x = Math.floor(Math.random() * gridSizeX);
        bug.y = Math.floor(Math.random() * gridSizeY);
        valid = true;

        // Ensure bug doesn't spawn inside snake body
        for (let segment of snake) {
          if (segment.x === bug.x && segment.y === bug.y) {
            valid = false;
            break;
          }
        }
      }
    }

    function changeDirection(newDx, newDy) {
      if (newDx !== 0 && dx === 0) {
        nextDirection = { dx: newDx, dy: 0 };
      }
      if (newDy !== 0 && dy === 0) {
        nextDirection = { dx: 0, dy: newDy };
      }
    }

    // Keyboard handlers
    window.addEventListener("keydown", (e) => {
      if (!isRunning) return;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") changeDirection(0, -1);
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") changeDirection(0, 1);
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") changeDirection(-1, 0);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") changeDirection(1, 0);

      // Prevent scroll on arrows
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    });

    // Touch handlers
    if (btnUp) btnUp.addEventListener("click", () => changeDirection(0, -1));
    if (btnDown) btnDown.addEventListener("click", () => changeDirection(0, 1));
    if (btnLeft) btnLeft.addEventListener("click", () => changeDirection(-1, 0));
    if (btnRight) btnRight.addEventListener("click", () => changeDirection(1, 0));

    function tick() {
      if (!isRunning) return;

      dx = nextDirection.dx;
      dy = nextDirection.dy;

      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall collisions
      if (head.x < 0 || head.x >= gridSizeX || head.y < 0 || head.y >= gridSizeY) {
        endGame(true);
        return;
      }

      // Self collisions
      for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
          endGame(false);
          return;
        }
      }

      snake.unshift(head);

      // Check bug eating
      if (head.x === bug.x && head.y === bug.y) {
        score++;
        scoreVal.textContent = score;
        spawnBug();
      } else {
        snake.pop();
      }

      draw();

      // Game speedup over time (slower base rate)
      const baseInterval = 160;
      const speedUp = Math.min(score * 3, 60);
      gameLoopTimeout = setTimeout(tick, baseInterval - speedUp);
    }

    function endGame(hitWall) {
      isRunning = false;
      clearTimeout(gameLoopTimeout);
      overlay.style.opacity = "1";
      overlay.style.visibility = "visible";

      const msgEl = overlay.querySelector(".overlay-msg");
      if (hitWall) {
        msgEl.textContent = `seg fault: stack overflow at score ${score}`;
      } else {
        msgEl.textContent = `null pointer reference: bit self at score ${score}`;
      }

      const btnSpan = startBtn.querySelector("span");
      btnSpan.textContent = "dotnet watch run --rebuild";
    }

    function draw() {
      const rootStyles = getComputedStyle(document.body);
      const bg = rootStyles.getPropertyValue("--bg-color").trim();
      const primaryColor = rootStyles.getPropertyValue("--primary-color").trim();
      const accentColor = rootStyles.getPropertyValue("--accent-color").trim();
      const gridColor = rootStyles.getPropertyValue("--game-grid-color").trim() || "rgba(242, 237, 228, 0.12)";

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint grid backing (game's own grid, not related to body overlays)
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < gridSizeX; i++) {
        ctx.beginPath();
        ctx.moveTo(i * blockPixelSize, 0);
        ctx.lineTo(i * blockPixelSize, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < gridSizeY; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * blockPixelSize);
        ctx.lineTo(canvas.width, j * blockPixelSize);
        ctx.stroke();
      }

      // Draw Bug (Food)
      ctx.fillStyle = accentColor;
      const bx = bug.x * blockPixelSize + blockPixelSize / 2;
      const by = bug.y * blockPixelSize + blockPixelSize / 2;

      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = bg;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(bx - 9, by); ctx.lineTo(bx + 9, by);
      ctx.moveTo(bx - 6, by - 6); ctx.lineTo(bx + 6, by + 6);
      ctx.moveTo(bx - 6, by + 6); ctx.lineTo(bx + 6, by - 6);
      ctx.stroke();

      // Draw Snake (Developer)
      snake.forEach((segment, index) => {
        ctx.fillStyle = primaryColor;
        const sx = segment.x * blockPixelSize;
        const sy = segment.y * blockPixelSize;

        ctx.beginPath();
        ctx.roundRect(sx + 1, sy + 1, blockPixelSize - 2, blockPixelSize - 2, 4);
        ctx.fill();

        if (index === 0) {
          ctx.fillStyle = bg;
          const eyeSize = 3;
          if (dx === 1) {
            ctx.fillRect(sx + 12, sy + 4, eyeSize, eyeSize);
            ctx.fillRect(sx + 12, sy + 12, eyeSize, eyeSize);
          } else if (dx === -1) {
            ctx.fillRect(sx + 4, sy + 4, eyeSize, eyeSize);
            ctx.fillRect(sx + 4, sy + 12, eyeSize, eyeSize);
          } else if (dy === 1) {
            ctx.fillRect(sx + 4, sy + 12, eyeSize, eyeSize);
            ctx.fillRect(sx + 12, sy + 12, eyeSize, eyeSize);
          } else if (dy === -1) {
            ctx.fillRect(sx + 4, sy + 4, eyeSize, eyeSize);
            ctx.fillRect(sx + 12, sy + 4, eyeSize, eyeSize);
          }
        }
      });
    }

    startBtn.addEventListener("click", () => {
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
      resetGame();
      isRunning = true;
      tick();
    });

    // Redraw grid when theme changes to update grid colors dynamically
    themeToggleBtn.addEventListener("click", () => {
      requestAnimationFrame(() => {
        draw();
      });
    });

    // Initial render at rest
    resetGame();
    draw();
  }

  // --- Download CV Click Animation ---
  // Native <a download="..."> handles the file download.
  // JS only drives the icon swap animation (arrow → checkmark → reset).
  const downloadBtn = document.getElementById("downloadCvBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      // Guard: don't re-trigger mid-animation
      if (downloadBtn.classList.contains("done")) return;

      // Show checkmark after a short moment (simulating save start)
      setTimeout(() => {
        downloadBtn.classList.add("done");
      }, 600);

      // Reset back to arrow after a pause
      setTimeout(() => {
        downloadBtn.classList.remove("done");
      }, 3000);
    });
  }

  // --- Initial Render ---
  renderSkills();
  initSnakeGame();
});
