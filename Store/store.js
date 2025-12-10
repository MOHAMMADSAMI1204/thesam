// store.js - Image-Only Scrolling Advertisement with 650x200 Images

class ImageScrollAds {
  constructor() {
    this.scrollTrack = document.getElementById('image-scroll-track');
    this.indicators = document.querySelectorAll('.image-indicator');
    this.swipeLeft = document.getElementById('swipe-left');
    this.swipeRight = document.getElementById('swipe-right');
    
    this.currentImage = 0;
    this.totalImages = document.querySelectorAll('.scroll-image-item').length;
    this.autoScrollInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }
  
  init() {
    // Add swipe arrow event listeners
    if (this.swipeLeft && this.swipeRight) {
      this.swipeLeft.addEventListener('click', () => this.prevImage());
      this.swipeRight.addEventListener('click', () => this.nextImage());
    }
    
    // Add indicator event listeners
    this.indicators.forEach(indicator => {
      indicator.addEventListener('click', () => {
        this.currentImage = parseInt(indicator.getAttribute('data-index'));
        this.updateImageDisplay();
      });
    });
    
    // Add touch event listeners for mobile
    const scrollContainer = document.querySelector('.image-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('touchstart', e => {
        this.touchStartX = e.changedTouches[0].screenX;
      });
      
