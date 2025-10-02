const API_BASE_URL = 'http://127.0.0.1:8000';
let currentView = 'chat';

// ------------------------
// Authentication check
// ------------------------
function checkAuth() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

// ------------------------
// Utility functions
// ------------------------
function showError(message) {
    alert(message);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-black px-6 py-3 rounded-lg shadow-lg';
        notification.textContent = 'Copied to clipboard!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    });
}

// ------------------------
// Chat functions
// ------------------------
function addChatMessage(text, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const welcomeScreen = document.getElementById('welcome-screen');

    welcomeScreen.classList.add('hidden');
    chatMessages.classList.remove('hidden');

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble'} max-w-2xl rounded-2xl px-6 py-4 shadow-lg`;

    if (isUser) {
        messageDiv.innerHTML = `<p class="font-medium">${escapeHtml(text)}</p>`;
    } else {
        messageDiv.innerHTML = `
            <div class="flex justify-between items-start space-x-4">
                <p class="flex-1">${escapeHtml(text)}</p>
                <button class="copy-btn flex-shrink-0 bg-gray-700 hover:bg-green-500 text-white px-3 py-1 rounded-lg text-sm" onclick="copyText('${escapeHtml(text).replace(/'/g, "\\'")}')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                </button>
            </div>
        `;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('text-input');
    const text = input.value.trim();
    if (!text) return;

    const token = checkAuth();
    if (!token) return;

    addChatMessage(text, true);
    input.value = '';

    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: 1, // replace with real user id
                input_text: text
            })
        });

        if (response.status === 401) {
            localStorage.removeItem('jwt_token');
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) throw new Error('Failed to analyze text');

        const data = await response.json();
        addChatMessage(data.corrected_text || 'Analysis completed', false);

    } catch (error) {
        console.error('Error:', error);
        showError('Failed to analyze text. Please try again.');
    }
}

// ------------------------
// Load History
// ------------------------
async function loadHistory() {
    const token = checkAuth();
    if (!token) return;

    const historyList = document.getElementById("history-list");
    try {
        const response = await fetch(`${API_BASE_URL}/auth/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            localStorage.removeItem('jwt_token');
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) throw new Error('Failed to load history');

        const data = await response.json();
        historyList.innerHTML = "";

        if (!data || data.length === 0) {
            historyList.innerHTML = '<p class="text-gray-400 text-center">No history yet</p>';
            return;
        }

        data.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item bg-gray-900 rounded-lg p-4 space-y-3';
            historyItem.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <p class="text-sm text-gray-400 mb-2">${item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}</p>
                        <p class="font-medium text-green-500 mb-2">Input:</p>
                        <p class="text-gray-300 mb-3">${escapeHtml(item.input_text || '')}</p>
                        <p class="font-medium text-green-500 mb-2">Analysis:</p>
                        <p class="text-gray-300">${escapeHtml(item.corrected_text || '')}</p>
                    </div>
                    <button class="copy-btn flex-shrink-0 bg-gray-700 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-sm ml-4" onclick="copyText('${escapeHtml(item.corrected_text || '').replace(/'/g, "\\'")}')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                    </button>
                </div>
            `;
            historyList.appendChild(historyItem);
        });

    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load history');
    }
}

