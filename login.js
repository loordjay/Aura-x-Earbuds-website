document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const messageEl = document.getElementById('message');
  messageEl.textContent = '';

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      // Store username and email in localStorage and redirect to dashborad.html on successful login
      localStorage.setItem('username', username);
      localStorage.setItem('email', data.email || '');
      window.location.href = 'index.html';
    } else {
      messageEl.textContent = data.message || 'Login failed.';
    }
  } catch (error) {
    messageEl.textContent = 'Error connecting to server.';
  }
});
