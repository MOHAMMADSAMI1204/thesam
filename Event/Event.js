// event.js - Auto Dot Prefix for Username with Submission Support

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('games');
  const submitButton = form.querySelector('input[type="submit"]');
  
  // Initialize form state
  let isSubmitted = false;
  let formData = {};
  
  // Add focus effects to form fields
  const formFields = form.querySelectorAll('input, select');
  
  formFields.forEach(field => {
    field.addEventListener('focus', function() {
      this.style.borderColor = 'rgba(118, 199, 255, 0.7)';
      this.style.background = 'rgba(118, 199, 255, 0.12)';
    });
    
    field.addEventListener('blur', function() {
      if (!this.value) {
        this.style.borderColor = 'rgba(255, 255, 255, 0.18)';
        this.style.background = 'rgba(255, 255, 255, 0.08)';
      }
    });
  });
  
  // Auto-add dot prefix for Bedrock/Pocket Edition in select options AND username
  const editionSelect = form.querySelector('#edition');
  const usernameInput = form.querySelector('input[name="username"]');
  
  // Function to add dot prefix to specific editions in dropdown
  function addDotPrefixToOptions() {
    const options = editionSelect.options;
    
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const value = option.value;
      
      // Remove existing dot prefix if any
      let displayText = option.textContent.replace('• ', '');
      
      // Add dot prefix for specific editions
      if (value === 'pocket' || value === 'bedrock') {
        option.textContent = '• ' + displayText;
      } else {
        option.textContent = displayText;
      }
    }
  }
  
  // Function to handle username dot prefix (only for display)
  function handleUsernameDotPrefix() {
    if (isSubmitted) return; // Don't modify during display mode
    
    const edition = editionSelect.value;
    const currentUsername = usernameInput.value;
    
    // Remove existing dot prefix if any
    const cleanUsername = currentUsername.replace(/^•\s*/, '');
    
    if ((edition === 'pocket' || edition === 'bedrock') && cleanUsername) {
      // Add dot prefix to username for display
      usernameInput.value = '•' + cleanUsername;
    } else if (cleanUsername) {
      // Remove dot prefix for Java edition
      usernameInput.value = cleanUsername;
    }
  }
  
  // Function to get clean username (without dot prefix)
  function getCleanUsername(username) {
    return username.replace(/^•\s*/, '');
  }
  
  // Initialize dot prefixes
  addDotPrefixToOptions();
  
  // Event listeners for edition change
  editionSelect.addEventListener('change', function() {
    addDotPrefixToOptions();
    if (!isSubmitted) {
      handleUsernameDotPrefix();
    }
  });
  
  // Event listener for username input (to maintain dot prefix during editing)
  usernameInput.addEventListener('input', function() {
    if (isSubmitted) return; // Don't modify during display mode
    
    // If user is typing and we have a dot-prefix edition selected,
    // ensure the dot stays at the beginning
    const edition = editionSelect.value;
    if ((edition === 'pocket' || edition === 'bedrock') && this.value) {
      // If user tries to delete the dot, prevent it
      if (!this.value.startsWith('•')) {
        this.value = '•' + this.value;
      }
    }
  });
  
  // Also handle when user focuses out of username field
  usernameInput.addEventListener('blur', function() {
    if (!isSubmitted) {
      handleUsernameDotPrefix();
    }
  });
  
  // Form submission handler
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formDataObj = new FormData(form);
    let username = formDataObj.get('username');
    
    // Get clean username (remove dot prefix for validation and storage)
    const cleanUsername = getCleanUsername(username);
    
    formData = {
      edition: formDataObj.get('edition'),
      username: cleanUsername, // Store without dot prefix
      discord_id: formDataObj.get('discord_id'),
      discord_username: formDataObj.get('discord_username')
    };
    
    // Validate required fields
    if (!formData.edition || !formData.username) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    // Validate Minecraft username (without dot prefix)
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    if (!usernameRegex.test(formData.username)) {
      showNotification('Please enter a valid Minecraft username (3-16 characters, letters, numbers, and underscores only)', 'error');
      return;
    }
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.value = 'Submitting...';
    
    // Simulate form submission
    setTimeout(() => {
      // Mark as submitted
      isSubmitted = true;
      
      // Change button to Edit mode
      submitButton.value = 'Edit';
      submitButton.classList.add('edit-mode');
      submitButton.disabled = false;
      
      // Update form display with dot prefix if needed
      updateFormDisplay();
      
      // Store original values for edit mode
      storeOriginalValues();
      
      // Show success message
      showFormSuccess();
      showNotification('Your information has been submitted successfully!', 'success');
    }, 1000);
  });
  
  // Update form display after submission (add dot prefix to username if needed)
  function updateFormDisplay() {
    const edition = formData.edition;
    const username = formData.username;
    
    // Add dot prefix to username for display if it's Pocket/Bedrock edition
    if ((edition === 'pocket' || edition === 'bedrock') && username) {
      usernameInput.value = '•' + username;
    } else {
      usernameInput.value = username;
    }
    
    // Update edition select to show dot prefix
    addDotPrefixToOptions();
    editionSelect.value = edition;
  }
  
  // Store original values for edit mode
  function storeOriginalValues() {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      if (input.type !== 'submit') {
        input.dataset.originalValue = input.value;
      }
    });
  }
  
  // Restore original values when editing
  function restoreOriginalValues() {
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
      if (input.type !== 'submit' && input.dataset.originalValue) {
        input.value = input.dataset.originalValue;
      }
    });
  }
  
  // Handle button click based on mode
  submitButton.addEventListener('click', function(e) {
    if (isSubmitted) {
      e.preventDefault();
      
      // Switch back to edit mode
      isSubmitted = false;
      submitButton.value = 'Submit';
      submitButton.classList.remove('edit-mode');
      
      // Restore original values (which include dot prefixes for display)
      restoreOriginalValues();
      
      // Ensure dot prefixes are maintained in dropdown
      addDotPrefixToOptions();
      
      // Remove success message
      hideFormSuccess();
      
      showNotification('You can now edit your information', 'info');
    }
  });
  
  // Show form success message
  function showFormSuccess() {
    let successMessage = form.querySelector('.form-success');
    
    if (!successMessage) {
      successMessage = document.createElement('div');
      successMessage.className = 'form-success';
      successMessage.innerHTML = `
        <p>Information submitted successfully!</p>
        <p>Click "Edit" to modify your details.</p>
      `;
      form.appendChild(successMessage);
    }
    
    successMessage.classList.add('show');
  }
  
  // Hide form success message
  function hideFormSuccess() {
    const successMessage = form.querySelector('.form-success');
    if (successMessage) {
      successMessage.classList.remove('show');
    }
  }
  
  // Real-time validation for Minecraft username (checking without dot prefix)
  usernameInput.addEventListener('input', function() {
    if (isSubmitted) return;
    
    // Get username without dot prefix for validation
    let username = this.value;
    username = getCleanUsername(username);
    
    // Minecraft username validation (3-16 characters, alphanumeric and underscores)
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    
    if (username && !usernameRegex.test(username)) {
      this.style.borderColor = 'rgba(255, 107, 107, 0.7)';
      this.style.background = 'rgba(255, 107, 107, 0.08)';
    } else if (username) {
      this.style.borderColor = 'rgba(76, 175, 80, 0.7)';
      this.style.background = 'rgba(76, 175, 80, 0.08)';
    } else {
      this.style.borderColor = 'rgba(255, 255, 255, 0.18)';
      this.style.background = 'rgba(255, 255, 255, 0.08)';
    }
  });
  
  // Helper function to show notifications
  function showNotification(message, type = 'info') {
    if (window.showNotification) {
      window.showNotification(message, type);
    } else {
      alert(message);
    }
  }
});