      scrollContainer.addEventListener('touchend', e => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prevImage();
      } else if (e.key === 'ArrowRight') {
        this.nextImage();
      }
    });
    
    // Auto-scroll functionality
    this.startAutoScroll();
    
    // Pause auto-scroll on hover
    if (scrollContainer) {
      scrollContainer.addEventListener('mouseenter', () => {
        this.stopAutoScroll();
        this.showSwipeArrows();
      });
      
      scrollContainer.addEventListener('mouseleave', () => {
        this.startAutoScroll();
        this.hideSwipeArrows();
      });
      
      // Show arrows on touch devices when needed
      this.setupTouchArrowVisibility();
    }
  }
  
  updateImageDisplay() {
    if (!this.scrollTrack) return;
    
    // Update track position
    this.scrollTrack.style.transform = `translateX(-${this.currentImage * 100}%)`;
    
    // Update indicators
    this.indicators.forEach((indicator, index) => {
      if (index === this.currentImage) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  nextImage() {
    this.currentImage = (this.currentImage + 1) % this.totalImages;
    this.updateImageDisplay();
  }
  
  prevImage() {
    this.currentImage = (this.currentImage - 1 + this.totalImages) % this.totalImages;
    this.updateImageDisplay();
  }
  
  startAutoScroll() {
    this.stopAutoScroll(); // Clear any existing interval
    this.autoScrollInterval = setInterval(() => this.nextImage(), 4000);
  }
  
  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }
  
  handleSwipe() {
    const swipeThreshold = 40;
    
    if (this.touchEndX < this.touchStartX - swipeThreshold) {
      // Swipe left - next image
      this.nextImage();
    } else if (this.touchEndX > this.touchStartX + swipeThreshold) {
      // Swipe right - previous image
      this.prevImage();
    }
  }
  
  showSwipeArrows() {
    if (this.swipeLeft && this.swipeRight) {
      this.swipeLeft.style.opacity = '1';
      this.swipeRight.style.opacity = '1';
    }
  }
  
  hideSwipeArrows() {
    if (this.swipeLeft && this.swipeRight) {
      this.swipeLeft.style.opacity = '0';
      this.swipeRight.style.opacity = '0';
    }
  }
  
  setupTouchArrowVisibility() {
    // On touch devices, show arrows briefly when touching the container
    const scrollContainer = document.querySelector('.image-scroll-container');
    
    if (scrollContainer) {
      scrollContainer.addEventListener('touchstart', () => {
        this.showSwipeArrows();
        // Hide arrows after 3 seconds
        setTimeout(() => {
          if (!scrollContainer.matches(':hover')) {
            this.hideSwipeArrows();
          }
        }, 3000);
      });
    }
  }
}

// Rank Purchase Handler
class RankPurchaseHandler {
  constructor() {
    this.init();
  }
  
  init() {
    // Use event delegation to handle clicks on rank buttons and pack buttons
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.rank-buy-btn, .Pack-buy-btn');
      if (button && button.hasAttribute('data-product') && button.hasAttribute('data-price')) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Purchase button clicked:', button.getAttribute('data-product'));
        this.handlePurchase(button);
      }
    });
    
    // Also log how many buttons we found
    const rankButtons = document.querySelectorAll('.rank-buy-btn[data-product][data-price]');
    const packButtons = document.querySelectorAll('.Pack-buy-btn[data-product][data-price]');
    console.log(`RankPurchaseHandler initialized - found ${rankButtons.length} rank buttons and ${packButtons.length} pack buttons`);
  }
  
  handlePurchase(button) {
    const product = button.getAttribute('data-product');
    const price = button.getAttribute('data-price');
    
    if (!product || !price) {
      console.error('Missing product or price data');
      return;
    }
    
    const priceNumber = parseInt(price);
    
    console.log('Opening popup for:', product, priceNumber);
    
    // Show purchase form popup
    this.showPurchaseForm(button, product, priceNumber);
  }
  
  showPurchaseForm(button, product, price) {
    console.log('showPurchaseForm called for:', product);
    
    // Remove any existing popups first
    const existingOverlays = document.querySelectorAll('.popup-overlay');
    existingOverlays.forEach(overlay => overlay.remove());
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.zIndex = '10000'; // Ensure it's on top
    overlay.style.display = 'flex'; // Ensure it's displayed
    
    // Check if this is a pack button (currency section)
    const isPackButton = button.classList.contains('Pack-buy-btn');
    
    // Create popup content
    const popup = document.createElement('div');
    popup.className = 'popup-content';
    
    popup.innerHTML = `
      <div class="popup-header">
        <h3>Purchase ${product}</h3>
        <button class="popup-close">&times;</button>
      </div>
      <div class="popup-body">
        <form id="Rank-form" class="Rank-form">
          <div class="form-group">
            <label for="minecraft-edition" class="form-label">
              Minecraft Edition
              <span class="required">*</span>
            </label>
            <select id="minecraft-edition" name="minecraft-edition" class="form-input" required>
              <option value="">Select Edition</option>
              <option value="java">Java Edition</option>
              <option value="bedrock">Bedrock Edition</option>
              <option value="pocket">Pocket Edition</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="minecraft-username" class="form-label">
              Minecraft Username
              <span class="required">*</span> 
            </label>
            <input 
              type="text" 
              id="minecraft-username" 
              name="minecraft-username" 
              class="form-input" 
              placeholder="Enter your Minecraft username"
              required
              pattern="[a-zA-Z0-9_]{3,16}"
              title="Minecraft username must be 3-16 characters (letters, numbers, and underscores only)"
            >
          </div>
          
          <div class="form-group">
            <label for="discord-username" class="form-label">
              Discord Username 
              <span class="optional">(Optional)</span>
            </label>
            <input 
              type="text" 
              id="discord-username" 
              name="discord-username" 
              class="form-input" 
              placeholder="Enter your Discord username (e.g., username#1234)"
            >
          </div>
          ${isPackButton ? `
          <div class="form-group">
            <label for="youtube-username" class="form-label">
              YouTube Livechat Username
              <span class="required">*</span>
            </label>
            <input 
              type="text" 
              id="youtube-username" 
              name="youtube-username" 
              class="form-input" 
              placeholder="Enter your YouTube livechat username"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="current-ts-coins" class="form-label">
              Current TS Coins
              <span class="required">*</span>
            </label>
            <input 
              type="number" 
              id="current-ts-coins" 
              name="current-ts-coins" 
              class="form-input" 
              placeholder="Enter your current TS Coins"
              required
              min="0"
              step="1"
            >
          </div>
          ` : ''}
          <div class="form-group">
            <label for="image-upload" class="form-label">
              Upload Image
              <span class="required">*</span>
            </label>
            <div class="file-upload-wrapper">
              <input 
                type="file" 
                id="image-upload" 
                name="image-upload" 
                class="file-input" 
                accept="image/*"
                required
              >
              <label for="image-upload" class="file-upload-button">
                <span class="file-upload-button-text">Choose File</span>
              </label>
              <span class="file-name-display" id="file-name-display">No file chosen</span>
              <div class="file-preview-inline" id="image-preview"></div>
            </div>
          </div>
          
          <div class="form-actions">
            <input type="submit" value="Rank Now" class="submit-btn">
          </div>
          
          <div class="form-message" id="Rank-message"></div>
        </form>
      </div>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    console.log('Rank form popup overlay added to body');
    
    // Force display and ensure visibility
    requestAnimationFrame(() => {
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      popup.style.transform = 'scale(1)';
    });
    
    // Close handlers
    const closeBtn = popup.querySelector('.popup-close');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
    
    // File upload preview handler
    const fileInput = popup.querySelector('#image-upload');
    const fileNameDisplay = popup.querySelector('#file-name-display');
    const imagePreview = popup.querySelector('#image-preview');
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        fileNameDisplay.textContent = file.name;
        
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="preview-image">`;
        };
        reader.readAsDataURL(file);
      } else {
        fileNameDisplay.textContent = 'No file chosen';
        imagePreview.innerHTML = '';
      }
    });
    
    // Form submission handler
    const form = popup.querySelector('#Rank-form');
    // Store button class to determine webhook (already defined above)
    // Get TS Coins value if available
    const tsCoins = button.getAttribute('data-ts-coins');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(form, product, price, overlay, isPackButton, tsCoins);
    });
  }
  
  async handleFormSubmit(form, product, price, overlay, isPackButton = false, tsCoins = null) {
    const formData = new FormData(form);
    const minecraftEdition = formData.get('minecraft-edition');
    const minecraftUsername = formData.get('minecraft-username');
    const discordUsername = formData.get('discord-username');
    const youtubeUsername = isPackButton ? formData.get('youtube-username') : null;
    const currentTsCoinsInput = isPackButton ? formData.get('current-ts-coins') : null;
    const imageFile = formData.get('image-upload');
    
    // Get current TS coins from input field (only for pack buttons)
    const currentTsCoins = isPackButton && currentTsCoinsInput ? parseInt(currentTsCoinsInput) : null;
    
    // Validate required fields
    if (!minecraftEdition || minecraftEdition.trim() === '') {
      this.showFormMessage('Please select a Minecraft Edition', 'error');
      return;
    }
    
    if (!minecraftUsername || minecraftUsername.trim() === '') {
      this.showFormMessage('Please enter your Minecraft username', 'error');
      return;
    }
    
    // Validate pack-specific required fields
    if (isPackButton) {
      if (!youtubeUsername || youtubeUsername.trim() === '') {
        this.showFormMessage('Please enter your YouTube Livechat Username', 'error');
        return;
      }
      
      if (!currentTsCoinsInput || currentTsCoinsInput.trim() === '' || isNaN(currentTsCoins) || currentTsCoins < 0) {
        this.showFormMessage('Please enter a valid Current TS Coins amount', 'error');
        return;
      }
    }
    
    if (!imageFile || imageFile.size === 0) {
      this.showFormMessage('Please upload an image', 'error');
      return;
    }
    
    // Show loading state
    this.showFormMessage('Submitting request...', 'success');
    const submitBtn = form.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.value = 'Submitting...';
    }
    
    try {
      // Determine webhook URL based on button type
      const webhookUrl = isPackButton 
        ? 'https://discord.com/api/webhooks/1444948439472406562/spjCoHZ82hh-P1DLXAZNqaleLMtP9E8rXC6KsEeI7C2i_OYnz6JNDDv4u_EHLLATHTWU'
        : 'https://discord.com/api/webhooks/1444910524025278484/0QwlSBMIL606PmC42c-uRGWhfskWy95dBxxevVLaa-013PQhFbtzDha4YEamptvsrZsS';
      
      // Send to Discord webhook
      await this.sendToDiscordWebhook(product, price, {
        minecraftEdition: minecraftEdition,
        minecraftUsername: minecraftUsername,
        discordUsername: discordUsername,
        youtubeUsername: youtubeUsername,
        currentTsCoins: currentTsCoins,
        imageFile: imageFile
      }, null, webhookUrl, tsCoins);
      
      // Process purchase
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      this.processPurchase(user, product, price, {
        minecraftEdition: minecraftEdition,
        minecraftUsername: minecraftUsername,
        discordUsername: discordUsername,
        youtubeUsername: youtubeUsername,
        currentTsCoins: currentTsCoins,
        imageFile: imageFile
      });
      
      // Close popup
      document.body.removeChild(overlay);
    } catch (error) {
      console.error('Error submitting form:', error);
      this.showFormMessage('Failed to submit. Please try again.', 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.value = 'Rank Now';
      }
    }
  }
  
  async sendToDiscordWebhook(product, price, formData, user = null, webhookUrl = null, tsCoins = null) {
    // Use provided webhook URL or default to rank webhook
    if (!webhookUrl) {
      webhookUrl = 'https://discord.com/api/webhooks/1444910524025278484/0QwlSBMIL606PmC42c-uRGWhfskWy95dBxxevVLaa-013PQhFbtzDha4YEamptvsrZsS';
    }
    
    // Format edition name
    const editionNames = {
      'java': 'Java Edition',
      'bedrock': 'Bedrock Edition',
      'pocket': 'Pocket Edition'
    };
    const editionDisplay = editionNames[formData.minecraftEdition] || formData.minecraftEdition;
    
    // Format submission date/time
    const now = new Date();
    const submittedAt = now.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
    
    // Create Discord embed
    const embed = {
      title: '🎮 New Rank Purchase Request',
      color: 0x76c7ff, // Blue color matching the theme
      fields: [
        {
          name: '📦 Product',
          value: product,
          inline: false
        },
        {
          name: '💰 Price',
          value: `${price.toLocaleString()} TS Coins`,
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'THE SAM City Store'
      }
    };
    
    // Add TS Coins field if available (for packs)
    if (tsCoins) {
      const tsCoinsFormatted = parseInt(tsCoins).toLocaleString('en-IN');
      embed.fields.push({
        name: '🪙 TS Coins Included',
        value: `${tsCoinsFormatted} TS Coins`,
        inline: false
      });
    }
    
    // Add other fields
    embed.fields.push(
      {
        name: '🎮 Minecraft Edition',
        value: editionDisplay,
        inline: false
      },
      {
        name: '👤 Minecraft Username',
        value: formData.minecraftUsername,
        inline: false
      },
      {
        name: '💬 Discord Username',
        value: formData.discordUsername || 'Not provided',
        inline: false
      }
    );
    
    // Add YouTube username and current TS coins only if provided (for pack buttons)
    if (formData.youtubeUsername !== undefined) {
      embed.fields.push({
        name: '📺 YouTube Livechat Username',
        value: formData.youtubeUsername || 'Not provided',
        inline: false
      });
    }
    
    if (formData.currentTsCoins !== undefined && formData.currentTsCoins !== null) {
      embed.fields.push({
        name: '🪙 Current TS Coins',
        value: `${formData.currentTsCoins.toLocaleString('en-IN')} TS Coins`,
        inline: false
      });
    }
    
    // Add submitted at timestamp
    embed.fields.push({
      name: '🕐 Submitted At',
      value: submittedAt,
      inline: false
    });
    
    // Add image to embed if file is available
    if (formData.imageFile && formData.imageFile.size > 0) {
      // Reference the uploaded file in the embed
      embed.image = {
        url: `attachment://${formData.imageFile.name}`
      };
    }
    
    // Prepare payload with file
    const payload = new FormData();
    payload.append('payload_json', JSON.stringify({
      embeds: [embed]
    }));
    
    // Add image file if available
    if (formData.imageFile && formData.imageFile.size > 0) {
      payload.append('file', formData.imageFile, formData.imageFile.name);
    }
    
    // Send to Discord webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: payload
    });
    
    if (!response.ok) {
      throw new Error(`Discord webhook error: ${response.status}`);
    }
    
    return response;
  }
  
  showFormMessage(message, type) {
    const messageEl = document.getElementById('Rank-message');
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.className = `form-message ${type}`;
      setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'form-message';
      }, 5000);
    }
  }
  
  processPurchase(user, product, price, formData = {}) {
    // Update user's coin balance only if user is logged in
    if (user) {
      user.coins = (user.coins || 0) - price;
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update wallet display
      if (window.updateWalletDisplay) {
        updateWalletDisplay();
      }
    }
    
    // Show success message
    showNotification(`Purchase request submitted for ${product}!`, 'success');
    
    // Here you would typically send this data to your backend
    console.log('Purchase processed:', {
      user: user ? user.email : 'Not logged in',
      product: product,
      price: price,
      remainingCoins: user ? user.coins : 'N/A',
      minecraftEdition: formData.minecraftEdition,
      minecraftUsername: formData.minecraftUsername,
      discordUsername: formData.discordUsername,
      imageFile: formData.imageFile
    });
  }
}

