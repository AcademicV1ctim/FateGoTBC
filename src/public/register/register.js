// register.js

// 1) Toggle visibility for BOTH password fields (robust to duplicate IDs)
document.querySelectorAll('.password-wrapper').forEach((wrap) => {
    const input = wrap.querySelector('input');
    const btn = wrap.querySelector('.toggle-password');
    if (!input || !btn) return;
  
    btn.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });
  
  // 2) Form handling
  const form = document.getElementById('loginForm');
  const emailEl = document.getElementById('email');
  
  // Identify password and confirm-password by their positions
  const wrappers = Array.from(document.querySelectorAll('.password-wrapper'));
  const passwordEl = wrappers[0]?.querySelector('input');
  const confirmEl  = wrappers[1]?.querySelector('input');
  
  // Simple inline error helpers
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
  
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function validPassword(v) { return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v); } // 8+ chars, at least 1 letter & 1 number
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // Defensive: if duplicate IDs change later, still handle safely
    const email = (emailEl?.value || '').trim();
    const password = passwordEl?.value || '';
    const confirm  = confirmEl?.value || '';
  
    // Clear previous errors
    if (emailEl) clearError(emailEl);
    if (passwordEl) clearError(passwordEl);
    if (confirmEl) clearError(confirmEl);
  
    // Client-side validation
    let ok = true;
    if (!validEmail(email)) {
      if (emailEl) setError(emailEl, 'Please enter a valid email address.');
      ok = false;
    }
    if (!validPassword(password)) {
      if (passwordEl) setError(passwordEl, 'Min 8 chars with at least 1 letter and 1 number.');
      ok = false;
    }
    if (confirm !== password) {
      if (confirmEl) setError(confirmEl, 'Passwords do not match.');
      ok = false;
    }
    if (!ok) return;
  
    // Disable submit while sending
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn?.innerHTML;
    if (submitBtn) submitBtn.disabled = true;
  
    try {
      // TODO: replace endpoint with your actual API
      const res = await fetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await res.json().catch(() => ({}));
  
      if (!res.ok) {
        const msg = data?.error || data?.message || `Registration failed (${res.status})`;
        if (confirmEl) setError(confirmEl, msg);
        return;
      }
  
      // Success — redirect to your page
      window.location.href = '/landing.html'; // change if needed
    } catch (err) {
      console.error(err);
      if (confirmEl) setError(confirmEl, 'Network error. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    }
  });
  