// wallet.js - T S Wallet System with Enhanced Features

// ---------------------- WALLET INITIALIZATION ----------------------
function initializeWallet() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
        updateWalletDisplay();
        setupWalletEvents();
    }
}

// ---------------------- WALLET DATA MANAGEMENT ----------------------
function getWalletData() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    return {
        currentBalance: userProfile.coins || 0,
        totalCoins: userProfile.totalCoins || userProfile.coins || 0,
        usedCoins: userProfile.usedCoins || 0,
        bonusCoins: userProfile.bonusCoins || 0,
        winningCoins: userProfile.winningCoins || 0,
        transactions: userProfile.transactions || []
    };
}

function saveWalletData(walletData) {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    userProfile.coins = walletData.currentBalance;
    userProfile.totalCoins = walletData.totalCoins;
    userProfile.usedCoins = walletData.usedCoins;
    userProfile.bonusCoins = walletData.bonusCoins;
    userProfile.winningCoins = walletData.winningCoins;
    userProfile.transactions = walletData.transactions;
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// ---------------------- WALLET DISPLAY UPDATE ----------------------
function updateWalletDisplay() {
    const walletData = getWalletData();
    
    // Update all wallet elements
    const elements = {
        'current-balance': walletData.currentBalance,
        'total-coins': walletData.totalCoins,
        'used-coins': walletData.usedCoins,
        'bonus-coins': walletData.bonusCoins,
        'winning-coins': walletData.winningCoins
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id].toLocaleString();
        }
    });
    
    // Update main coin balance in profile dropdown
    const coinBalanceElement = document.getElementById('coin-balance');
    if (coinBalanceElement) {
        coinBalanceElement.textContent = walletData.currentBalance.toLocaleString();
    }
}

// ---------------------- COIN MANAGEMENT ----------------------
function addCoins(amount, type = 'bonus', description = '') {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && amount > 0) {
        const walletData = getWalletData();
        
        // Update balances based on type
        walletData.currentBalance += amount;
        walletData.totalCoins += amount;
        
        switch(type) {
            case 'bonus':
                walletData.bonusCoins += amount;
                break;
            case 'winning':
                walletData.winningCoins += amount;
                break;
            case 'purchase':
                // For purchased coins, we don't add to bonus or winning
                break;
        }
        
        // Add transaction record
        addTransaction(amount, 'credit', type, description);
        
        saveWalletData(walletData);
        updateWalletDisplay();
        
        if (window.showNotification) {
            showNotification(`+${amount} TS Coins added to your wallet!`, 'success');
        }
        
        return true;
    }
    return false;
}

