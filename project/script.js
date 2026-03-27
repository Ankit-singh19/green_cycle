document.addEventListener("DOMContentLoaded", function () {

  // ================= COUNTER ANIMATION =================
  const counters = document.querySelectorAll(".counter");

  counters.forEach(counter => {
    const updateCounter = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const increment = target / 100;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCounter, 20);
      } else {
        counter.innerText = target.toLocaleString() + "+";
      }
    };
    updateCounter();
  });

  // ================= LOGIN REGISTER TOGGLE =================
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const heroSection = document.getElementById("heroSection");
  const authSection = document.getElementById("authSection");
  const loginForm = document.querySelector(".login-form");
  const registerForm = document.querySelector(".register-form");

  if (loginBtn && registerBtn) {

    loginBtn.addEventListener("click", function () {
  authSection.style.display = "flex";

  loginForm.style.display = "block";
  registerForm.style.display = "none";

  //heroSection.classList.remove("dark-mode");
  //heroSection.classList.add("light-mode");
});

registerBtn.addEventListener("click", function () {
  authSection.style.display = "flex";

  loginForm.style.display = "none";
  registerForm.style.display = "block";

  //heroSection.classList.remove("light-mode");
  //heroSection.classList.add("dark-mode");
});
  // 👇 YE YAHA LAGANA HAI
  authSection.addEventListener("click", function(e){
    if(e.target === authSection){
      authSection.style.display = "none";
      heroSection.classList.remove("light-mode");
      heroSection.classList.add("dark-mode");
    }
  });

  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", async () => {
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      if (!email || !password) return alert("Email and password required");
      try {
        const res = await fetch("login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) {
          authSection.style.display = "none";
          loginBtn.innerText = "Logout";
          loginBtn.addEventListener("click", () => location.reload());
        }
      } catch (err) { alert("Error connecting to server"); }
    });
  }

  const regSubmitBtn = document.getElementById("regSubmitBtn");
  if (regSubmitBtn) {
    regSubmitBtn.addEventListener("click", async () => {
      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value.trim();
      if (!name || !email || !password) return alert("All fields required");
      try {
        const res = await fetch("register.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) {
          document.getElementById("loginEmail").value = email;
          loginForm.style.display = "block";
          registerForm.style.display = "none";
        }
      } catch (err) { alert("Error connecting to server"); }
    });
  }

  }

  // ================= HERO REQUEST BUTTON =================
  const requestBtn = document.querySelector(".btn-light");

  if (requestBtn) {
    requestBtn.addEventListener("click", () => {
      window.openRequestModal('General Waste');
    });
  }

  // ================= SMART BIN STATUS =================
  const bins = [
    { type: "Household", location: "Main Street", fill: 48, lastEmptied: "2024-02-28" },
    { type: "Recyclable", location: "Park Avenue", fill: 82, lastEmptied: "2024-02-25" },
    { type: "Organic", location: "Market Road", fill: 96, lastEmptied: "2024-02-20" },
    { type: "Household", location: "Lake View", fill: 34, lastEmptied: "2024-02-29" },
    { type: "Electronic", location: "Tech Park", fill: 66, lastEmptied: "2024-02-27" },
    { type: "Hazardous", location: "Industrial Area", fill: 19, lastEmptied: "2024-02-28" }
  ];

  function getStatus(fill) {
    if (fill >= 90) return "critical";
    if (fill >= 70) return "warning";
    return "normal";
  }

  function renderBins() {
    const grid = document.getElementById("binGrid");
    if (!grid) return;

    grid.innerHTML = "";

    bins.forEach(bin => {
      const status = getStatus(bin.fill);

      grid.innerHTML += `
        <div class="bin-card">
          <div class="bin-header">
            <h3>${bin.type}</h3>
            <span class="status-badge ${status}">${status}</span>
          </div>
          <div class="location">📍 ${bin.location}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${bin.fill}%"></div>
          </div>
          <div class="fill-text">${bin.fill}% full</div>
          <div class="last-emptied">Last emptied: ${bin.lastEmptied}</div>
        </div>
      `;
    });
  }

  renderBins();

  setInterval(() => {
    bins.forEach(bin => {
      bin.fill = Math.floor(Math.random() * 100);
    });
    renderBins();
  }, 5000);

  // ================= SCHEDULE =================
  let schedules = [];

  async function fetchSchedules() {
    try {
      const res = await fetch("schedule.php");
      const data = await res.json();
      if (data.success) {
        schedules = data.data;
        loadSchedules();
      }
    } catch (err) { console.error("Error fetching schedules:", err); }
  }

  const tableBody = document.getElementById("scheduleTableBody");
  const filterButtons = document.querySelectorAll(".filter-btn");

  function loadSchedules(filter = "all") {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    const filteredData =
      filter === "all"
        ? schedules
        : schedules.filter(item => item.status === filter);

    filteredData.forEach(item => {
      tableBody.innerHTML += `
        <tr>
          <td>${item.date}</td>
          <td>${item.time}</td>
          <td>${item.type}</td>
          <td>${item.address}</td>
          <td>
            <span class="status-badge ${item.status}">
              ${item.status}
            </span>
          </td>
        </tr>
      `;
    });
  }

  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        document.querySelector(".filter-btn.active").classList.remove("active");
        button.classList.add("active");
        loadSchedules(button.dataset.filter);
      });
    });
  }

  fetchSchedules();

  const createBtn = document.querySelector(".create-btn");

  if (createBtn) {
    createBtn.addEventListener("click", async function () {

      const date = prompt("Enter Date (YYYY-MM-DD):");
      const time = prompt("Enter Time (HH:MM):");
      const type = prompt("Enter Waste Type:");
      const address = prompt("Enter Address:");

      if (date && time && type && address) {
        try {
          const res = await fetch("schedule.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, time, type, address })
          });
          const data = await res.json();
          alert(data.message);
          if (data.success) {
            fetchSchedules();
          }
        } catch (err) { alert("Error saving schedule"); }
      } else {
        alert("All fields are required ❌");
      }

    });
  }

  // ================= CONTACT FORM =================
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !subject || !message) {
        alert("Please fill all fields!");
        return;
      }

      try {
        const res = await fetch("contact.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, subject, message })
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) contactForm.reset();
      } catch (err) { alert("Error sending message"); }
    });
  }

});

