const API_BASE_URL = 'http://127.0.0.1:8000';

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');

    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

function setLoading(isLoading) {
    const submitBtn = document.getElementById('submit-btn');
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;
    } else {
        submitBtn.disabled = false;
        if (window.location.pathname.includes('login')) {
            submitBtn.textContent = 'Login';
        } else {
            submitBtn.textContent = 'Sign Up';
        }
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    setLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Login failed');
        }

        localStorage.setItem('jwt_token', data.access_token || data.token);
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Login failed. Please check your credentials.');
        setLoading(false);
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }

    setLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Signup failed');
        }

        localStorage.setItem('jwt_token', data.access_token || data.token);
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Signup error:', error);
        showError(error.message || 'Signup failed. Please try again.');
        setLoading(false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        window.location.href = 'index.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});












// Send OTP
document.getElementById('send-otp-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    if (!email) return alert('Enter email');

    const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const data = await res.json();
    alert(data.message);

    // Show OTP input step
    document.getElementById('email-step').classList.add('hidden');
    document.getElementById('otp-step').classList.remove('hidden');
});

// Verify OTP
document.getElementById('verify-otp-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;

    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
    });

    if (!res.ok) {
        const data = await res.json();
        alert(data.detail || 'OTP invalid');
        return;
    }

    alert('OTP verified! Now you can fill name & password and Sign Up.');
    document.getElementById('otp-step').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
});