function useCoins(amount, description = '') {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && amount > 0) {
        const walletData = getWalletData();
        
        if (walletData.currentBalance >= amount) {
            walletData.currentBalance -= amount;
            walletData.usedCoins += amount;
            
            // Add transaction record
            addTransaction(amount, 'debit', 'purchase', description);
            
            saveWalletData(walletData);
            updateWalletDisplay();
            
            return true;
        } else {
            if (window.showNotification) {
                showNotification('Insufficient coins!', 'error');
            }
            return false;
        }
    }
    return false;
}

// ---------------------- TRANSACTION HISTORY ----------------------
function addTransaction(amount, type, category, description) {
    const walletData = getWalletData();
    
    const transaction = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        amount: amount,
        type: type, // 'credit' or 'debit'
        category: category, // 'bonus', 'winning', 'purchase'
        description: description,
        date: new Date().toISOString(),
        balance: type === 'credit' ? 
            walletData.currentBalance + amount : 
            walletData.currentBalance - amount
    };
    
    walletData.transactions.unshift(transaction);
    // Keep only last 50 transactions
    walletData.transactions = walletData.transactions.slice(0, 50);
    
    saveWalletData(walletData);
}

function showTransactionHistory() {
    const walletData = getWalletData();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.maxWidth = '600px';
    modal.style.maxHeight = '80vh';
    modal.style.overflow = 'hidden';
    
    modal.innerHTML = `
        <div class="popup-header">
            <h3>Transaction History</h3>
            <button class="popup-close">&times;</button>
        </div>
        <div class="popup-body" style="max-height: 60vh; overflow-y: auto;">
            ${walletData.transactions.length > 0 ? 
                `<div class="transaction-list">
                    ${walletData.transactions.map(transaction => `
                        <div class="transaction-item ${transaction.type}">
                            <div class="transaction-icon">
                                ${transaction.type === 'credit' ? '📥' : '📤'}
                            </div>
                            <div class="transaction-details">
                                <div class="transaction-description">
                                    ${transaction.description || getDefaultDescription(transaction)}
                                </div>
                                <div class="transaction-date">
                                    ${new Date(transaction.date).toLocaleDateString()} • 
                                    ${new Date(transaction.date).toLocaleTimeString()}
                                </div>
                            </div>
                            <div class="transaction-amount ${transaction.type}">
                                ${transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                            </div>
                        </div>
                    `).join('')}
                </div>` :
                `<div class="empty-transactions">
                    <div class="empty-icon">💰</div>
                    <h4>No transactions yet</h4>
                    <p>Your transaction history will appear here</p>
                </div>`
            }
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close modal events
    const closeBtn = modal.querySelector('.popup-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

function getDefaultDescription(transaction) {
    const typeMap = {
        'credit-bonus': 'Bonus Coins',
        'credit-winning': 'Winning Coins',
        'credit-purchase': 'Coin Purchase',
        'debit-purchase': 'Item Purchase'
    };
    
    const key = `${transaction.type}-${transaction.category}`;
    return typeMap[key] || 'Transaction';
}

// ---------------------- BONUS COINS SYSTEM ----------------------
function claimDailyBonus() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        showNotification('Please sign in to claim daily bonus', 'error');
        return;
    }
    
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const lastBonusDate = userProfile.lastBonusDate;
    const today = new Date().toDateString();
    
    if (lastBonusDate === today) {
        showNotification('Daily bonus already claimed! Come back tomorrow.', 'info');
        return;
    }
    
    // Calculate bonus amount (random between 10-50 coins)
    const bonusAmount = Math.floor(Math.random() * 41) + 10;
    
    // Update user profile
    userProfile.lastBonusDate = today;
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Add bonus coins
    addCoins(bonusAmount, 'bonus', 'Daily Login Bonus');
    
    showNotification(`🎉 Daily Bonus! You received ${bonusAmount} TS Coins!`, 'success');
}

// ---------------------- WALLET UI EVENTS ----------------------
function setupWalletEvents() {
    // Claim bonus button
    const claimBonusBtn = document.getElementById('claim-bonus');
    if (claimBonusBtn) {
        claimBonusBtn.addEventListener('click', claimDailyBonus);
    }
    
    // View history button
    const viewHistoryBtn = document.getElementById('view-history');
    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', showTransactionHistory);
    }
    
    // Refresh wallet button
    const refreshWalletBtn = document.getElementById('refresh-wallet');
    if (refreshWalletBtn) {
        refreshWalletBtn.addEventListener('click', updateWalletDisplay);
    }
}

// ---------------------- WALLET STATISTICS ----------------------
function getWalletStats() {
    const walletData = getWalletData();
    
    return {
        totalEarned: walletData.totalCoins,
        totalSpent: walletData.usedCoins,
        currentBalance: walletData.currentBalance,
        bonusEarned: walletData.bonusCoins,
        winningEarned: walletData.winningCoins,
        transactionCount: walletData.transactions.length
    };
}

// ---------------------- EXPORT FUNCTIONS ----------------------
window.initializeWallet = initializeWallet;
window.updateWalletDisplay = updateWalletDisplay;
window.addCoins = addCoins;
window.useCoins = useCoins;
window.claimDailyBonus = claimDailyBonus;
window.showTransactionHistory = showTransactionHistory;
window.getWalletStats = getWalletStats;

// Initialize wallet when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWallet);
} else {
    initializeWallet();
}

// ---------------------- COPY TO CLIPBOARD FUNCTION ----------------------
function copyToClipboard(inputId) {
    const input = document.getElementById(inputId);
    const copyBtn = input.nextElementSibling;
    
    // Select and copy the text
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        
        // Visual feedback
        const originalIcon = copyBtn.innerHTML;
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<span class="copy-icon">✓</span>';
        
        // Reset after 2 seconds
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = originalIcon;
        }, 2000);
        
        // Show notification if available
        if (window.showNotification) {
            showNotification('Copied to clipboard!', 'success');
        }
    } catch (err) {
        console.error('Failed to copy:', err);
        if (window.showNotification) {
            showNotification('Failed to copy', 'error');
        }
    }
}

// Make function globally available
window.copyToClipboard = copyToClipboard;

// ---------------------- ANNOUNCEMENTS SCROLLBAR ----------------------
// Native scrolling is used, no JavaScript needed for basic functionality

// ---------------------- HELPER FUNCTIONS FOR BUTTON COOLDOWN ----------------------
function setButtonCooldown(buttonId, cooldownMinutes = 30) {
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const endTime = Date.now() + cooldownMs;
    localStorage.setItem(`${buttonId}_cooldown`, endTime.toString());
    startButtonTimer(buttonId, cooldownMinutes);
}

function getButtonCooldown(buttonId) {
    const endTime = localStorage.getItem(`${buttonId}_cooldown`);
    if (!endTime) return null;
    const remaining = parseInt(endTime) - Date.now();
    return remaining > 0 ? remaining : null;
}

function startButtonTimer(buttonId, totalMinutes) {
    const button = document.querySelector(`#${buttonId}`);
    if (!button) return;
    
    const endTime = parseInt(localStorage.getItem(`${buttonId}_cooldown`));
    if (!endTime) return;
    
    const updateTimer = () => {
        const remaining = endTime - Date.now();
        
        if (remaining <= 0) {
            button.disabled = false;
            button.value = button.getAttribute('data-original-value') || 'Submit';
            localStorage.removeItem(`${buttonId}_cooldown`);
            return;
        }
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const originalValue = button.getAttribute('data-original-value') || 'Submit';
        button.value = `${originalValue} (${minutes}:${seconds.toString().padStart(2, '0')})`;
        button.disabled = true;
        
        setTimeout(updateTimer, 1000);
    };
    
    updateTimer();
}

