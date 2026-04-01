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

    // Clear previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Disable button
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

        // Show success
        document.getElementById('resultShortUrl').value = data.data.shortUrl;
        document.getElementById('resultOriginalUrl').value = data.data.originalUrl;
        document.getElementById('resultCreatedAt').textContent = new Date(data.data.createdAt).toLocaleString();
        successDiv.style.display = 'block';

        // Add to recent URLs
        createdUrls.unshift({
            shortCode: data.data.shortCode,
            shortUrl: data.data.shortUrl,
            originalUrl: data.data.originalUrl,
            createdAt: data.data.createdAt,
            clickCount: 0
        });

        // Keep only last 10
        createdUrls = createdUrls.slice(0, 10);
        updateUrlsList();

        // Reset form
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

// Copy to clipboard (modern Clipboard API)
function copyToClipboard(selector) {
    const element = document.querySelector(selector);
    const textToCopy = element.value;
    
    // Use modern Clipboard API
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Show success feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        // Fallback to old method if Clipboard API fails
        element.select();
        document.execCommand('copy');
        alert('✓ Copied to clipboard!');
    });
}

// Update URLs list
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
                <button class="btn btn-small btn-copy" onclick="copyUrlToClipboard('${url.shortUrl}')">Copy Link</button>
                <button class="btn btn-small btn-stats" onclick="getStats('${url.shortCode}')">Stats</button>
                <button class="btn btn-small btn-delete" onclick="deleteUrl('${url.shortCode}', ${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Copy URL to clipboard (modern Clipboard API)
function copyUrlToClipboard(url) {
    navigator.clipboard.writeText(url).then(() => {
        // Show success feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        // Fallback to old method
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✓ Copied to clipboard!');
    });
}

// Get statistics
async function getStats(shortCode) {
    try {
        const response = await fetch(`/api/urls/${shortCode}/stats`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to get statistics');
        }

        // Update click count in the list
        const urlIndex = createdUrls.findIndex(u => u.shortCode === shortCode);
        if (urlIndex !== -1) {
            createdUrls[urlIndex].clickCount = data.data.clickCount;
            updateUrlsList();
        }

        alert(`📊 Statistics for ${shortCode}:\n\nClicks: ${data.data.clickCount}\nCreated: ${new Date(data.data.createdAt).toLocaleString()}`);

    } catch (error) {
        alert('❌ ' + error.message);
    }
}

// Delete URL
async function deleteUrl(shortCode, index) {
    if (!confirm('Are you sure you want to delete this URL?')) {
        return;
    }

    try {
        const response = await fetch(`/api/urls/${shortCode}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete URL');
        }

        // Remove from list
        createdUrls.splice(index, 1);
        updateUrlsList();

        alert('✓ URL deleted successfully');

    } catch (error) {
        alert('❌ ' + error.message);
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

// Save URLs to localStorage whenever they change
function saveUrls() {
    localStorage.setItem('createdUrls', JSON.stringify(createdUrls));
}

// Update local storage whenever URLs change
const originalUpdateUrlsList = updateUrlsList;
updateUrlsList = function() {
    originalUpdateUrlsList();
    saveUrls();
};
