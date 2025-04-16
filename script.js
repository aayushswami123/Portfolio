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