function checkButtonCooldown(buttonId, defaultText) {
    const button = document.querySelector(`#${buttonId}`);
    if (!button) return;
    
    button.setAttribute('data-original-value', defaultText);
    const remaining = getButtonCooldown(buttonId);
    
    if (remaining) {
        const totalMinutes = 30;
        startButtonTimer(buttonId, totalMinutes);
    }
}

// ---------------------- WHITELIST FORM WITH DISCORD WEBHOOK ----------------------
document.addEventListener('DOMContentLoaded', function() {
    const whitelistForm = document.getElementById('whitelist-form');
    if (!whitelistForm) return;
    
    // Discord Webhook URL (from webhooks.env)
    const DISCORD_WEBHOOK_WHITELIST = 'https://discord.com/api/webhooks/1444720212820758580/gZpC95JYepT7DTq2h7PWPynXq5lFTbA6culK-O8oA4tJYnK59IA53ZWsDJHi6AhB-FJZ';
    
    const messageDiv = document.getElementById('whitelist-message');
    const submitBtn = whitelistForm.querySelector('.submit-btn');
    submitBtn.id = 'whitelist-submit-btn';
    
    // Check for existing cooldown on page load
    checkButtonCooldown('whitelist-submit-btn', 'Whitlist Now');
    
    // Edition display names
    const editionNames = {
        'java': 'Java Edition',
        'bedrock': 'Bedrock Edition',
        'pocket': 'Pocket Edition'
    };
    
    whitelistForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('Form submitted!');
        
        // Get form values
        const edition = document.getElementById('minecraft-edition').value;
        const minecraftUsername = document.getElementById('minecraft-username').value.trim();
        const discordUsername = document.getElementById('discord-username').value.trim();
        const imageInput = document.getElementById('image-upload');
        const imageFile = imageInput.files[0];
        
        // Validate required fields
        if (!edition || !minecraftUsername) {
            showFormMessage('Please fill in all required fields (Minecraft Edition and Username)', 'error');
            return;
        }
        
        // Validate image is required
        if (!imageFile) {
            showFormMessage('Please upload an image', 'error');
            return;
        }
        
        // Validate image file type
        if (!imageFile.type.startsWith('image/')) {
            showFormMessage('Please select a valid image file', 'error');
            return;
        }
        
        // Validate Minecraft username
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        if (!usernameRegex.test(minecraftUsername)) {
            showFormMessage('Minecraft username must be 3-16 characters (letters, numbers, and underscores only)', 'error');
            return;
        }
        
        // Validate image file size (max 8MB)
        if (imageFile.size > 8 * 1024 * 1024) {
            showFormMessage('Image size must be less than 8MB', 'error');
            return;
        }
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.value = 'Submitting...';
        
        try {
            // Get current timestamp
            const timestamp = new Date().toISOString();
            const formattedDate = new Date().toLocaleString();
            
            // Prepare fields array
            const fields = [
                {
                    name: '📱 Minecraft Edition',
                    value: editionNames[edition] || edition,
                    inline: false
                },
                {
                    name: '👤 Minecraft Username',
                    value: minecraftUsername,
                    inline: false
                },
                {
                    name: '💬 Discord Username',
                    value: discordUsername || 'Not provided',
                    inline: false
                },
                {
                    name: '🕐 Submitted At',
                    value: formattedDate,
                    inline: false
                }
            ];
            
            // Create Discord embed message
            const embed = {
                title: '🎮 New Whitelist Application',
                description: 'A new whitelist application has been submitted.',
                color: 0x76c7ff, // Blue color
                fields: fields,
                footer: {
                    text: 'THE SAM CITY SMP'
                },
                timestamp: timestamp
            };
            
            // Add image to embed (image is required)
            embed.image = {
                url: `attachment://${imageFile.name}`
            };
            
            // Send with FormData for file attachment
            const formData = new FormData();
            formData.append('payload_json', JSON.stringify({ embeds: [embed] }));
            formData.append('file', imageFile, imageFile.name);
            
            console.log('📤 Sending embed with image to Discord webhook...');
            console.log('Embed data:', JSON.stringify(embed, null, 2));
            
            const response = await fetch(DISCORD_WEBHOOK_WHITELIST, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                const responseData = await response.json();
                console.log('✅ Discord webhook success:', responseData);
                showFormMessage('✅ Whitelist application submitted successfully! We will review it soon.', 'success');
                whitelistForm.reset();
                clearImagePreview();
                // Set 30-minute cooldown
                setButtonCooldown('whitelist-submit-btn', 30);
            } else {
                const errorText = await response.text();
                console.error('❌ Discord webhook error:', response.status, errorText);
                showFormMessage(`❌ Failed to submit application. Error: ${response.status}. Please try again.`, 'error');
                throw new Error(`Failed to submit application: ${response.status}`);
            }
        } catch (error) {
            console.error('Error submitting whitelist application:', error);
            showFormMessage('❌ Failed to submit application. Please try again later.', 'error');
        } finally {
            // Don't re-enable if cooldown is active
            const remaining = getButtonCooldown('whitelist-submit-btn');
            if (!remaining) {
                submitBtn.disabled = false;
                submitBtn.value = 'Whitlist Now';
            }
        }
    });
    
    function showFormMessage(message, type) {
        if (!messageDiv) {
            console.error('Message div not found!');
            return;
        }
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type} show`;
        messageDiv.style.display = 'block';
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 10 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.classList.remove('show');
                setTimeout(() => {
                    if (!messageDiv.classList.contains('show')) {
                        messageDiv.style.display = 'none';
                    }
                }, 400);
            }, 10000);
        }
    }
    
    // Real-time validation for Minecraft username
    const minecraftInput = document.getElementById('minecraft-username');
    if (minecraftInput) {
        minecraftInput.addEventListener('input', function() {
            const username = this.value.trim();
            const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
            
            if (username && !usernameRegex.test(username)) {
                this.style.borderColor = 'rgba(244, 67, 54, 0.6)';
                this.style.background = 'rgba(244, 67, 54, 0.1)';
            } else if (username) {
                this.style.borderColor = 'rgba(76, 175, 80, 0.6)';
                this.style.background = 'rgba(76, 175, 80, 0.1)';
            } else {
                this.style.borderColor = 'rgba(118, 199, 255, 0.25)';
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
    }
    
    // Image upload preview
    const imageInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const fileNameDisplay = document.getElementById('file-name-display');
    
    if (imageInput && imagePreview && fileNameDisplay) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showFormMessage('Please select a valid image file', 'error');
                    this.value = '';
                    fileNameDisplay.textContent = 'No file chosen';
                    return;
                }
                
                // Validate file size (8MB max)
                if (file.size > 8 * 1024 * 1024) {
                    showFormMessage('Image size must be less than 8MB', 'error');
                    this.value = '';
                    fileNameDisplay.textContent = 'No file chosen';
                    return;
                }
                
                // Update file name display
                const fileSize = (file.size / 1024).toFixed(2);
                fileNameDisplay.textContent = `${file.name} (${fileSize} KB)`;
                fileNameDisplay.style.color = '#76c7ff';
                
                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <div class="file-preview-info">
                            <span>Preview</span>
                            <button type="button" class="file-remove-btn" onclick="clearImagePreview()">Remove</button>
                        </div>
                    `;
                    imagePreview.classList.add('show');
                };
                reader.readAsDataURL(file);
            } else {
                fileNameDisplay.textContent = 'No file chosen';
                fileNameDisplay.style.color = 'var(--muted)';
            }
        });
    }
    
    // Function to clear image preview
    window.clearImagePreview = function() {
        const imageInput = document.getElementById('image-upload');
        const imagePreview = document.getElementById('image-preview');
        const fileNameDisplay = document.getElementById('file-name-display');
        
        if (imageInput) imageInput.value = '';
        if (imagePreview) {
            imagePreview.innerHTML = '';
            imagePreview.classList.remove('show');
        }
        if (fileNameDisplay) {
            fileNameDisplay.textContent = 'No file chosen';
            fileNameDisplay.style.color = 'var(--muted)';
        }
    };
    
    // Helper function to convert file to base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
});

