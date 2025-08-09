// Carousel functionality
let currentSlideIndex = 0
const slides = document.querySelectorAll(".carousel-slide")
const dots = document.querySelectorAll(".dot")
let autoSlideInterval

// Initialize carousel
function initCarousel() {
  if (slides.length > 0) {
    showSlide(0)
    startAutoSlide()
  }
}

// Show specific slide
function showSlide(index) {
  // Hide all slides
  slides.forEach((slide) => slide.classList.remove("active"))
  dots.forEach((dot) => dot.classList.remove("active"))

  // Show current slide
  if (slides[index]) {
    slides[index].classList.add("active")
  }
  if (dots[index]) {
    dots[index].classList.add("active")
  }

  currentSlideIndex = index
}

// Change slide (next/previous)
function changeSlide(direction) {
  let newIndex = currentSlideIndex + direction

  if (newIndex >= slides.length) {
    newIndex = 0
  } else if (newIndex < 0) {
    newIndex = slides.length - 1
  }

  showSlide(newIndex)
  resetAutoSlide()
}

// Go to specific slide
function currentSlide(index) {
  showSlide(index - 1)
  resetAutoSlide()
}

// Auto slide functionality
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    changeSlide(1)
  }, 5000) // 5 seconds
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval)
  startAutoSlide()
}

// Video player functionality
function changeVideo(videoId, title, description) {
  const iframe = document.getElementById("mainVideo")
  const videoTitle = document.getElementById("videoTitle")
  const videoDescription = document.getElementById("videoDescription")
  const thumbnails = document.querySelectorAll(".thumbnail")

  if (iframe && videoTitle && videoDescription) {
    // Update video
    iframe.src = `https://www.youtube.com/embed/${videoId}`
    videoTitle.textContent = title
    videoDescription.textContent = description

    // Update active thumbnail
    thumbnails.forEach((thumb) => thumb.classList.remove("active"))
    if (event && event.currentTarget) {
      event.currentTarget.classList.add("active")
    }
  }
}

// Gallery filter functionality
function filterGallery(category) {
  const filterBtns = document.querySelectorAll(".filter-btn")
  const galleryItems = document.querySelectorAll(".gallery-item")

  // Update active filter button
  filterBtns.forEach((btn) => btn.classList.remove("active"))
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active")
  }

  // Filter gallery items
  galleryItems.forEach((item) => {
    if (category === "all" || item.dataset.category === category) {
      item.style.display = "block"
      setTimeout(() => {
        item.style.opacity = "1"
        item.style.transform = "translateY(0)"
      }, 100)
    } else {
      item.style.opacity = "0"
      item.style.transform = "translateY(20px)"
      setTimeout(() => {
        item.style.display = "none"
      }, 300)
    }
  })
}

