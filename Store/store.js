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
    this.buyButtons = document.querySelectorAll('.rank-buy-btn');
    this.init();
  }
  
  init() {
    this.buyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handlePurchase(button);
      });
    });
  }
  
  handlePurchase(button) {
    const product = button.getAttribute('data-product');
    const price = button.getAttribute('data-price');
    const customTagInput = document.querySelector('.custom-tag-input');
    const customTag = customTagInput ? customTagInput.value : null;
    
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
    
    // Process purchase
    this.processPurchase(user, product, priceNumber);
  }
  
  processPurchase(user, product, price) {
    // Update user's coin balance
    user.coins = (user.coins || 0) - price;
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update wallet display
    if (window.updateWalletDisplay) {
      updateWalletDisplay();
    }
    
    // Show success message
    showNotification(`Successfully purchased ${product}!`, 'success');
    
    // Here you would typically send this data to your backend
    console.log('Purchase processed:', {
      user: user.email,
      product: product,
      price: price,
      remainingCoins: user.coins
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
  
  // Initialize rank purchase handler
  if (document.querySelector('.rank-buy-btn')) {
    new RankPurchaseHandler();
  }
  
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