// ---------------------- FORGOT PASSWORD FORM WITH DISCORD WEBHOOK ----------------------
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (!forgotPasswordForm) return;
    
    // Discord Webhook URL for Forgot Password
    const DISCORD_WEBHOOK_FORGOT_PASSWORD = 'https://discord.com/api/webhooks/1444795007406968842/mcqjgKpf9Y_mZig57AESzIMjJjA9guQccmzvjiTm0KMbfm588-Xe8B2Z6PLOrpo_O5F4';
    
    const messageDiv = document.getElementById('forgot-password-message');
    const submitBtn = forgotPasswordForm.querySelector('.submit-btn');
    
    // Edition display names
    const editionNames = {
        'java': 'Java Edition',
        'bedrock': 'Bedrock Edition',
        'pocket': 'Pocket Edition'
    };
    
    forgotPasswordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('Forgot Password form submitted!');
        
        // Get form values
        const edition = document.getElementById('fp-minecraft-edition').value;
        const minecraftUsername = document.getElementById('fp-minecraft-username').value.trim();
        const discordUsername = document.getElementById('fp-discord-username').value.trim();
        
        // Validate required fields
        if (!edition || !minecraftUsername) {
            showFPMessage('Please fill in all required fields (Minecraft Edition and Username)', 'error');
            return;
        }
        
        // Validate Minecraft username
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        if (!usernameRegex.test(minecraftUsername)) {
            showFPMessage('Minecraft username must be 3-16 characters (letters, numbers, and underscores only)', 'error');
            return;
        }
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.value = 'Submitting...';
        
        try {
            // Get current timestamp
            const timestamp = new Date().toISOString();
            const formattedDate = new Date().toLocaleString();
            
            // Prepare fields array
            const fields = [
                {
                    name: '📱 Minecraft Edition',
                    value: editionNames[edition] || edition,
                    inline: false
                },
                {
                    name: '👤 Minecraft Username',
                    value: minecraftUsername,
                    inline: false
                },
                {
                    name: '💬 Discord Username',
                    value: discordUsername || 'Not provided',
                    inline: false
                },
                {
                    name: '🕐 Submitted At',
                    value: formattedDate,
                    inline: false
                }
            ];
            
            // Create Discord embed message
            const embed = {
                title: '🔐 Password Reset Request',
                description: 'A new password reset request has been submitted.',
                color: 0x76c7ff, // Blue color
                fields: fields,
                footer: {
                    text: 'THE SAM CITY SMP'
                },
                timestamp: timestamp
            };
            
            // Send without image (JSON payload)
            const payload = {
                embeds: [embed]
            };
            
            console.log('📤 Sending password reset request to Discord webhook...');
            console.log('Embed data:', JSON.stringify(embed, null, 2));
            
            const response = await fetch(DISCORD_WEBHOOK_FORGOT_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                try {
                    const responseData = await response.json();
                    console.log('✅ Discord webhook success:', responseData);
                } catch (e) {
                    // Response is ok but might not have JSON body, that's fine
                    console.log('✅ Discord webhook success (no JSON response)');
                }
                showFPMessage('✅ Password reset request submitted successfully! We will process it soon.', 'success');
                forgotPasswordForm.reset();
                // Set 30-minute cooldown
                setButtonCooldown('forgot-password-submit-btn', 30);
            } else {
                let errorText = '';
                try {
                    errorText = await response.text();
                } catch (e) {
                    errorText = 'Unknown error';
                }
                console.error('❌ Discord webhook error:', response.status, errorText);
                showFPMessage(`❌ Failed to submit request. Error: ${response.status}. Please try again.`, 'error');
                throw new Error(`Failed to submit request: ${response.status}`);
            }
        } catch (error) {
            console.error('Error submitting password reset request:', error);
            // Only show error if it's not already shown above
            if (!messageDiv.textContent.includes('✅')) {
                showFPMessage('❌ Failed to submit request. Please try again later.', 'error');
            }
        } finally {
            // Don't re-enable if cooldown is active
            const remaining = getButtonCooldown('forgot-password-submit-btn');
            if (!remaining) {
                submitBtn.disabled = false;
                submitBtn.value = 'Submit Request';
            }
        }
    });
    
    function showFPMessage(message, type) {
        if (!messageDiv) {
            console.error('Message div not found!');
            return;
        }
        
        // Clear any previous classes
        messageDiv.className = 'form-message';
        
        // Set message and type
        messageDiv.textContent = message;
        messageDiv.classList.add(type);
        messageDiv.classList.add('show');
        messageDiv.style.display = 'block';
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.classList.remove('show');
                setTimeout(() => {
                    if (!messageDiv.classList.contains('show')) {
                        messageDiv.style.display = 'none';
                    }
                }, 400);
            }, 5000);
        }
    }
    
    // Real-time validation for Minecraft username
    const fpMinecraftInput = document.getElementById('fp-minecraft-username');
    if (fpMinecraftInput) {
        fpMinecraftInput.addEventListener('input', function() {
            const username = this.value.trim();
            const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
            
            if (username && !usernameRegex.test(username)) {
                this.style.borderColor = 'rgba(244, 67, 54, 0.6)';
                this.style.background = 'rgba(244, 67, 54, 0.1)';
            } else if (username) {
                this.style.borderColor = 'rgba(76, 175, 80, 0.6)';
                this.style.background = 'rgba(76, 175, 80, 0.1)';
            } else {
                this.style.borderColor = 'rgba(118, 199, 255, 0.25)';
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
    }
    
});

// ---------------------- BUG REPORT FORM WITH DISCORD WEBHOOK ----------------------
document.addEventListener('DOMContentLoaded', function() {
    const bugReportForm = document.getElementById('bug-report-form');
    if (!bugReportForm) return;
    
    // Discord Webhook URL for Bug Report
    const DISCORD_WEBHOOK_BUG_REPORT = 'https://discord.com/api/webhooks/1444801708164382845/5oJPD1XFdJAHauXjqn49lnony1pYMMI-HYY237wKSIM-MThJTQF755_8ATdcqS2EcasI';
    
    const messageDiv = document.getElementById('bug-report-message');
    const submitBtn = bugReportForm.querySelector('.submit-btn');
    
    bugReportForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('Bug Report form submitted!');
        
        // Get form values
        const discordUsername = document.getElementById('bug-discord-username').value.trim();
        const title = document.getElementById('bug-title').value.trim();
        const description = document.getElementById('bug-description').value.trim();
        const imageInput = document.getElementById('bug-image-upload');
        const imageFile = imageInput.files[0];
        
        // Validate required fields
        if (!title || !description) {
            showBugMessage('Please fill in all required fields (Title and Description)', 'error');
            return;
        }
        
        // Validate title length
        if (title.length < 5) {
            showBugMessage('Title must be at least 5 characters long', 'error');
            return;
        }
        
        // Validate description length
        if (description.length < 20) {
            showBugMessage('Please provide a more detailed description (at least 20 characters)', 'error');
            return;
        }
        
        // Validate image if provided
        if (imageFile) {
            if (!imageFile.type.startsWith('image/')) {
                showBugMessage('Please select a valid image file', 'error');
                return;
            }
            
            if (imageFile.size > 8 * 1024 * 1024) {
                showBugMessage('Image size must be less than 8MB', 'error');
                return;
            }
        }
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.value = 'Submitting...';
        
        try {
            // Get current timestamp
            const timestamp = new Date().toISOString();
            const formattedDate = new Date().toLocaleString();
            
            // Prepare fields array
            const fields = [
                {
                    name: '📝 Title',
                    value: title.length > 256 ? title.substring(0, 253) + '...' : title,
                    inline: false
                },
                {
                    name: '📄 Description',
                    value: description.length > 1024 ? description.substring(0, 1021) + '...' : description,
                    inline: false
                }
            ];
            
            // Add Discord Username if provided
            if (discordUsername) {
                fields.push({
                    name: '💬 Discord Username',
                    value: discordUsername,
                    inline: false
                });
            }
            
            // Add timestamp
            fields.push({
                name: '🕐 Submitted At',
                value: formattedDate,
                inline: false
            });
            
            // Create Discord embed message
            const embed = {
                title: '🐛 New Bug Report',
                description: 'A new bug report has been submitted.',
                color: 0xff6b6b, // Red color for bugs
                fields: fields,
                footer: {
                    text: 'THE SAM CITY SMP'
                },
                timestamp: timestamp
            };
            
            // Handle image upload
            if (imageFile) {
                // Add image to embed
                embed.image = {
                    url: `attachment://${imageFile.name}`
                };
                
                // Send with FormData for file attachment
                const formData = new FormData();
                formData.append('payload_json', JSON.stringify({ embeds: [embed] }));
                formData.append('file', imageFile, imageFile.name);
                
                console.log('📤 Sending bug report with image to Discord webhook...');
                console.log('Embed data:', JSON.stringify(embed, null, 2));
                
                const response = await fetch(DISCORD_WEBHOOK_BUG_REPORT, {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    try {
                        const responseData = await response.json();
                        console.log('✅ Discord webhook success:', responseData);
                    } catch (e) {
                        console.log('✅ Discord webhook success (no JSON response)');
                    }
                    showBugMessage('✅ Bug report submitted successfully! Thank you for helping us improve.', 'success');
                    bugReportForm.reset();
                    clearBugImagePreview();
                    // Set 30-minute cooldown
                    setButtonCooldown('bug-report-submit-btn', 30);
                } else {
                    let errorText = '';
                    try {
                        errorText = await response.text();
                    } catch (e) {
                        errorText = 'Unknown error';
                    }
                    console.error('❌ Discord webhook error:', response.status, errorText);
                    showBugMessage(`❌ Failed to submit report. Error: ${response.status}. Please try again.`, 'error');
                    throw new Error(`Failed to submit report: ${response.status}`);
                }
            } else {
                // Send without image (JSON payload)
                const payload = {
                    embeds: [embed]
                };
                
                console.log('📤 Sending bug report to Discord webhook...');
                console.log('Embed data:', JSON.stringify(embed, null, 2));
                
                const response = await fetch(DISCORD_WEBHOOK_BUG_REPORT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
            
                if (response.ok) {
                    try {
                        const responseData = await response.json();
                        console.log('✅ Discord webhook success:', responseData);
                    } catch (e) {
                        console.log('✅ Discord webhook success (no JSON response)');
                    }
                    showBugMessage('✅ Bug report submitted successfully! Thank you for helping us improve.', 'success');
                    bugReportForm.reset();
                    clearBugImagePreview();
                    // Set 30-minute cooldown
                    setButtonCooldown('bug-report-submit-btn', 30);
                } else {
                    let errorText = '';
                    try {
                        errorText = await response.text();
                    } catch (e) {
                        errorText = 'Unknown error';
                    }
                    console.error('❌ Discord webhook error:', response.status, errorText);
                    showBugMessage(`❌ Failed to submit report. Error: ${response.status}. Please try again.`, 'error');
                    throw new Error(`Failed to submit report: ${response.status}`);
                }
            }
        } catch (error) {
            console.error('Error submitting bug report:', error);
            if (!messageDiv.textContent.includes('✅')) {
                showBugMessage('❌ Failed to submit report. Please try again later.', 'error');
            }
        } finally {
            // Don't re-enable if cooldown is active
            const remaining = getButtonCooldown('bug-report-submit-btn');
            if (!remaining) {
                submitBtn.disabled = false;
                submitBtn.value = 'Submit Report';
            }
        }
    });
    
    function showBugMessage(message, type) {
        if (!messageDiv) {
            console.error('Message div not found!');
            return;
        }
        
        // Clear any previous classes
        messageDiv.className = 'form-message';
        
        // Set message and type
        messageDiv.textContent = message;
        messageDiv.classList.add(type);
        messageDiv.classList.add('show');
        messageDiv.style.display = 'block';
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.classList.remove('show');
                setTimeout(() => {
                    if (!messageDiv.classList.contains('show')) {
                        messageDiv.style.display = 'none';
                    }
                }, 400);
            }, 5000);
        }
    }
    
    // Image upload preview for bug report form
    const bugImageInput = document.getElementById('bug-image-upload');
    const bugImagePreview = document.getElementById('bug-image-preview');
    const bugFileNameDisplay = document.getElementById('bug-file-name-display');
    
    if (bugImageInput && bugImagePreview && bugFileNameDisplay) {
        bugImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showBugMessage('Please select a valid image file', 'error');
                    this.value = '';
                    bugFileNameDisplay.textContent = 'No file chosen';
                    return;
                }
                
                // Validate file size (8MB max)
                if (file.size > 8 * 1024 * 1024) {
                    showBugMessage('Image size must be less than 8MB', 'error');
                    this.value = '';
                    bugFileNameDisplay.textContent = 'No file chosen';
                    return;
                }
                
                // Update file name display
                const fileSize = (file.size / 1024).toFixed(2);
                bugFileNameDisplay.textContent = `${file.name} (${fileSize} KB)`;
                bugFileNameDisplay.style.color = '#76c7ff';
                
                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    bugImagePreview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <div class="file-preview-info">
                            <span>Preview</span>
                            <button type="button" class="file-remove-btn" onclick="clearBugImagePreview()">Remove</button>
                        </div>
                    `;
                    bugImagePreview.classList.add('show');
                };
                reader.readAsDataURL(file);
            } else {
                bugFileNameDisplay.textContent = 'No file chosen';
                bugFileNameDisplay.style.color = 'var(--muted)';
            }
        });
    }
    
    // Function to clear image preview for bug report form
    window.clearBugImagePreview = function() {
        const bugImageInput = document.getElementById('bug-image-upload');
        const bugImagePreview = document.getElementById('bug-image-preview');
        const bugFileNameDisplay = document.getElementById('bug-file-name-display');
        
        if (bugImageInput) bugImageInput.value = '';
        if (bugImagePreview) {
            bugImagePreview.innerHTML = '';
            bugImagePreview.classList.remove('show');
        }
        if (bugFileNameDisplay) {
            bugFileNameDisplay.textContent = 'No file chosen';
            bugFileNameDisplay.style.color = 'var(--muted)';
        }
    };
});