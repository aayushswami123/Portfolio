// Wait for DOM to be fully loaded
document.title = "Aayush Swami - Portfolio";

document.addEventListener("DOMContentLoaded", () => {
  // Debounce function to improve performance for scroll and resize events
  function debounce(func, delay) {
    let timeoutId
    return function () {
      const args = arguments
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
  }

  // Mobile menu toggle with improved accessibility
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileMenu = document.querySelector(".mobile-menu")
  const mobileMenuClose = document.querySelector(".mobile-menu-close")
  let isMenuOpen = false

  if (mobileMenuBtn && mobileMenu) {
    // Set initial ARIA attributes
    mobileMenuBtn.setAttribute("aria-expanded", "false")
    mobileMenuBtn.setAttribute("aria-controls", "mobile-menu")
    mobileMenu.id = "mobile-menu"

    mobileMenuBtn.addEventListener("click", () => {
      isMenuOpen = true
      mobileMenu.classList.add("active")
      mobileMenuBtn.setAttribute("aria-expanded", "true")
      document.body.style.overflow = "hidden" // Prevent body scrolling
    })

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", () => {
        isMenuOpen = false
        mobileMenu.classList.remove("active")
        mobileMenuBtn.setAttribute("aria-expanded", "false")
        document.body.style.overflow = "" // Restore body scrolling
      })
    }

    // Close menu when clicking on mobile menu links
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        isMenuOpen = false
        mobileMenu.classList.remove("active")
        mobileMenuBtn.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        isMenuOpen = false
        mobileMenu.classList.remove("active")
        mobileMenuBtn.setAttribute("aria-expanded", "false")
        document.body.style.overflow = ""
      }
    })
  }

  // Smooth scrolling with performance optimization
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href")

      // Check if the target element exists
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        e.preventDefault()

        // Use requestAnimationFrame for smoother performance
        const scrollToElement = () => {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }

        requestAnimationFrame(scrollToElement)

        // Close mobile menu if open
        if (isMenuOpen) {
          isMenuOpen = false
          mobileMenu.classList.remove("active")
          mobileMenuBtn.setAttribute("aria-expanded", "false")
          document.body.style.overflow = ""
        }
      }
    })
  })

  // Scroll to top button with debouncing
  const scrollToTopBtn = document.querySelector(".scroll-to-top")

  if (scrollToTopBtn) {
    // Toggle button visibility with debouncing
    const handleScroll = debounce(() => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add("active")
        scrollToTopBtn.setAttribute("aria-hidden", "false")
      } else {
        scrollToTopBtn.classList.remove("active")
        scrollToTopBtn.setAttribute("aria-hidden", "true")
      }
    }, 100)

    window.addEventListener("scroll", handleScroll)

    // Initial check
    handleScroll()

    scrollToTopBtn.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Header scroll effect
  const header = document.querySelector("header")

  if (header) {
    const handleHeaderScroll = debounce(() => {
      if (window.pageYOffset > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    }, 100)

    window.addEventListener("scroll", handleHeaderScroll)

    // Initial check
    handleHeaderScroll()
  }

  // Animation on scroll with Intersection Observer
  function setupAnimations() {
    // Elements to animate
    const elements = document.querySelectorAll(
      ".skill-card, .project-card, .timeline-item, .section-title, .about-image, .about-text p, .about-text .btn, .contact-info, .contact-method, .contact-form, .form-group, .social-icon, .footer-content",
    )

    // Check if IntersectionObserver is supported
    if ("IntersectionObserver" in window) {
      const animationObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add animation classes when element is visible
              entry.target.classList.add("animated")

              // Add specific animation classes based on element type
              if (entry.target.classList.contains("timeline-item") && entry.target.classList.contains("right")) {
                entry.target.style.animation = "fadeInSide 0.6s forwards"
              } else if (entry.target.classList.contains("timeline-item")) {
                entry.target.style.animation = "fadeInSide 0.6s forwards"
              } else {
                entry.target.style.animation = "fadeInUp 0.6s forwards"
              }

              // Unobserve after animation is triggered
              animationObserver.unobserve(entry.target)
            }
          })
        },
        {
          root: null,
          threshold: 0.1,
          rootMargin: "0px 0px -100px 0px",
        },
      )

      elements.forEach((element) => {
        animationObserver.observe(element)
      })
    }
  }

  // Initialize animations
  setupAnimations()

  // Contact form submission with validation and feedback
  const contactForm = document.getElementById("contactForm")
  const responseMessage = document.getElementById("responseMessage")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault() // Prevent default form submission

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
      submitBtn.disabled = true

      // Capture form data
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      }

      // Send data to the backend using fetch
      fetch("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok")
          }
          return response.json()
        })
        .then((data) => {
          // Display response message
          if (responseMessage) {
            responseMessage.textContent = data.message
            responseMessage.className = data.success ? "success-message" : "error-message"
            responseMessage.style.display = "block"

            // Hide message after 5 seconds
            setTimeout(() => {
              responseMessage.style.display = "none"
            }, 5000)
          }

          if (data.success) {
            // Reset form on success
            contactForm.reset()
            // Show success popup
            showPopup(data.message, "success")
          } else {
            // Show error popup
            showPopup(data.message || "Something went wrong", "error")
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error)
          showPopup("An error occurred. Please try again.", "error")

          // Display error in the form
          if (responseMessage) {
            responseMessage.textContent = "An error occurred. Please try again."
            responseMessage.className = "error-message"
            responseMessage.style.display = "block"
          }
        })
        .finally(() => {
          // Restore button state
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false
        })
    })
  }

  // Function to show a popup notification
  function showPopup(message, type) {
    // Remove any existing popups
    const existingPopup = document.querySelector(".popup")
    if (existingPopup) {
      existingPopup.remove()
    }

    const popup = document.createElement("div")
    popup.className = `popup ${type}`
    popup.textContent = message

    document.body.appendChild(popup)

    // Automatically close the popup after 3 seconds
    setTimeout(() => {
      popup.style.opacity = "0"
      setTimeout(() => {
        popup.remove()
      }, 300)
    }, 3000)
  }

  // Handle window resize events (debounced)
  const handleResize = debounce(() => {
    // Adjust mobile menu state if window is resized beyond mobile breakpoint
    if (window.innerWidth >= 768 && isMenuOpen) {
      isMenuOpen = false
      mobileMenu.classList.remove("active")
      mobileMenuBtn.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    }
  }, 200)

  window.addEventListener("resize", handleResize)

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReducedMotion) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.classList.add("reduced-motion")
  }
})
// Particle Background Animation
document.addEventListener("DOMContentLoaded", () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReducedMotion) {
    return // Don't create particles if user prefers reduced motion
  }

  // Create particle container
  const particlesContainer = document.createElement("div")
  particlesContainer.className = "particles-background"
  document.body.prepend(particlesContainer)

  // Particle settings
  const particleCount = 100 // Total number of particles
  const directions = ["down", "up", "left", "right"] // Possible movement directions

  // Create initial particles
  for (let i = 0; i < particleCount; i++) {
    createParticle(particlesContainer)
  }

  // Function to create a single particle
  function createParticle(container) {
    const particle = document.createElement("div")
    particle.className = "particle"

    // Random particle size
    const sizeClasses = ["particle-tiny", "particle-small", "particle-medium", "particle-large"]
    const sizeClass = sizeClasses[Math.floor(Math.random() * sizeClasses.length)]
    particle.classList.add(sizeClass)

    // Random position based on direction
    const direction = directions[Math.floor(Math.random() * directions.length)]

    // Random starting position
    let xPos, yPos

    switch (direction) {
      case "down":
        xPos = Math.random() * 100
        yPos = -10
        break
      case "up":
        xPos = Math.random() * 100
        yPos = 110
        break
      case "right":
        xPos = -10
        yPos = Math.random() * 100
        break
      case "left":
        xPos = 110
        yPos = Math.random() * 100
        break
    }

    // Set particle position
    particle.style.left = `${xPos}%`
    particle.style.top = `${yPos}%`

    // Random drift (perpendicular movement)
    const drift = Math.random() * 100 - 50
    particle.style.setProperty("--drift", `${drift}px`)

    // Random duration between 10s and 30s
    const duration = Math.random() * 20 + 10

    // Set animation based on direction
    switch (direction) {
      case "down":
        particle.style.animation = `float-down ${duration}s linear infinite`
        break
      case "up":
        particle.style.animation = `float-up ${duration}s linear infinite`
        break
      case "right":
        particle.style.animation = `float-right ${duration}s linear infinite`
        break
      case "left":
        particle.style.animation = `float-left ${duration}s linear infinite`
        break
    }

    // Add particle to container
    container.appendChild(particle)

    // Remove and recreate particle after animation completes
    setTimeout(() => {
      if (particle.parentNode === container) {
        container.removeChild(particle)
        createParticle(container)
      }
    }, duration * 1000)
  }
})
// Animation System - Detect elements and apply animations
document.addEventListener("DOMContentLoaded", () => {
  // Function to check if IntersectionObserver is supported
  if ("IntersectionObserver" in window) {
    // Create animation observer
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If element is in viewport
          if (entry.isIntersecting) {
            // Get animation type from data attribute
            const animationType = entry.target.dataset.animation || "fade-in"

            // Add animation class
            entry.target.classList.add(animationType)

            // Unobserve after animation is triggered
            animationObserver.unobserve(entry.target)
          }
        })
      },
      {
        root: null,
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Adjust based on when you want animations to trigger
      },
    )

    // Select all elements to animate
    const elementsToAnimate = document.querySelectorAll(".animate-element")

    // Observe each element
    elementsToAnimate.forEach((element) => {
      animationObserver.observe(element)
    })

    // Special handling for timeline items
    const timelineItems = document.querySelectorAll(".timeline-item")
    timelineItems.forEach((item, index) => {
      // Set animation type based on position
      if (item.classList.contains("left")) {
        item.dataset.animation = "slide-in-left"
      } else {
        item.dataset.animation = "slide-in-right"
      }

      // Add staggered delay
      item.style.animationDelay = `${0.2 * index}s`

      // Add to animation observer
      animationObserver.observe(item)
    })

    // Special handling for skill cards
    const skillCards = document.querySelectorAll(".skill-card")
    skillCards.forEach((card, index) => {
      card.dataset.animation = "fall-in"
      animationObserver.observe(card)
    })

    // Special handling for project cards
    const projectCards = document.querySelectorAll(".project-card")
    projectCards.forEach((card, index) => {
      // Alternate between left and right animations
      if (index % 2 === 0) {
        card.dataset.animation = "slide-in-left"
      } else {
        card.dataset.animation = "slide-in-right"
      }

      animationObserver.observe(card)
    })

    // Hero section elements
    const heroElements = document.querySelectorAll(".hero-content > *")
    heroElements.forEach((element, index) => {
      element.classList.add("animate-element")
      element.dataset.animation = "fall-in"
      element.style.animationDelay = `${0.2 * index}s`
      animationObserver.observe(element)
    })

    // About section
    const aboutImage = document.querySelector(".about-image")
    if (aboutImage) {
      aboutImage.classList.add("animate-element")
      aboutImage.dataset.animation = "slide-in-left"
      animationObserver.observe(aboutImage)
    }

    const aboutTextElements = document.querySelectorAll(".about-text > *")
    aboutTextElements.forEach((element, index) => {
      element.classList.add("animate-element")
      element.dataset.animation = "slide-in-right"
      element.style.animationDelay = `${0.1 * index}s`
      animationObserver.observe(element)
    })

    // Contact section
    const contactInfo = document.querySelector(".contact-info")
    if (contactInfo) {
      contactInfo.classList.add("animate-element")
      contactInfo.dataset.animation = "slide-in-left"
      animationObserver.observe(contactInfo)
    }

    const contactForm = document.querySelector(".contact-form")
    if (contactForm) {
      contactForm.classList.add("animate-element")
      contactForm.dataset.animation = "slide-in-right"
      animationObserver.observe(contactForm)
    }

    // Section titles
    const sectionTitles = document.querySelectorAll(".section-title, .timeline-title")
    sectionTitles.forEach((title) => {
      title.classList.add("animate-element")
      title.dataset.animation = "fall-in"
      animationObserver.observe(title)
    })
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll(".animate-element").forEach((element) => {
      element.style.opacity = "1"
      element.style.transform = "none"
    })
  }

  // Add typing effect to hero heading
  const heroHeading = document.querySelector(".hero h1")
  if (heroHeading) {
    // Create wrapper for typing effect
    const headingText = heroHeading.innerHTML
    heroHeading.innerHTML = `<span class="typing-effect">${headingText}</span>`
  }

  // Add random falling animation to particles (if you have a particle background)
  createFallingParticles()
})

