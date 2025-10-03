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
        notification.className = 'fixed bottom-4 right-4 bg-gray-200 text-black px-6 py-3 rounded-lg shadow-lg';
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
                <button class="copy-btn flex-shrink-0 bg-gray-700 text-white px-3 py-1 rounded-lg text-sm" onclick="copyText('${escapeHtml(text).replace(/'/g, "\\'")}')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                </button>
            </div>
        `;
    }

    chatMessages.appendChild(messageDiv);
    scrollChatToBottom();

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
    // left panel removed, do nothing
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
                <div class="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center text-3xl font-bold text-black">
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
    sidebarTexts.forEach(t => t.style.display = 'none');
} else {
    sidebarTexts.forEach(t => t.style.display = 'inline');
}

}




// ------------------------
// History dropdown in sidebar
// ------------------------
async function loadHistoryDropdown() {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/history`, {  // corrected endpoint
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
            div.className = "flex justify-between items-center p-2 rounded hover:bg-gray-800 cursor-pointer";

            const textSpan = document.createElement("span");
            textSpan.textContent = item.input_text || "No input";
            textSpan.className = "flex-1";
            textSpan.addEventListener("click", () => {
                showChatFromHistory(item);
                document.getElementById("history-dropdown").classList.add("hidden");
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑";
            deleteBtn.className = "ml-2 text-gray hover:text-white";
            deleteBtn.addEventListener("click", async (e) => {
                e.stopPropagation(); // prevent triggering showChat
                if (!confirm("Are you sure you want to delete this history item?")) return;

                try {
                    const delRes = await fetch(`${API_BASE_URL}/history/${item.id}`, {
                        method: "DELETE",
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (delRes.status === 204) {
                        div.remove(); // remove from dropdown
                    } else {
                        const errData = await delRes.json();
                        throw new Error(errData.detail || "Failed to delete history");
                    }
                } catch (err) {
                    console.error(err);
                    showError("Failed to delete history");
                }
            });

            div.appendChild(textSpan);
            div.appendChild(deleteBtn);
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

    scrollChatToBottom();
 // scroll to bottom
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
    switchView('history');
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


function scrollChatToBottom() {
    const chatMessages = document.getElementById("chat-messages");
    if (!chatMessages) return;
    // Use requestAnimationFrame for smoother scroll after DOM updates
    requestAnimationFrame(() => {
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: "smooth" // or "auto" if you want instant scroll
        });
    });
}


const mobileBtn = document.getElementById("mobile-menu-btn");
const mobileOverlay = document.getElementById("mobile-overlay");

// Open sidebar
mobileBtn.addEventListener("click", () => {
    sidebar.classList.add("mobile-open");
    mobileOverlay.classList.add("active");
});

// Close sidebar when overlay clicked
mobileOverlay.addEventListener("click", () => {
    sidebar.classList.remove("mobile-open");
    mobileOverlay.classList.remove("active");
});

// Optional: close sidebar on mobile when a sidebar item is clicked
document.querySelectorAll(".sidebar-item").forEach(item => {
    item.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove("mobile-open");
            mobileOverlay.classList.remove("active");
        }
    });
});

