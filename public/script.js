// Store created URLs
let createdUrls = [];

// Form submission
document.getElementById('shortenForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const originalUrl = document.getElementById('originalUrl').value;
    const customAlias = document.getElementById('customAlias').value;
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';

    try {
        const body = {
            originalUrl: originalUrl,
            ...(customAlias && { customAlias: customAlias })
        };

        const response = await fetch('/api/urls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create short URL');
        }

        document.getElementById('resultShortUrl').value = data.data.shortUrl;
        document.getElementById('resultOriginalUrl').value = data.data.originalUrl;
        document.getElementById('resultCreatedAt').textContent = new Date(data.data.createdAt).toLocaleString();
        successDiv.style.display = 'block';

        createdUrls.unshift({
            shortCode: data.data.shortCode,
            shortUrl: data.data.shortUrl,
            originalUrl: data.data.originalUrl,
            createdAt: data.data.createdAt,
            clickCount: 0
        });

        createdUrls = createdUrls.slice(0, 10);
        updateUrlsList();
        saveUrls();

        e.target.reset();
        document.getElementById('originalUrl').focus();

    } catch (error) {
        errorDiv.textContent = '❌ ' + error.message;
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Shorten URL';
    }
});

// Copy to clipboard (main form)
function copyToClipboard(selector) {
    const element = document.querySelector(selector);
    const textToCopy = element.value;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        element.select();
        document.execCommand('copy');
        alert('✓ Copied to clipboard!');
    });
}

// Update URLs list - uses data attributes and event delegation
function updateUrlsList() {
    const urlsList = document.getElementById('urlsList');

    if (createdUrls.length === 0) {
        urlsList.innerHTML = '<p class="placeholder">No URLs created yet</p>';
        return;
    }

    urlsList.innerHTML = createdUrls.map((url, index) => `
        <div class="url-item">
            <div class="url-info">
                <div class="url-short">${url.shortUrl}</div>
                <div class="url-original" title="${url.originalUrl}">→ ${url.originalUrl}</div>
                <div class="url-meta">Created: ${new Date(url.createdAt).toLocaleString()}</div>
            </div>
            <div class="url-actions">
                <button class="btn btn-small btn-copy" data-url="${url.shortUrl}" data-type="copy">Copy Link</button>
                <button class="btn btn-small btn-stats" data-code="${url.shortCode}" data-type="stats">Stats</button>
                <button class="btn btn-small btn-delete" data-code="${url.shortCode}" data-index="${index}" data-type="delete">Delete</button>
            </div>
        </div>
    `).join('');

    // Attach event listeners
    attachUrlActions();
}

// Attach event listeners using event delegation
function attachUrlActions() {
    const urlsList = document.getElementById('urlsList');
    
    urlsList.removeEventListener('click', handleUrlAction);
    urlsList.addEventListener('click', handleUrlAction);
}

// Handle all URL actions
async function handleUrlAction(e) {
    const btn = e.target.closest('button[data-type]');
    if (!btn) return;

    const type = btn.dataset.type;

    if (type === 'copy') {
        const url = btn.dataset.url;
        try {
            await navigator.clipboard.writeText(url);
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        } catch {
            alert('✓ Copied to clipboard!');
        }
    } 
    else if (type === 'stats') {
        const shortCode = btn.dataset.code;
        try {
            const response = await fetch(`/api/urls/${shortCode}/stats`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to get statistics');
            alert(`📊 Statistics for ${shortCode}:\n\nClicks: ${data.data.clickCount}\nCreated: ${new Date(data.data.createdAt).toLocaleString()}`);
        } catch (error) {
            alert('❌ ' + error.message);
        }
    } 
    else if (type === 'delete') {
        const shortCode = btn.dataset.code;
        const index = parseInt(btn.dataset.index);

        if (!confirm('Are you sure you want to delete this URL?')) return;

        try {
            const response = await fetch(`/api/urls/${shortCode}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to delete URL');
            
            createdUrls.splice(index, 1);
            updateUrlsList();
            saveUrls();
            alert('✓ URL deleted successfully');
        } catch (error) {
            alert('❌ ' + error.message);
        }
    }
}

// Load URLs from localStorage on page load
window.addEventListener('load', () => {
    const saved = localStorage.getItem('createdUrls');
    if (saved) {
        try {
            createdUrls = JSON.parse(saved);
            updateUrlsList();
        } catch (e) {
            console.error('Failed to load saved URLs:', e);
        }
    }
    document.getElementById('originalUrl').focus();
});

// Save URLs to localStorage
function saveUrls() {
    localStorage.setItem('createdUrls', JSON.stringify(createdUrls));
}