// ================= GLOBALS =================
window.openRequestModal = function(type) {
  const modal = document.getElementById('requestModal');
  if(modal) {
    modal.style.display = 'flex';
    document.getElementById('reqType').value = type || '';
  }
};

const submitRequestModalBtn = document.getElementById('submitRequestModalBtn');
if(submitRequestModalBtn) {
  submitRequestModalBtn.addEventListener('click', async () => {
    const type = document.getElementById('reqType').value.trim();
    const locationStr = document.getElementById('reqLocation').value.trim();
    if(!type || !locationStr) return alert("Please fill all fields");

    submitRequestModalBtn.innerText = "Submitting...";
    try {
      const res = await fetch("request.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: type, location: locationStr })
      });
      const data = await res.json();
      alert(data.message);
      if(data.success) {
        document.getElementById('requestModal').style.display = 'none';
        document.getElementById('reqLocation').value = '';
        const trackInput = document.getElementById('requestId');
        if(trackInput) trackInput.value = data.request_id;
      }
    } catch(err) {
      alert("Error submitting request.");
    }
    submitRequestModalBtn.innerText = "Submit";
  });
}

// ================= TRACK REQUEST FUNCTION =================
async function trackRequest() {
  const requestId = document.getElementById("requestId").value.trim();
  const resultBox = document.getElementById("trackResult");

  if (!requestId) {
    alert("Please enter Request ID");
    return;
  }

  try {
    const res = await fetch(`request.php?id=${encodeURIComponent(requestId)}`);
    const result = await res.json();

    if (result.success) {
      const data = result.data;
      resultBox.innerHTML = `
        <div style="text-align:left;">
          <h3 style="margin-bottom:15px;">Tracking Details</h3>
          <p><strong>Status:</strong> ${data.status}</p>
          <p><strong>Estimated Arrival:</strong> ${data.eta || 'N/A'}</p>
          <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
        </div>
      `;
    } else {
      resultBox.innerHTML = `
        <div style="text-align:center; color:red;">
          ❌ ${result.message}
        </div>
      `;
    }
  } catch (err) {
    resultBox.innerHTML = `
      <div style="text-align:center; color:red;">
        ❌ Error fetching data
      </div>
    `;
  }
}