// Scroll to contact section
function scrollToContact() {
  const contactSection = document.getElementById("contact")
  if (contactSection) {
    contactSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Scroll to quote section
function scrollToQuote() {
  const quoteSection = document.getElementById("quote")
  if (quoteSection) {
    quoteSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Quote form functionality
let currentStep = 1

function nextStep() {
  console.log("Attempting to go to next step. Current step:", currentStep)
  if (validateStep(currentStep)) {
    currentStep++
    showStep(currentStep)
    updateProgress()
    console.log("Successfully moved to step:", currentStep)
  } else {
    console.log("Validation failed for step:", currentStep)
  }
}

function prevStep() {
  console.log("Attempting to go to previous step. Current step:", currentStep)
  currentStep--
  showStep(currentStep)
  updateProgress()
  console.log("Successfully moved to step:", currentStep)
}

function showStep(step) {
  // Hide all steps
  document.querySelectorAll(".form-step").forEach((stepEl) => {
    stepEl.classList.remove("active")
  })

  // Show current step
  const targetStep = document.querySelector(`[data-step="${step}"]`)
  if (targetStep) {
    targetStep.classList.add("active")
  }

  // Update step header progress dots
  document.querySelectorAll(".step-header-progress-dot").forEach((dot) => {
    dot.classList.remove("active")
  })
  const activeHeaderDot = document.querySelector(`.step-header-progress-dot[data-dot-step="${step}"]`)
  if (activeHeaderDot) {
    activeHeaderDot.classList.add("active")
  }
}

function updateProgress() {
  document.querySelectorAll(".progress-step").forEach((step) => {
    step.classList.remove("active")
  })

  const activeProgressStep = document.querySelector(`.progress-step[data-step="${currentStep}"]`)
  if (activeProgressStep) {
    activeProgressStep.classList.add("active")
  }

  // Update progress line animation
  const progressLine = document.querySelector(".progress-line")
  if (progressLine) {
    const progressAfter = progressLine.querySelector("::after") || progressLine
    if (currentStep === 2) {
      progressLine.style.setProperty("--progress-width", "100%")
    } else {
      progressLine.style.setProperty("--progress-width", "0%")
    }
  }
}

function validateStep(step) {
  const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`)
  if (!currentStepEl) {
    console.log("validateStep: Current step element not found.")
    return false
  }

  const requiredFields = currentStepEl.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (field.type === "radio") {
      const radioGroup = currentStepEl.querySelectorAll(`[name="${field.name}"]`)
      const isChecked = Array.from(radioGroup).some((radio) => radio.checked)
      if (!isChecked) {
        isValid = false
        // Highlight radio group container
        const radioContainer = field.closest(".communication-options")
        if (radioContainer) {
          radioContainer.style.borderColor = "#dc3545"
        }
        console.log(`validateStep: Radio group "${field.name}" not checked.`)
      } else {
        const radioContainer = field.closest(".communication-options")
        if (radioContainer) {
          radioContainer.style.borderColor = "transparent"
        }
      }
    } else if (!field.value.trim()) {
      field.style.borderColor = "#dc3545"
      field.style.boxShadow = "0 0 0 3px rgba(220, 53, 69, 0.1)"
      isValid = false
      console.log(`validateStep: Required field "${field.id || field.name}" is empty.`)
    } else {
      field.style.borderColor = "#e9ecef"
      field.style.boxShadow = "none"
    }
  })

  if (!isValid) {
    // Create and show error message
    let errorMsg = currentStepEl.querySelector(".error-message")
    if (!errorMsg) {
      errorMsg = document.createElement("div")
      errorMsg.className = "error-message"
      errorMsg.style.cssText = `
                color: #dc3545;
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                padding: 10px 15px;
                border-radius: 8px;
                margin-top: 15px;
                font-size: 0.9rem;
                text-align: center;
            `
      errorMsg.textContent = "Please fill in all required fields before continuing."
      currentStepEl.appendChild(errorMsg)
    }
    console.log("validateStep: Validation failed, showing error message.")

    // Remove error message after 5 seconds
    setTimeout(() => {
      if (errorMsg && errorMsg.parentNode) {
        errorMsg.parentNode.removeChild(errorMsg)
      }
    }, 5000)
  } else {
    // Remove any existing error messages
    const errorMsg = currentStepEl.querySelector(".error-message")
    if (errorMsg) {
      errorMsg.parentNode.removeChild(errorMsg)
    }
    console.log("validateStep: Validation passed.")
  }

  return isValid
}

// Newsletter subscription
function handleNewsletterSubmission() {
  const newsletterForm = document.getElementById("newsletterForm")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = this.querySelector('input[type="email"]').value

      // Show loading state
      const submitBtn = this.querySelector("button")
      const originalText = submitBtn.textContent
      submitBtn.textContent = "Subscribing..."
      submitBtn.disabled = true

      // Simulate subscription (you can replace this with actual newsletter service)
      setTimeout(() => {
        // Show success message
        showNotification("Thank you for subscribing to our newsletter!", "success")
        this.reset()
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }, 1000)
    })
  }
}

// Mobile menu toggle
function toggleMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")

      // Animate hamburger bars
      const bars = hamburger.querySelectorAll(".bar")
      if (hamburger.classList.contains("active")) {
        bars[0].style.transform = "rotate(-45deg) translate(-5px, 6px)"
        bars[1].style.opacity = "0"
        bars[2].style.transform = "rotate(45deg) translate(-5px, -6px)"
      } else {
        bars[0].style.transform = "none"
        bars[1].style.opacity = "1"
        bars[2].style.transform = "none"
      }
    })
  }
}

// Preloader
function hidePreloader() {
  const preloader = document.getElementById("preloader")
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = "0"
      setTimeout(() => {
        preloader.style.display = "none"
      }, 500)
    }, 1000)
  }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll(".nav-menu a, .footer-links a")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href && href.startsWith("#")) {
        e.preventDefault()
        const targetSection = document.querySelector(href)

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })

          // Close mobile menu if open
          const navMenu = document.querySelector(".nav-menu")
          const hamburger = document.querySelector(".hamburger")
          if (navMenu && hamburger) {
            navMenu.classList.remove("active")
            hamburger.classList.remove("active")

            // Reset hamburger bars
            const bars = hamburger.querySelectorAll(".bar")
            bars[0].style.transform = "none"
            bars[1].style.opacity = "1"
            bars[2].style.transform = "none"
          }
        }
      }
    })
  })
}

// Intersection Observer for animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        entry.target.classList.add("animated")
      }
    })
  }, observerOptions)

  // Observe gallery items
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(20px)"
    item.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(item)
  })

  // Observe service cards
  document.querySelectorAll(".service-card").forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => {
    notification.remove()
  })

  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "linear-gradient(135deg, #28a745, #20c997)"
      break
    case "error":
      notification.style.background = "linear-gradient(135deg, #dc3545, #e74c3c)"
      break
    case "warning":
      notification.style.background = "linear-gradient(135deg, #ffc107, #fd7e14)"
      break
    default:
      notification.style.background = "linear-gradient(135deg, #D4AF37, #F4E4BC)"
      notification.style.color = "#000"
  }

  notification.textContent = message
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 5000)
}

// Form submission handlers
function initFormHandlers() {
  // Quote form submission
  const quoteForm = document.getElementById("quote-form")
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault()

      if (validateStep(2)) {
        // Show loading state
        const submitBtn = quoteForm.querySelector(".btn-submit")
        const originalText = submitBtn.innerHTML
        submitBtn.innerHTML =
          '<span style="display: inline-block; animation: spin 1s linear infinite;">⟳</span> Sending...'
        submitBtn.disabled = true

        // Submit form
        fetch("send_quote.php", {
          method: "POST",
          body: new FormData(quoteForm),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              showNotification(
                "Thank you! Your quote request has been sent successfully. We'll get back to you soon.",
                "success",
              )
              quoteForm.reset()
              currentStep = 1
              showStep(1)
              updateProgress()
            } else {
              showNotification("Sorry, there was an error sending your request. Please try again.", "error")
            }
          })
          .catch((error) => {
            console.error("Error:", error)
            showNotification("Sorry, there was an error sending your request. Please try again.", "error")
          })
          .finally(() => {
            submitBtn.innerHTML = originalText
            submitBtn.disabled = false
          })
      }
    })
  }

  // Contact form submission
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show loading state
      const submitBtn = contactForm.querySelector(".btn-send")
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML =
        '<span class="send-icon" style="display: inline-block; animation: spin 1s linear infinite;">⟳</span> Sending...'
      submitBtn.disabled = true

      // Submit form
      fetch("send_contact.php", {
        method: "POST",
        body: new FormData(contactForm),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showNotification(
              "Thank you! Your message has been sent successfully. We'll get back to you soon.",
              "success",
            )
            contactForm.reset()
          } else {
            showNotification("Sorry, there was an error sending your message. Please try again.", "error")
          }
        })
        .catch((error) => {
          console.error("Error:", error)
          showNotification("Sorry, there was an error sending your message. Please try again.", "error")
        })
        .finally(() => {
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
        })
    })
  }
}

// Carousel pause/resume on hover
function initCarouselHover() {
  const carousel = document.querySelector(".hero-carousel")
  if (carousel) {
    carousel.addEventListener("mouseenter", () => {
      clearInterval(autoSlideInterval)
    })

    carousel.addEventListener("mouseleave", () => {
      startAutoSlide()
    })
  }
}

// Keyboard navigation for carousel
function initKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      changeSlide(-1)
    } else if (e.key === "ArrowRight") {
      changeSlide(1)
    }
  })
}

// Touch/swipe support for mobile carousel
function initTouchSupport() {
  let touchStartX = 0
  let touchEndX = 0

  const carousel = document.querySelector(".hero-carousel")
  if (carousel) {
    carousel.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX
    })

    carousel.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    })
  }

  function handleSwipe() {
    const swipeThreshold = 50
    const diff = touchStartX - touchEndX

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        changeSlide(1)
      } else {
        // Swipe right - previous slide
        changeSlide(-1)
      }
    }
  }
}

// Add CSS for spin animation
function addSpinAnimation() {
  const style = document.createElement("style")
  style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `
  document.head.appendChild(style)
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add spin animation CSS
  addSpinAnimation()

  // Hide preloader
  hidePreloader()

  // Initialize carousel
  initCarousel()

  // Initialize smooth scrolling
  initSmoothScrolling()

  // Initialize scroll animations
  initScrollAnimations()

  // Initialize form handlers
  initFormHandlers()

  // Initialize newsletter subscription
  handleNewsletterSubmission()

  // Initialize mobile menu
  toggleMobileMenu()

  // Initialize carousel hover effects
  initCarouselHover()

  // Initialize keyboard navigation
  initKeyboardNavigation()

  // Initialize touch support
  initTouchSupport()
})