// Function to create falling particles in the background
function createFallingParticles() {
  const particlesContainer = document.createElement("div")
  particlesContainer.className = "particles-container"
  particlesContainer.style.position = "fixed"
  particlesContainer.style.top = "0"
  particlesContainer.style.left = "0"
  particlesContainer.style.width = "100%"
  particlesContainer.style.height = "100%"
  particlesContainer.style.overflow = "hidden"
  particlesContainer.style.pointerEvents = "none"
  particlesContainer.style.zIndex = "-1"

  document.body.prepend(particlesContainer)

  // Create particles
  for (let i = 0; i < 50; i++) {
    createParticle(particlesContainer)
  }
}

function createParticle(container) {
  const particle = document.createElement("div")

  // Random size between 3px and 8px
  const size = Math.random() * 5 + 3

  // Random position
  const xPos = Math.random() * 100
  const yPos = Math.random() * -100 // Start above the viewport

  // Random fall duration between 10s and 20s
  const fallDuration = Math.random() * 10 + 10

  // Random horizontal drift
  const drift = Math.random() * 50 - 25

  // Style the particle
  particle.style.position = "absolute"
  particle.style.width = `${size}px`
  particle.style.height = `${size}px`
  particle.style.borderRadius = "50%"
  particle.style.backgroundColor = "rgba(99, 102, 241, 0.2)"
  particle.style.top = `${yPos}%`
  particle.style.left = `${xPos}%`
  particle.style.animation = `fall ${fallDuration}s linear infinite`

  // Add keyframes for this specific particle
  const styleSheet = document.styleSheets[0]
  const keyframes = `
    @keyframes fall {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 0.7;
      }
      90% {
        opacity: 0.7;
      }
      100% {
        transform: translateY(${window.innerHeight * 1.5}px) translateX(${drift}px);
        opacity: 0;
      }
    }
  `

  try {
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
  } catch (e) {
    // Fallback if inserting rules fails
    const style = document.createElement("style")
    style.textContent = keyframes
    document.head.appendChild(style)
  }

  container.appendChild(particle)

  // Remove and recreate particle after animation completes
  setTimeout(() => {
    particle.remove()
    createParticle(container)
  }, fallDuration * 1000)
}