// Initialize image scrolling when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Store.js loaded - 650x200 Image scrolling with swipe navigation initialized');
  
  // Initialize image scrolling ads
  if (document.querySelector('.image-scroll-container')) {
    new ImageScrollAds();
  }
  
  // Initialize rank purchase handler (uses event delegation, so always initialize)
  console.log('Initializing RankPurchaseHandler...');
  new RankPurchaseHandler();
  
  // Update wallet display if user is logged in
  if (window.updateWalletDisplay) {
    updateWalletDisplay();
  }
});

// Item Purchase Handler
class ItemPurchaseHandler {
  constructor() {
    this.itemButtons = document.querySelectorAll('.item-buy-btn');
    this.itemCards = document.querySelectorAll('.item-card');
    this.init();
  }
  
  init() {
    // Initialize button click handlers
    this.itemButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handlePurchase(button);
      });
    });
    
    // Add hover effects to item cards
    this.itemCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.addHoverEffects(card);
      });
      
      card.addEventListener('mouseleave', () => {
        this.removeHoverEffects(card);
      });
    });
    
    // Add intersection observer for animations
    this.setupScrollAnimations();
  }
  
  addHoverEffects(card) {
    // Add subtle animation to card elements
    const title = card.querySelector('.item-title');
    const price = card.querySelector('.item-price');
    const button = card.querySelector('.item-buy-btn');
    
    if (title) {
      title.style.transform = 'translateY(-2px)';
      title.style.transition = 'transform 0.3s ease';
    }
    
    if (price) {
      price.style.transform = 'scale(1.05)';
      price.style.transition = 'transform 0.3s ease';
    }
    
    if (button) {
      button.style.transform = 'translateY(-2px)';
      button.style.transition = 'transform 0.3s ease';
    }
  }
  
  removeHoverEffects(card) {
    const title = card.querySelector('.item-title');
    const price = card.querySelector('.item-price');
    const button = card.querySelector('.item-buy-btn');
    
    if (title) {
      title.style.transform = '';
    }
    
    if (price) {
      price.style.transform = '';
    }
    
    if (button) {
      button.style.transform = '';
    }
  }
  
  setupScrollAnimations() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      this.itemCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
      });
    }
  }
  
  handlePurchase(button) {
    const product = button.getAttribute('data-product');
    const price = button.getAttribute('data-price');
    const card = button.closest('.item-card');
    
    if (!product || !price) {
      console.error('Missing product or price data');
      return;
    }
    
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      showNotification('Please sign in to make a purchase', 'error');
      return;
    }
    
    // Check user's coin balance
    const userCoins = user.coins || 0;
    const priceNumber = parseInt(price);
    
    if (userCoins < priceNumber) {
      showNotification(`Insufficient TS Coins. You need ${priceNumber - userCoins} more coins.`, 'error');
      return;
    }
    
    // Add loading state
    this.setLoadingState(card, true);
    
    // Add purchase animation
    this.animatePurchase(button);
    
    // Process purchase after animation
    setTimeout(() => {
      this.processPurchase(user, product, priceNumber, card);
    }, 800);
  }
  
  setLoadingState(card, loading) {
    if (loading) {
      card.classList.add('loading');
      const button = card.querySelector('.item-buy-btn');
      if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="btn-icon">⏳</span> Processing...';
      }
    } else {
      card.classList.remove('loading');
      const button = card.querySelector('.item-buy-btn');
      if (button) {
        button.disabled = false;
        button.innerHTML = '<span class="btn-icon">⚡</span> Buy Now';
      }
    }
  }
  
  animatePurchase(button) {
    button.style.transform = 'scale(0.95)';
    button.style.background = 'linear-gradient(135deg, #4CAF50, #2E8B57)';
    
    setTimeout(() => {
      button.style.transform = '';
      button.style.background = '';
    }, 300);
  }
  
  processPurchase(user, product, price, card) {
    // Update user's coin balance
    user.coins = (user.coins || 0) - price;
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update wallet display
    if (window.updateWalletDisplay) {
      updateWalletDisplay();
    }
    
    // Add success animation to card
    this.addSuccessAnimation(card);
    
    // Show success message with emoji
    showNotification(`🎉 Successfully purchased ${product}!`, 'success');
    
    // Remove loading state
    this.setLoadingState(card, false);
    
    // Here you would typically send this data to your backend
    console.log('Item purchase processed:', {
      user: user.email,
      product: product,
      price: price,
      remainingCoins: user.coins
    });
  }
  
  addSuccessAnimation(card) {
    card.style.transform = 'scale(1.02)';
    card.style.boxShadow = '0 0 30px rgba(76, 175, 80, 0.6)';
    card.style.borderColor = 'rgba(76, 175, 80, 0.8)';
    
    setTimeout(() => {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.borderColor = '';
    }, 1000);
  }
}

