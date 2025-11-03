document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const messageEl = document.getElementById('message');
  messageEl.textContent = '';

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    messageEl.textContent = 'Passwords do not match.';
    return;
  }

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      // Redirect to login page on successful signup
      window.location.href = 'login.html';
    } else {
      messageEl.textContent = data.message || 'Sign up failed.';
    }
  } catch (error) {
    messageEl.textContent = 'Error connecting to server.';
  }
});
