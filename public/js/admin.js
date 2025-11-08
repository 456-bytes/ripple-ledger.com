const API_URL = "https://ripple-ledger.com/api/admin"; 
const token = localStorage.getItem("token");

// ✅ Protect page - if no token, redirect to login
if (!token) {
  alert("You must log in as admin!");
  window.location.href = "/login";
}

// ✅ Fetch all users
async function fetchUsers() {
  const res = await fetch(`${API_URL}/users`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";

  data.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.wallet || 0}</td>
      <td>
        <button onclick="adjustBalance('${user._id}', 'add')">+100</button>
        <button onclick="adjustBalance('${user._id}', 'subtract')">-100</button>
        <button onclick="deleteUser('${user._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ✅ Adjust balance
async function adjustBalance(userId, action) {
  const amount = action === "add" ? 100 : -100;

  await fetch(`${API_URL}/users/${userId}/adjust`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ amount })
  });

  fetchUsers(); // refresh
}

// ✅ Delete user
async function deleteUser(userId) {
  if (!confirm("Are you sure?")) return;

  await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  fetchUsers();
}

// ✅ Fetch withdrawals
async function fetchWithdrawals() {
  const res = await fetch(`${API_URL}/withdrawals`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  const tbody = document.querySelector("#withdrawalsTable tbody");
  tbody.innerHTML = "";

  data.forEach(w => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${w.user.email}</td>
      <td>${w.amount}</td>
      <td>${w.status}</td>
      <td>
        <button onclick="approveWithdrawal('${w._id}', 'approved')">Approve</button>
        <button onclick="approveWithdrawal('${w._id}', 'rejected')">Reject</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ✅ Approve / Reject withdrawal
async function approveWithdrawal(id, status) {
    await fetch(`${API_URL}/withdrawals/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ withdrawalId: id, status })
    });
  
    fetchWithdrawals();
  }
  

// ✅ Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
});

// Load data
fetchUsers();
fetchWithdrawals();