// Initialize item purchase handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.item-buy-btn')) {
    new ItemPurchaseHandler();
  }
});

// Popup Handler for Perks and Requirements
class PopupHandler {
  constructor() {
    this.init();
  }
  
  init() {
    // Handle Perks buttons
    document.querySelectorAll('.perks-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const rankName = btn.getAttribute('data-rank');
        const perksData = btn.getAttribute('data-perks');
        const perks = perksData ? JSON.parse(perksData) : [];
        this.showPerksPopup(rankName, perks);
      });
    });
    
    // Handle Requirements buttons
    document.querySelectorAll('.requirements-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const rankName = btn.getAttribute('data-rank');
        const requirementsData = btn.getAttribute('data-requirements');
        const requirements = requirementsData ? JSON.parse(requirementsData) : [];
        this.showRequirementsPopup(rankName, requirements);
      });
    });
  }
  
  showPerksPopup(rankName, perks) {
    // Create popup
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    
    const popup = document.createElement('div');
    popup.className = 'popup-content';
    
    popup.innerHTML = `
      <div class="popup-header">
        <h3>${rankName} Rank - Perks</h3>
        <button class="popup-close">&times;</button>
      </div>
      <div class="popup-body">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
          ${perks.map(perk => `
            <div style="padding: 12px; background: rgba(118, 199, 255, 0.1); border: 1px solid rgba(118, 199, 255, 0.3); border-radius: 12px; text-align: center; color: #76c7ff; font-weight: 600; font-size: 13px;">
              ${perk}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Close handlers
    const closeBtn = popup.querySelector('.popup-close');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  }
  
  showRequirementsPopup(rankName, requirements) {
    // Create popup
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    
    const popup = document.createElement('div');
    popup.className = 'popup-content';
    
    popup.innerHTML = `
      <div class="popup-header">
        <h3>${rankName} Rank - Requirements</h3>
        <button class="popup-close">&times;</button>
      </div>
      <div class="popup-body">
        <div style="display: flex; flex-direction: column; gap: 15px;">
          ${requirements.map((req, index) => `
            <div style="padding: 15px; background: rgba(118, 199, 255, 0.08); border-left: 3px solid #76c7ff; border-radius: 8px; color: var(--text); line-height: 1.6;">
              <strong style="color: #76c7ff;">${index + 1}.</strong> ${req}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Close handlers
    const closeBtn = popup.querySelector('.popup-close');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  }
}

// Initialize popup handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new PopupHandler();
});