// login.js (or register.js if that's the filename you’re using)

// --- Toggle visibility for BOTH password wrappers (works even with duplicate IDs) ---
document.querySelectorAll('.password-wrapper').forEach((wrap) => {
  const input = wrap.querySelector('input');
  const btn = wrap.querySelector('.toggle-password');
  if (!input || !btn) return;
  btn.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

// --- Elements ---
const form = document.getElementById('loginForm');
const emailEl = document.getElementById('email');
// Treat the FIRST password wrapper as the login password
const wrappers = Array.from(document.querySelectorAll('.password-wrapper'));
const passwordEl = wrappers[0]?.querySelector('input'); // login password
// confirm (if present) is wrappers[1], but we IGNORE it for login
const submitBtn = form.querySelector('button[type="submit"]');
const rememberEl = document.getElementById('remember'); // optional

// --- Regex ---
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// min 8 chars, at least 1 letter & 1 number 
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// --- Inline error helpers ---
function ensureErrorNode(input) {
  const group = input.closest('.form-group') || input.parentElement;
  let node = group.querySelector('.field-error');
  if (!node) {
    node = document.createElement('div');
    node.className = 'field-error';
    node.style.color = '#e11d48';
    node.style.fontSize = '0.85rem';
    node.style.marginTop = '6px';
    group.appendChild(node);
  }
  return node;
}
function setError(input, msg) { ensureErrorNode(input).textContent = msg || ''; }
function clearError(input) { setError(input, ''); }

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = (emailEl?.value || '').trim();
  const password = passwordEl?.value || '';
  const remember = rememberEl ? !!rememberEl.checked : false;

  // clear old errors
  if (emailEl) clearError(emailEl);
  if (passwordEl) clearError(passwordEl);

  // validate
  let ok = true;
  if (!EMAIL_RE.test(email)) {
    if (emailEl) setError(emailEl, 'Please enter a valid email address.');
    ok = false;
  }
  if (!PASSWORD_RE.test(password)) {
    if (passwordEl) setError(passwordEl, 'Min 8 chars with at least 1 letter and 1 number.');
    ok = false;
  }
  if (!ok) return;

  // disable submit
  const originalHTML = submitBtn?.innerHTML;
  if (submitBtn) submitBtn.disabled = true;

  try {
    // --- LOGIN call ---
    const res = await fetch('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // include remember if your backend supports it
      body: JSON.stringify({ email, password, remember })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data?.error || data?.message || `Login failed (${res.status})`;
      // show near password field
      if (passwordEl) setError(passwordEl, msg);
      return;
    }

    // If server sets an auth cookie, this is enough.
    // If server returns a token, you might store it:
    // localStorage.setItem('auth_token', data.token);

    // success → go to game/home
    window.location.href = '/game';
  } catch (err) {
    console.error(err);
    if (passwordEl) setError(passwordEl, 'Network error. Please try again.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
  }
});