// ------------------------
// Load Profile
// ------------------------
async function loadProfile() {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            localStorage.removeItem('jwt_token');
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) throw new Error('Failed to load profile');

        const data = await response.json();
        const profileContent = document.getElementById('profile-content');

        profileContent.innerHTML = `
            <div class="flex items-center space-x-4 mb-6">
                <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-3xl font-bold text-black">
                    ${(data.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 class="text-xl font-bold">${escapeHtml(data.name || 'User')}</h3>
                    <p class="text-gray-400">${escapeHtml(data.email || '')}</p>
                </div>
            </div>
            <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-700">
                    <span class="text-gray-400">Name</span>
                    <span class="font-medium">${escapeHtml(data.name || 'N/A')}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-700">
                    <span class="text-gray-400">Email</span>
                    <span class="font-medium">${escapeHtml(data.email || 'N/A')}</span>
                </div>
                <div class="flex justify-between py-2">
                    <span class="text-gray-400">Member Since</span>
                    <span class="font-medium">${data.created_at || 'Recently'}</span>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load profile');
    }
}

// ------------------------
// View switching
// ------------------------
function switchView(view) {
    currentView = view;

    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('chat-messages').classList.add('hidden');
    document.getElementById('history-view').classList.add('hidden');
    document.getElementById('profile-view').classList.add('hidden');

    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));

    if (view === 'chat') {
        const hasMessages = document.getElementById('chat-messages').children.length > 0;
        if (hasMessages) document.getElementById('chat-messages').classList.remove('hidden');
        else document.getElementById('welcome-screen').classList.remove('hidden');

        document.getElementById('chats-btn').classList.add('active');
        document.getElementById('input-area').classList.remove('hidden');

    } else if (view === 'history') {
        document.getElementById('history-view').classList.remove('hidden');
        document.getElementById('history-btn').classList.add('active');
        document.getElementById('input-area').classList.add('hidden');
        loadHistory();

    } else if (view === 'profile') {
        document.getElementById('profile-view').classList.remove('hidden');
        document.getElementById('profile-btn').classList.add('active');
        document.getElementById('input-area').classList.add('hidden');
        loadProfile();
    }
}

// ------------------------
// Logout
// ------------------------
function logout() {
    localStorage.removeItem('jwt_token');
    window.location.href = 'login.html';
}

// ------------------------
// Sidebar toggle
// ------------------------
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarTexts = document.querySelectorAll('.sidebar-text');
    const logoText = document.getElementById('logo-text');

    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('expanded');

    if (sidebar.classList.contains('collapsed')) {
        sidebarTexts.forEach(t => {
            t.style.opacity = '0';
            t.style.pointerEvents = 'none'; // prevent clicking hidden text
        });
        logoText.style.opacity = '0';
    } else {
        sidebarTexts.forEach(t => {
            t.style.opacity = '1';
            t.style.pointerEvents = 'auto';
        });
        logoText.style.opacity = '1';
    }
}


// ------------------------
// History dropdown in sidebar
// ------------------------
async function loadHistoryDropdown() {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to load history");

        const data = await response.json();
        const historyDropdownList = document.getElementById("history-dropdown-list");
        historyDropdownList.innerHTML = "";

        if (!data || data.length === 0) {
            historyDropdownList.innerHTML = `<p class="text-gray-400 text-center p-2">No history yet</p>`;
            return;
        }

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "p-2 rounded hover:bg-gray-800 cursor-pointer";
            div.textContent = item.input_text || "No input";
            div.addEventListener("click", () => {
                showChatFromHistory(item);
                document.getElementById("history-dropdown").classList.add("hidden");
            });
            historyDropdownList.appendChild(div);
        });

    } catch (error) {
        console.error("Error loading history:", error);
    }
}

function showChatFromHistory(item) {
    const chatMessages = document.getElementById("chat-messages");
    document.getElementById("welcome-screen").classList.add("hidden");
    chatMessages.classList.remove("hidden");
    chatMessages.innerHTML = "";

    const userBubble = document.createElement("div");
    userBubble.className = "user-bubble chat-bubble p-3 rounded-lg max-w-xl";
    userBubble.textContent = item.input_text;
    chatMessages.appendChild(userBubble);

    const aiBubble = document.createElement("div");
    aiBubble.className = "ai-bubble chat-bubble p-3 rounded-lg max-w-xl";
    aiBubble.textContent = item.corrected_text;
    chatMessages.appendChild(aiBubble);
}

// ------------------------
// DOMContentLoaded
// ------------------------
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    document.getElementById('send-btn').addEventListener('click', sendMessage);
    document.getElementById('text-input').addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

    document.getElementById('chats-btn').addEventListener('click', () => switchView('chat'));
    document.getElementById('history-btn').addEventListener('click', async e => {
        e.stopPropagation();
        const dropdown = document.getElementById("history-dropdown");
        dropdown.classList.toggle("hidden");
        if (!dropdown.classList.contains("hidden")) await loadHistoryDropdown();
    });
    document.getElementById('profile-btn').addEventListener('click', () => switchView('profile'));
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('toggle-sidebar').addEventListener('click', toggleSidebar);

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
        document.getElementById("history-dropdown").classList.add("hidden");
    });
    document.getElementById('new-chat-sidebar-btn').addEventListener('click', newChatSidebar);

    document.getElementById("history-dropdown").addEventListener("click", e => e.stopPropagation());

    switchView('chat');
});


function newChatSidebar() {
    // Clear chat messages
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    // Show welcome screen
    document.getElementById('welcome-screen').classList.remove('hidden');
    chatMessages.classList.add('hidden');

    // Reset input
    document.getElementById('text-input').value = '';

    // Switch to chat view
    switchView('chat');
}
