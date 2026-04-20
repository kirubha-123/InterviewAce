// InterviewAce main script
(function () {
  var STORAGE_KEYS = {
    users: "ia_users",
    session: "ia_auth_session",
    darkMode: "ia_dark_mode",
    aptitudeScorePrefix: "ia_aptitude_score:",
    completedSectionsPrefix: "ia_completed_sections:"
  };

  var aptitudeQuestions = [
    {
      question: "If a train travels 120 km in 2 hours, what is its speed?",
      options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
      answerIndex: 2
    },
    {
      question: "What is 25% of 360?",
      options: ["70", "80", "90", "100"],
      answerIndex: 2
    },
    {
      question: "A number increased by 10% becomes 220. What is the original number?",
      options: ["180", "190", "200", "210"],
      answerIndex: 2
    },
    {
      question: "If 5x - 10 = 40, x equals?",
      options: ["8", "9", "10", "11"],
      answerIndex: 2
    },
    {
      question: "Find the next number: 3, 7, 13, 21, ?",
      options: ["29", "31", "33", "35"],
      answerIndex: 1
    }
  ];

  var codingQuestions = [
    {
      title: "Write a function to check if a number is prime.",
      answer: "Check divisibility from 2 to sqrt(n). If divisible by any number, not prime."
    },
    {
      title: "Reverse a string in JavaScript.",
      answer: "Use str.split('').reverse().join('') to reverse characters."
    },
    {
      title: "Find the largest value in an array.",
      answer: "Use Math.max(...arr) or iterate once with a max variable."
    },
    {
      title: "Count vowels in a string.",
      answer: "Loop through chars and count if it exists in 'aeiouAEIOU'."
    },
    {
      title: "Remove duplicates from an array.",
      answer: "Use [...new Set(arr)] for a clean unique array."
    }
  ];

  var interviewQuestions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths and weaknesses?",
    "Describe a challenge you handled successfully.",
    "Where do you see yourself in 5 years?",
    "Why do you want to join our company?"
  ];

  var motivationalQuotes = [
    "Success is where preparation and opportunity meet.",
    "Small daily progress creates big results.",
    "Confidence grows with consistent practice.",
    "Discipline today becomes achievement tomorrow.",
    "Your effort now builds your future career."
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function getPage() {
    return document.body.getAttribute("data-page") || "";
  }

  function getJson(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function setJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getUsers() {
    return getJson(STORAGE_KEYS.users, []);
  }

  function saveUsers(users) {
    setJson(STORAGE_KEYS.users, users);
  }

  function getSession() {
    return getJson(STORAGE_KEYS.session, null);
  }

  function saveSession(session) {
    setJson(STORAGE_KEYS.session, session);
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
  }

  function createToken() {
    if (window.crypto && window.crypto.getRandomValues) {
      var bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes).map(function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    }
    return "tok_" + Date.now() + "_" + Math.random().toString(36).slice(2);
  }

  function isAuthenticated() {
    var session = getSession();
    return !!(session && session.email && session.token);
  }

  function getCurrentUser() {
    return getSession();
  }

  function getUserStorageKey(prefix, email) {
    return prefix + email;
  }

  function findUserByEmail(email) {
    var users = getUsers();
    for (var i = 0; i < users.length; i += 1) {
      if (users[i].email === email) return users[i];
    }
    return null;
  }

  function showMessage(id, type, text) {
    var box = byId(id);
    if (!box) return;
    box.className = "alert alert-" + type;
    box.textContent = text;
    box.classList.remove("d-none");
  }

  function routeGuard() {
    var page = getPage();
    var publicPages = ["login", "register"];
    var loggedIn = isAuthenticated();

    if (!loggedIn && publicPages.indexOf(page) === -1) {
      window.location.replace("login.html");
      return false;
    }

    if (loggedIn && publicPages.indexOf(page) !== -1) {
      window.location.replace("index.html");
      return false;
    }

    return true;
  }

  function syncNavbarAuthLinks() {
    var navList = document.querySelector("#mainNav .navbar-nav");
    if (!navList) return;

    if (!document.querySelector("[data-auth-login-link]")) {
      var loginItem = document.createElement("li");
      loginItem.className = "nav-item js-auth-guest";
      loginItem.innerHTML = '<a class="nav-link" data-auth-login-link href="login.html">Login</a>';
      navList.appendChild(loginItem);
    }

    if (!document.querySelector("[data-auth-register-link]")) {
      var registerItem = document.createElement("li");
      registerItem.className = "nav-item js-auth-guest";
      registerItem.innerHTML = '<a class="nav-link" data-auth-register-link href="register.html">Register</a>';
      navList.appendChild(registerItem);
    }

    if (!document.querySelector("[data-auth-logout-link]")) {
      var logoutItem = document.createElement("li");
      logoutItem.className = "nav-item js-auth-user";
      logoutItem.innerHTML = '<a class="nav-link" data-auth-logout-link href="#">Logout</a>';
      navList.appendChild(logoutItem);
    }

    var loggedIn = isAuthenticated();
    document.querySelectorAll(".js-auth-guest").forEach(function (item) {
      item.classList.toggle("d-none", loggedIn);
    });
    document.querySelectorAll(".js-auth-user").forEach(function (item) {
      item.classList.toggle("d-none", !loggedIn);
    });

    var logoutLink = document.querySelector("[data-auth-logout-link]");
    if (logoutLink) {
      logoutLink.addEventListener("click", function (event) {
        event.preventDefault();
        clearSession();
        window.location.href = "login.html";
      });
    }
  }

  function initRegisterPage() {
    if (getPage() !== "register") return;

    var form = byId("registerForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = (byId("registerName").value || "").trim();
      var email = (byId("registerEmail").value || "").trim().toLowerCase();
      var password = byId("registerPassword").value || "";

      if (!name || !email || !password) {
        showMessage("registerMessage", "danger", "Please fill all fields.");
        return;
      }

      if (password.length < 6) {
        showMessage("registerMessage", "danger", "Password must be at least 6 characters.");
        return;
      }

      if (findUserByEmail(email)) {
        showMessage("registerMessage", "warning", "Email already registered. Please login.");
        return;
      }

      var users = getUsers();
      users.push({
        name: name,
        email: email,
        password: password,
        createdAt: Date.now()
      });
      saveUsers(users);

      showMessage("registerMessage", "success", "Registration successful. Redirecting to login...");
      setTimeout(function () {
        window.location.href = "login.html";
      }, 700);
    });
  }

  function initLoginPage() {
    if (getPage() !== "login") return;

    var form = byId("loginForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var email = (byId("loginEmail").value || "").trim().toLowerCase();
      var password = byId("loginPassword").value || "";
      var user = findUserByEmail(email);

      if (!user) {
        showMessage("loginMessage", "warning", "No account found. Please register first.");
        return;
      }

      if (user.password !== password) {
        showMessage("loginMessage", "danger", "Invalid email or password.");
        return;
      }

      saveSession({
        name: user.name,
        email: user.email,
        token: createToken(),
        loggedInAt: Date.now()
      });

      showMessage("loginMessage", "success", "Login successful. Redirecting...");
      setTimeout(function () {
        window.location.href = "index.html";
      }, 500);
    });
  }

  function getCompletedSections() {
    var user = getCurrentUser();
    if (!user || !user.email) {
      return {
        aptitude: false,
        coding: false,
        interview: false
      };
    }
    return getJson(getUserStorageKey(STORAGE_KEYS.completedSectionsPrefix, user.email), {
      aptitude: false,
      coding: false,
      interview: false
    });
  }

  function markSectionComplete(sectionName) {
    var user = getCurrentUser();
    if (!user || !user.email) return;
    var data = getCompletedSections();
    data[sectionName] = true;
    setJson(getUserStorageKey(STORAGE_KEYS.completedSectionsPrefix, user.email), data);
  }

  function initDarkMode() {
    var toggle = byId("darkModeToggle");
    var isDark = localStorage.getItem(STORAGE_KEYS.darkMode) === "true";

    document.body.classList.toggle("dark", isDark);
    if (toggle) {
      toggle.textContent = isDark ? "Light Mode" : "Dark Mode";
      toggle.addEventListener("click", function () {
        var nowDark = !document.body.classList.contains("dark");
        document.body.classList.toggle("dark", nowDark);
        localStorage.setItem(STORAGE_KEYS.darkMode, nowDark ? "true" : "false");
        toggle.textContent = nowDark ? "Light Mode" : "Dark Mode";
      });
    }
  }

  function initAptitudePage() {
    if (getPage() !== "aptitude") return;

    var questionEl = byId("aptitudeQuestion");
    var optionsEl = byId("aptitudeOptions");
    var feedbackEl = byId("aptitudeFeedback");
    var nextBtn = byId("nextAptitudeBtn");
    var timerEl = byId("timerDisplay");
    var counterEl = byId("questionCounter");
    var resultEl = byId("aptitudeResult");

    var index = 0;
    var score = 0;
    var selectedIndex = null;
    var timeLeft = 15;
    var timerRef = null;

    function startTimer() {
      clearInterval(timerRef);
      timeLeft = 15;
      timerEl.textContent = "Time Left: " + timeLeft + "s";

      timerRef = setInterval(function () {
        timeLeft -= 1;
        timerEl.textContent = "Time Left: " + timeLeft + "s";

        if (timeLeft <= 0) {
          clearInterval(timerRef);
          handleNext();
        }
      }, 1000);
    }

    function renderQuestion() {
      var current = aptitudeQuestions[index];
      selectedIndex = null;
      nextBtn.disabled = true;
      if (feedbackEl) {
        feedbackEl.classList.add("d-none");
        feedbackEl.textContent = "";
      }

      counterEl.textContent = "Question " + (index + 1) + " / " + aptitudeQuestions.length;
      questionEl.textContent = current.question;
      optionsEl.innerHTML = "";

      for (var i = 0; i < current.options.length; i += 1) {
        (function (optionIndex) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "option-btn";
          btn.textContent = current.options[optionIndex];
          btn.addEventListener("click", function () {
            if (selectedIndex !== null) return;

            selectedIndex = optionIndex;
            nextBtn.disabled = false;

            var all = optionsEl.querySelectorAll(".option-btn");
            all.forEach(function (item) {
              item.classList.remove("selected");
              item.disabled = true;
            });
            btn.classList.add("selected");

            if (selectedIndex === current.answerIndex) {
              score += 1;
              btn.classList.add("correct");
              if (feedbackEl) {
                feedbackEl.classList.remove("d-none");
                feedbackEl.innerHTML = "<strong>Correct.</strong> " + current.options[current.answerIndex] + " is the right answer.";
              }
            } else {
              btn.classList.add("wrong");
              var correctBtn = all[current.answerIndex];
              if (correctBtn) {
                correctBtn.classList.add("correct");
              }
              if (feedbackEl) {
                feedbackEl.classList.remove("d-none");
                feedbackEl.innerHTML = "<strong>Not correct.</strong> Correct answer: " + current.options[current.answerIndex];
              }
            }
          });
          optionsEl.appendChild(btn);
        })(i);
      }

      startTimer();
    }

    function finishQuiz() {
      clearInterval(timerRef);
      var user = getCurrentUser();
      if (user && user.email) {
        setJson(getUserStorageKey(STORAGE_KEYS.aptitudeScorePrefix, user.email), score);
      }
      markSectionComplete("aptitude");

      questionEl.classList.add("d-none");
      optionsEl.classList.add("d-none");
      nextBtn.classList.add("d-none");
      counterEl.classList.add("d-none");
      timerEl.classList.add("d-none");

      resultEl.classList.remove("d-none");
      resultEl.innerHTML = "<h5 class='mb-2'>Quiz Completed</h5><p class='mb-2'>Your score is <strong>" + score + " / " + aptitudeQuestions.length + "</strong>.</p><a class='btn btn-main btn-sm' href='dashboard.html'>Go to Dashboard</a>";
    }

    function handleNext() {
      index += 1;
      if (index >= aptitudeQuestions.length) {
        finishQuiz();
      } else {
        renderQuestion();
      }
    }

    nextBtn.addEventListener("click", handleNext);
    renderQuestion();
  }

  function initCodingPage() {
    if (getPage() !== "coding") return;

    var counterEl = byId("codingCounter");
    var questionEl = byId("codingQuestion");
    var answerEl = byId("codingAnswer");
    var revealBtn = byId("revealAnswerBtn");
    var nextBtn = byId("nextCodingBtn");

    var index = 0;

    function renderCodingQuestion() {
      var current = codingQuestions[index];
      counterEl.textContent = "Problem " + (index + 1) + " / " + codingQuestions.length;
      questionEl.textContent = current.title;
      answerEl.textContent = current.answer;
      answerEl.classList.add("d-none");
      revealBtn.textContent = "Reveal Answer";
    }

    revealBtn.addEventListener("click", function () {
      answerEl.classList.toggle("d-none");
      revealBtn.textContent = answerEl.classList.contains("d-none") ? "Reveal Answer" : "Hide Answer";
    });

    nextBtn.addEventListener("click", function () {
      index += 1;
      if (index >= codingQuestions.length) {
        markSectionComplete("coding");
        index = codingQuestions.length - 1;
        nextBtn.disabled = true;
        nextBtn.textContent = "Completed";
      }
      renderCodingQuestion();
    });

    renderCodingQuestion();
  }

  function initInterviewPage() {
    if (getPage() !== "interview") return;

    var questionEl = byId("randomInterviewQuestion");
    var quoteEl = byId("motivationalQuote");
    var nextBtn = byId("nextInterviewQuestionBtn");

    function renderRandomInterview() {
      var qIndex = Math.floor(Math.random() * interviewQuestions.length);
      var mIndex = Math.floor(Math.random() * motivationalQuotes.length);

      questionEl.textContent = interviewQuestions[qIndex];
      quoteEl.textContent = motivationalQuotes[mIndex];
    }

    nextBtn.addEventListener("click", function () {
      renderRandomInterview();
      markSectionComplete("interview");
    });

    renderRandomInterview();
  }

  function initDashboardPage() {
    if (getPage() !== "dashboard") return;

    var user = getCurrentUser();
    var aptitudeScore = 0;
    if (user && user.email) {
      aptitudeScore = Number(localStorage.getItem(getUserStorageKey(STORAGE_KEYS.aptitudeScorePrefix, user.email)) || 0);
    }
    var sections = getCompletedSections();

    var scoreEl = byId("dashboardAptitudeScore");
    var progressEl = byId("dashboardProgressBar");

    if (scoreEl) {
      scoreEl.textContent = String(aptitudeScore);
    }

    var percent = Math.round((aptitudeScore / 5) * 100);
    if (progressEl) {
      progressEl.style.width = percent + "%";
      progressEl.textContent = percent + "%";
    }

    byId("statusAptitude").textContent = sections.aptitude ? "Completed" : "Pending";
    byId("statusCoding").textContent = sections.coding ? "Completed" : "Pending";
    byId("statusInterview").textContent = sections.interview ? "Completed" : "Pending";
  }

  if (!routeGuard()) return;
  syncNavbarAuthLinks();
  initDarkMode();
  initRegisterPage();
  initLoginPage();
  initAptitudePage();
  initCodingPage();
  initInterviewPage();
  initDashboardPage();
})();
