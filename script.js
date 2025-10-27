function initPopup() {
    const openPopupBtn = document.getElementById('openPopupBtn');
    const popupForm = document.getElementById('popupForm');
    const closeBtn = document.querySelector('.close-btn');

    if (openPopupBtn && popupForm) {
        openPopupBtn.addEventListener('click', () => {
            popupForm.style.display = 'flex';
        });

        closeBtn.addEventListener('click', () => {
            popupForm.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === popupForm) {
                popupForm.style.display = 'none';
            }
        });

        document.getElementById('popupSubscribeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Please wait...';
            
            setTimeout(() => {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                popupForm.style.display = 'none';
                this.reset();
            }, 2000);
        });
    }
}

function initThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    let isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        document.body.classList.add('dark-theme');
        updateThemeButton(true);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            
            if (isDarkMode) {
                document.body.classList.add('dark-theme');
                updateThemeButton(true);
                showNotification('Dark mode activated', 'info');
            } else {
                document.body.classList.remove('dark-theme');
                updateThemeButton(false);
                showNotification('Light mode activated', 'info');
            }
            
            localStorage.setItem('darkMode', isDarkMode);
            playClickSound();
        });
    }
}

function updateThemeButton(isDark) {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (!themeToggleBtn) return;

    if (isDark) {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun me-2"></i>Light Mode';
        themeToggleBtn.style.background = 'linear-gradient(135deg, #eeff00ff 0%, #ffe600ff 100%)';
        themeToggleBtn.style.color = '#333';
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon me-2"></i>Dark Mode';
        themeToggleBtn.style.background = 'linear-gradient(135deg, var(--primary-red) 0%, var(--dark-red) 100%)';
        themeToggleBtn.style.color = 'white';
    }
}

function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    fadeInOnScroll();
    window.addEventListener('scroll', fadeInOnScroll);
}

function initSoundEffects() {
    document.querySelectorAll('.btn-custom, .floating-btn, .aca-team-card, .notification-bell-btn').forEach(button => {
        button.addEventListener('click', () => {
            playClickSound();
        });
    });
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            playClickSound();
        });
    }
}

function initInteractiveFAQ() {
    const faqSection = document.querySelector('.aca-faq-section');
    if (!faqSection) return;

    const quizHTML = `
        <div class="quiz-container mt-5">
            <div class="card card-custom">
                <div class="card-body card-body-custom">
                    <h4 class="card-title-custom">American Culture Quiz</h4>
                    <p class="card-text-custom">Test your knowledge about American culture with this interactive quiz!</p>
                    <div id="quizQuestions"></div>
                    <button id="startQuiz" class="btn btn-custom mt-3">
                        <i class="fas fa-play me-2"></i>Start Quiz
                    </button>
                    <div id="quizResult" class="mt-3"></div>
                </div>
            </div>
        </div>
    `;

    const faqAccordion = document.getElementById('faqAccordion');
    if (faqAccordion) {
        faqAccordion.insertAdjacentHTML('afterend', quizHTML);
    }

    const quizData = [
        {
            question: "Which music genre originated in the United States?",
            options: ["Jazz", "Flamenco", "Reggae", "K-Pop"],
            correct: 0,
            fact: "Jazz originated in New Orleans in the late 19th century and is considered America's classical music."
        },
        {
            question: "What is the traditional American Thanksgiving dish?",
            options: ["Pizza", "Sushi", "Turkey", "Tacos"],
            correct: 2,
            fact: "Turkey has been the centerpiece of Thanksgiving meals since the 19th century, with over 46 million turkeys consumed each Thanksgiving."
        },
        {
            question: "Which sport is known as 'America's Pastime'?",
            options: ["Basketball", "Baseball", "Soccer", "Hockey"],
            correct: 1,
            fact: "Baseball earned the nickname 'America's Pastime' in the 1850s and was the first professional team sport in the US."
        },
        {
            question: "Which landmark is a symbol of American freedom?",
            options: ["Golden Gate Bridge", "Statue of Liberty", "Mount Rushmore", "Grand Canyon"],
            correct: 1,
            fact: "The Statue of Liberty was a gift from France in 1886 and has welcomed millions of immigrants to America."
        },
        {
            question: "What American holiday features fireworks displays?",
            options: ["Thanksgiving", "Independence Day", "Labor Day", "Memorial Day"],
            correct: 1,
            fact: "Independence Day (July 4th) celebrates the adoption of the Declaration of Independence in 1776 with fireworks across the nation."
        }
    ];

    document.getElementById('startQuiz').addEventListener('click', startQuiz);

    function startQuiz() {
        const quizQuestions = document.getElementById('quizQuestions');
        const startBtn = document.getElementById('startQuiz');
        const quizResult = document.getElementById('quizResult');
        
        startBtn.style.display = 'none';
        quizResult.innerHTML = '';
        
        let score = 0;
        let currentQuestion = 0;
        let userAnswers = [];
        
        function showQuestion() {
            if (currentQuestion >= quizData.length) {
                showResults();
                return;
            }
            
            const q = quizData[currentQuestion];
            quizQuestions.innerHTML = `
                <div class="question-container">
                    <h5>Question ${currentQuestion + 1}/${quizData.length}</h5>
                    <p class="fw-semibold">${q.question}</p>
                    <div class="options-container">
                        ${q.options.map((option, index) => `
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="radio" name="quizAnswer" id="option${currentQuestion}_${index}" value="${index}">
                                <label class="form-check-label" for="option${currentQuestion}_${index}">
                                    ${option}
                                </label>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-custom mt-3" id="quizNextBtn">
                        ${currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                </div>
            `;

            document.getElementById('quizNextBtn').addEventListener('click', checkAnswer);
        }
        
        function checkAnswer() {
            const selected = document.querySelector('input[name="quizAnswer"]:checked');
            if (!selected) {
                showNotification('Please select an answer!', 'warning');
                return;
            }
            
            const selectedAnswer = parseInt(selected.value);
            const isCorrect = selectedAnswer === quizData[currentQuestion].correct;
            
            userAnswers.push({
                question: quizData[currentQuestion].question,
                userAnswer: quizData[currentQuestion].options[selectedAnswer],
                correctAnswer: quizData[currentQuestion].options[quizData[currentQuestion].correct],
                isCorrect: isCorrect,
                fact: quizData[currentQuestion].fact
            });
            
            if (isCorrect) {
                score++;
                playSuccessSound();
                showNotification('Correct answer! 🎉', 'success', 2000);
            } else {
                playErrorSound();
                showNotification('Wrong answer, try again! 💡', 'error', 2000);
            }
            
            currentQuestion++;
            showQuestion();
        }
        
        function showResults() {
            const percentage = Math.round((score / quizData.length) * 100);
            let message, alertClass;
            
            switch(true) {
                case percentage >= 80:
                    message = "🎉 Excellent! You're an American culture expert!";
                    alertClass = "alert-success";
                    break;
                case percentage >= 60:
                    message = "👍 Great job! You know American culture well!";
                    alertClass = "alert-info";
                    break;
                case percentage >= 40:
                    message = "💡 Good effort! Keep learning about American culture!";
                    alertClass = "alert-warning";
                    break;
                default:
                    message = "📚 Keep exploring! American culture has so much to discover!";
                    alertClass = "alert-danger";
            }
            
            quizQuestions.innerHTML = '';
            quizResult.innerHTML = `
                <div class="alert ${alertClass}">
                    <h5>Quiz Complete!</h5>
                    <p>You scored <strong>${score} out of ${quizData.length}</strong> (${percentage}%)</p>
                    <p class="mb-0">${message}</p>
                </div>
                
                <div class="detailed-results mt-4">
                    <h6>Detailed Results:</h6>
                    ${userAnswers.map((answer, index) => `
                        <div class="card mb-2 ${answer.isCorrect ? 'border-success' : 'border-danger'}">
                            <div class="card-body py-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-semibold">Q${index + 1}: ${answer.question}</span>
                                    <span class="badge ${answer.isCorrect ? 'bg-success' : 'bg-danger'}">
                                        ${answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                    </span>
                                </div>
                                ${!answer.isCorrect ? `
                                    <div class="mt-1">
                                        <small class="text-muted">Your answer: ${answer.userAnswer}</small><br>
                                        <small class="text-success">Correct answer: ${answer.correctAnswer}</small>
                                    </div>
                                ` : ''}
                                <div class="mt-1">
                                    <small class="text-info"><i>💡 ${answer.fact}</i></small>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="text-center mt-4">
                    <button class="btn btn-custom me-2" id="tryAgainBtn">
                        <i class="fas fa-redo me-2"></i>Try Again
                    </button>
                    <button class="btn btn-outline-custom" id="shareResultsBtn">
                        <i class="fas fa-share me-2"></i>Share Results
                    </button>
                </div>
            `;
            
            document.getElementById('tryAgainBtn').addEventListener('click', function() {
                startBtn.style.display = 'block';
                quizResult.innerHTML = '';
                score = 0;
                currentQuestion = 0;
                userAnswers = [];
            });
            
            document.getElementById('shareResultsBtn').addEventListener('click', function() {
                const shareText = `I scored ${score}/${quizData.length} on the American Culture Quiz! How well do you know American culture?`;
                if (navigator.share) {
                    navigator.share({
                        title: 'American Culture Quiz Results',
                        text: shareText,
                        url: window.location.href
                    });
                } else {
                    showNotification(shareText + '\n\nShare this with your friends!', 'info', 5000);
                }
            });

            addNotification('Quiz Completed! 🎯', 'success', `You scored ${score}/${quizData.length} on the American Culture Quiz!`);
        }
        
        showQuestion();
    }
}

function playSuccessSound() {
    playTone(523.25, 0.2, 'sine'); 
}

function playErrorSound() {
    playTone(392.00, 0.3, 'square'); 
}

function playRatingSound() {
    playTone(800, 0.3, 'sine');
}

function playClickSound() {
    playTone(523.25, 0.1, 'sine');
}

function playTone(frequency, duration, type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function initRatingStars() {
    const stars = document.querySelectorAll('.star');
    const ratingText = document.getElementById('rating-text');
    
    if (!stars.length || !ratingText) return;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            
            stars.forEach(s => {
                const starRating = parseInt(s.getAttribute('data-rating'));
                if (starRating <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            
            const messages = {
                1: "Thanks for 1 star! We'll work harder to improve! 🌟",
                2: "Thanks for 2 stars! We appreciate your feedback! ⭐⭐", 
                3: "Thanks for 3 stars! We're glad you like it! ⭐⭐⭐",
                4: "Thanks for 4 stars! Great rating! ⭐⭐⭐⭐",
                5: "Thanks for 5 stars! You're amazing! ⭐⭐⭐⭐⭐"
            };
            
            ratingText.textContent = messages[rating] || "Thank you for rating!";
            ratingText.style.fontWeight = 'bold';
            
            playRatingSound();
            showNotification(`Thank you for ${rating} star${rating > 1 ? 's' : ''}!`, 'success');
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach(s => {
                const starRating = parseInt(s.getAttribute('data-rating'));
                if (starRating <= rating) {
                    s.style.color = '#078fffff';
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            stars.forEach(s => {
                if (!s.classList.contains('active')) {
                    s.style.color = '';
                }
            });
        });
    });
}

function initFAQAccordion() {
    const accordionHeaders = document.querySelectorAll('.aca-accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    otherHeader.classList.remove('active');
                    const otherContent = document.getElementById(otherHeader.getAttribute('id').replace('Heading', 'Content'));
                    otherContent.classList.remove('active');
                    otherContent.style.maxHeight = "0";
                }
            });
            
            this.classList.toggle('active');
            const content = document.getElementById(this.getAttribute('id').replace('Heading', 'Content'));
            content.classList.toggle('active');
            
            if (content.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = "0";
            }
            
            playClickSound();
        });
    });
    
    if (accordionHeaders.length > 0) {
        accordionHeaders[0].click();
    }
}

function initReadMore() {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const moreText = this.getAttribute('data-more');
            const lessText = this.getAttribute('data-less');
            
            if (content && moreText && lessText) {
                if (content.classList.contains('expanded')) {
                    content.classList.remove('expanded');
                    this.textContent = moreText;
                    content.style.maxHeight = '60px';
                } else {
                    content.classList.add('expanded');
                    this.textContent = lessText;
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
                
                playClickSound();
            }
        });
    });
}

const galleryItems = [
    {
        id: 1,
        title: "Statue of Liberty",
        image: "images/statue-liberty.jpg",
        description: "Iconic symbol of freedom in New York Harbor",
        category: "landmark",
        year: 1886
    },
    {
        id: 2,
        title: "Grand Canyon",
        image: "images/grand-canyon.jpg", 
        description: "Natural wonder in Arizona, carved by Colorado River",
        category: "nature",
        year: 0
    },
    {
        id: 3,
        title: "White House",
        image: "images/white-house.jpg",
        description: "Official residence of the US President in Washington D.C.",
        category: "government",
        year: 1800
    },
    {
        id: 4,
        title: "Hollywood Sign",
        image: "images/Hollywood-sign.jpg",
        description: "Famous landmark in Los Angeles, California",
        category: "entertainment",
        year: 1923
    },
    {
        id: 5,
        title: "Golden Gate Bridge",
        image: "images/new-york.jpg", 
        description: "Suspension bridge connecting San Francisco to Marin County",
        category: "landmark", 
        year: 1937
    },
    {
        id: 6,
        title: "Mount Rushmore",
        image: "images/Cuisine Image.webp", 
        description: "National memorial with presidential sculptures in South Dakota",
        category: "landmark",
        year: 1941
    }
];

function initInteractiveGallery() {
    const galleryHTML = `
        <section class="py-5">
            <div class="container">
                <h3 class="aca-section-title fade-in">Interactive American Gallery</h3>
                <div class="text-center mb-4">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-custom active" data-filter="all">All</button>
                        <button type="button" class="btn btn-outline-custom" data-filter="landmark">Landmarks</button>
                        <button type="button" class="btn btn-outline-custom" data-filter="nature">Nature</button>
                        <button type="button" class="btn btn-outline-custom" data-filter="entertainment">Entertainment</button>
                    </div>
                </div>
                <div class="row g-3" id="interactiveGallery"></div>
                <div class="text-center mt-4">
                    <button id="shuffleGallery" class="btn btn-custom">
                        <i class="fas fa-random me-2"></i>Shuffle Gallery
                    </button>
                </div>
            </div>
        </section>
    `;
    
    const carouselSection = document.querySelector('.bg-light');
    if (carouselSection) {
        carouselSection.insertAdjacentHTML('afterend', galleryHTML);
        renderGallery();
        
        document.getElementById('shuffleGallery').addEventListener('click', function() {
            const shuffled = [...galleryItems].sort(() => Math.random() - 0.5);
            renderGallery(shuffled);
            playClickSound();
            showNotification('Gallery shuffled! 🔀', 'info');
        });
        
        document.querySelectorAll('[data-filter]').forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                document.querySelectorAll('[data-filter]').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                if (filter === 'all') {
                    renderGallery();
                } else {
                    const filtered = galleryItems.filter(item => item.category === filter);
                    renderGallery(filtered);
                }
                
                playClickSound();
                showNotification(`Showing ${filter} items`, 'info');
            });
        });
    }
}

function renderGallery(items = galleryItems) {
    const galleryContainer = document.getElementById('interactiveGallery');
    if (!galleryContainer) return;
    
    galleryContainer.innerHTML = items.map(item => `
        <div class="col-lg-4 col-md-6">
            <div class="gallery-item card card-custom fade-in" data-category="${item.category}">
                <img src="${item.image}" class="card-img-top card-img-custom" alt="${item.title}" 
                     onclick="openGalleryModal(${item.id})">
                <div class="card-body card-body-custom">
                    <h5 class="card-title-custom">${item.title}</h5>
                    <p class="card-text-custom">${item.description}</p>
                    <div class="gallery-meta">
                        ${item.year ? `<small class="text-muted"><i class="fas fa-calendar me-1"></i>${item.year}</small>` : ''}
                        <span class="badge bg-primary ms-2">${item.category}</span>
                    </div>
                    <button class="btn btn-outline-custom btn-sm mt-2" onclick="showItemDetails(${item.id})">
                        <i class="fas fa-info-circle me-1"></i>Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

window.openGalleryModal = function(itemId) {
    const item = galleryItems.find(i => i.id === itemId);
    if (!item) return;
    
    const modalHTML = `
        <div class="modal fade" id="galleryModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${item.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${item.image}" class="img-fluid mb-3" alt="${item.title}">
                        <p>${item.description}</p>
                        ${item.year ? `<p><strong>Year:</strong> ${item.year}</p>` : ''}
                        <p><strong>Category:</strong> ${item.category}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('galleryModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('galleryModal'));
    modal.show();
};

window.showItemDetails = function(itemId) {
    const item = galleryItems.find(i => i.id === itemId);
    if (!item) return;
    
    showNotification(`📋 ${item.title}\n\n📝 ${item.description}\n\n🏷️ Category: ${item.category}${item.year ? `\n📅 Year: ${item.year}` : ''}`, 'info', 5000);
};

const culturalFacts = [
    {
        id: 1,
        title: "Thanksgiving Tradition",
        fact: "The first Thanksgiving was celebrated in 1621 by Pilgrims and Native Americans and lasted three days.",
        category: "holidays",
        source: "Historical Records",
        interesting: true
    },
    {
        id: 2, 
        title: "Jazz Origins",
        fact: "Jazz originated in New Orleans in the late 19th century, blending African and European musical traditions.",
        category: "music",
        source: "Music History",
        interesting: true
    },
    {
        id: 3,
        title: "Baseball History",
        fact: "The first official baseball game was played in 1846 in Hoboken, New Jersey.",
        category: "sports", 
        source: "Sports Archives",
        interesting: true
    },
    {
        id: 4,
        title: "Hollywood Golden Age",
        fact: "The Golden Age of Hollywood lasted from the late 1920s to the early 1960s, producing classic films.",
        category: "movies",
        source: "Film History",
        interesting: false
    },
    {
        id: 5,
        title: "Hamburger Popularity",
        fact: "Americans consume approximately 50 billion burgers each year.",
        category: "cuisine",
        source: "Food Statistics",
        interesting: true
    },
    {
        id: 6,
        title: "Fourth of July",
        fact: "The Declaration of Independence was actually signed on July 2, 1776, but adopted on July 4th.",
        category: "holidays",
        source: "Historical Documents", 
        interesting: false
    }
];

function initCulturalFacts() {
    const factsHTML = `
        <section class="py-5 bg-light">
            <div class="container">
                <h3 class="aca-section-title fade-in">American Cultural Facts</h3>
                <div class="row g-4" id="culturalFactsContainer"></div>
                <div class="text-center mt-4">
                    <button id="refreshFacts" class="btn btn-custom">
                        <i class="fas fa-sync-alt me-2"></i>Show New Facts
                    </button>
                </div>
            </div>
        </section>
    `;
    
    const categoriesSection = document.querySelector('.aca-categories');
    if (categoriesSection) {
        categoriesSection.insertAdjacentHTML('afterend', factsHTML);
        renderFacts();
        
        document.getElementById('refreshFacts').addEventListener('click', function() {
            renderFacts();
            playClickSound();
            showNotification('New facts loaded! 📚', 'success');
        });
    }
}

let displayedFacts = [];

function getRandomFacts(count = 3) {
    const availableFacts = culturalFacts.filter(fact => !displayedFacts.includes(fact.id));
    
    if (availableFacts.length < count) {
        displayedFacts = [];
        return culturalFacts.slice(0, count);
    }
    
    const shuffled = [...availableFacts].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);
    
    selected.forEach(fact => displayedFacts.push(fact.id));
    
    return selected;
}

function renderFacts() {
    const container = document.getElementById('culturalFactsContainer');
    if (!container) return;
    
    const facts = getRandomFacts(3);
    
    container.innerHTML = facts.map(fact => `
        <div class="col-md-4">
            <div class="card card-custom h-100 fade-in">
                <div class="card-body card-body-custom">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary">${fact.category}</span>
                        ${fact.interesting ? '<span class="badge bg-warning">⭐ Interesting</span>' : ''}
                    </div>
                    <h5 class="card-title-custom">${fact.title}</h5>
                    <p class="card-text-custom">${fact.fact}</p>
                    <small class="text-muted">Source: ${fact.source}</small>
                </div>
            </div>
        </div>
    `).join('');
}

let notifications = JSON.parse(localStorage.getItem('acaNotifications')) || [];

function initNotificationSystem() {
    const notificationBell = document.getElementById('notificationBell');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotifications = document.getElementById('closeNotifications');
    const markAllRead = document.getElementById('markAllRead');

    if (notifications.length === 0) {
        createWelcomeNotifications();
    }

    updateNotificationCount();

    notificationBell.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationPanel.classList.toggle('show');
        if (notificationPanel.classList.contains('show')) {
            markAllNotificationsAsRead();
        }
        playClickSound();
    });

    closeNotifications.addEventListener('click', function() {
        notificationPanel.classList.remove('show');
        playClickSound();
    });

    markAllRead.addEventListener('click', function() {
        markAllNotificationsAsRead();
        playClickSound();
    });

    document.addEventListener('click', function(e) {
        if (!notificationPanel.contains(e.target) && !notificationBell.contains(e.target)) {
            notificationPanel.classList.remove('show');
        }
    });

    renderNotifications();

    setInterval(generateRandomNotification, 120000);
}

function createWelcomeNotifications() {
    const welcomeNotifications = [
        {
            id: Date.now(),
            type: 'info',
            title: 'Welcome to ACA! 🎉',
            message: 'Thank you for joining American Cultural Association. Explore American culture with us!',
            time: new Date().toISOString(),
            read: false
        },
        {
            id: Date.now() + 1,
            type: 'success',
            title: 'System Ready ✅',
            message: 'All features are now active. Enjoy your cultural journey!',
            time: new Date().toISOString(),
            read: false
        },
        {
            id: Date.now() + 2,
            type: 'warning',
            title: 'New Quiz Available! 🎯',
            message: 'Test your knowledge with our American Culture Quiz in the FAQ section.',
            time: new Date().toISOString(),
            read: false
        }
    ];

    notifications = welcomeNotifications;
    saveNotifications();
}

function generateRandomNotification() {
    const notificationTypes = [
        {
            type: 'info',
            title: 'Cultural Tip of the Day 🌟',
            message: 'Did you know? Jazz music originated in New Orleans in the late 19th century.'
        },
        {
            type: 'success',
            title: 'New Content Added! 📚',
            message: 'Check out our updated gallery with famous American landmarks and cultural sites.'
        },
        {
            type: 'warning',
            title: 'Quiz Reminder 🎯',
            message: 'Haven\'t tried our American Culture Quiz yet? Test your knowledge now!'
        },
        {
            type: 'error',
            title: 'Maintenance Alert ⚠️',
            message: 'Scheduled maintenance this weekend. Some features may be temporarily unavailable.'
        },
        {
            type: 'info',
            title: 'Holiday Celebration 🎄',
            message: 'Learn about American Thanksgiving traditions in our cultural facts section.'
        }
    ];

    const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    addNotification(
        randomNotif.type,
        randomNotif.title,
        randomNotif.message
    );
}

function addNotification(type, title, message) {
    const newNotification = {
        id: Date.now(),
        type: type,
        title: title,
        message: message,
        time: new Date().toISOString(),
        read: false
    };

    notifications.unshift(newNotification);
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }
    
    saveNotifications();
    updateNotificationCount();
    renderNotifications();
    
    const notificationPanel = document.getElementById('notificationPanel');
    if (!notificationPanel.classList.contains('show')) {
        showNotification(`${title}: ${message}`, type, 4000);
    }
}

function renderNotifications() {
    const notificationList = document.getElementById('notificationList');
    
    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                <p class="text-muted">No notifications yet</p>
            </div>
        `;
        return;
    }

    notificationList.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.type} ${notif.read ? 'read' : 'unread'}" 
             onclick="markNotificationAsRead(${notif.id})">
            <div class="notification-content">
                <h6>${notif.title}</h6>
                <p>${notif.message}</p>
                <div class="notification-meta">
                    <span class="notification-time">${formatTime(notif.time)}</span>
                    ${!notif.read ? '<span class="badge bg-primary">New</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function markNotificationAsRead(id) {
    notifications = notifications.map(notif => 
        notif.id === id ? {...notif, read: true} : notif
    );
    saveNotifications();
    updateNotificationCount();
    renderNotifications();
}

function markAllNotificationsAsRead() {
    notifications = notifications.map(notif => ({...notif, read: true}));
    saveNotifications();
    updateNotificationCount();
    renderNotifications();
    showNotification('All notifications marked as read', 'success');
}

function updateNotificationCount() {
    const unreadCount = notifications.filter(notif => !notif.read).length;
    const notificationCountBadge = document.getElementById('notificationCount');
    
    if (notificationCountBadge) {
        notificationCountBadge.textContent = unreadCount;
        notificationCountBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
    
    document.title = unreadCount > 0 ? 
        `(${unreadCount}) American Cultural Association` : 
        'American Cultural Association';
}

function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}

function saveNotifications() {
    localStorage.setItem('acaNotifications', JSON.stringify(notifications));
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 9999;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i> ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, duration);
    
    notification.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    });
}

function getNotificationColor(type) {
    const colors = {
        'success': 'linear-gradient(135deg, #28a745, #20c997)',
        'error': 'linear-gradient(135deg, #dc3545, #c82333)',
        'warning': 'linear-gradient(135deg, #ffc107, #fd7e14)',
        'info': 'linear-gradient(135deg, #3C3B6E, #2A2A5E)'
    };
    return colors[type] || colors.info;
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

function initTimeBasedGreeting() {
    function getGreeting() {
        const hour = new Date().getHours();
        let greeting, emoji;
        
        switch(true) {
            case hour >= 5 && hour < 12:
                greeting = "Good Morning!";
                emoji = "☀️";
                break;
            case hour >= 12 && hour < 17:
                greeting = "Good Afternoon!";
                emoji = "😊";
                break;
            case hour >= 17 && hour < 21:
                greeting = "Good Evening!";
                emoji = "🌆";
                break;
            default:
                greeting = "Good Night!";
                emoji = "🌙";
        }
        
        return { greeting, emoji };
    }
    
    function updateGreeting() {
        const greetingElement = document.getElementById('timeGreeting');
        if (!greetingElement) return;
        
        const { greeting, emoji } = getGreeting();
        greetingElement.innerHTML = `${emoji} <strong>${greeting}</strong> Welcome to American Cultural Association!`;
    }
    
    const heroContent = document.querySelector('.aca-hero-content');
    if (heroContent) {
        const greetingHTML = `<div id="timeGreeting" class="aca-greeting fade-in" style="font-size: 1.4rem; margin: 10px 0;"></div>`;
        heroContent.querySelector('p').insertAdjacentHTML('afterend', greetingHTML);
        
        updateGreeting();
        setInterval(updateGreeting, 60000);
    }
}

function initKeyboardNavigation() {
    const menuItems = document.querySelectorAll('.navbar-nav .nav-item');
    let focusedIndex = 0;

    if (menuItems.length > 0) {
        menuItems[focusedIndex].focus();

        document.addEventListener('keydown', function (e) {
            if (e.target.closest('.navbar-nav')) {
                switch (e.key) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        e.preventDefault();
                        focusedIndex = (focusedIndex + 1) % menuItems.length;
                        menuItems[focusedIndex].focus();
                        break;
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        e.preventDefault();
                        focusedIndex = (focusedIndex - 1 + menuItems.length) % menuItems.length;
                        menuItems[focusedIndex].focus();
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                const popupForm = document.getElementById('popupForm');
                if (popupForm && popupForm.style.display === 'flex') {
                    popupForm.style.display = 'none';
                }
                const notificationPanel = document.getElementById('notificationPanel');
                if (notificationPanel && notificationPanel.classList.contains('show')) {
                    notificationPanel.classList.remove('show');
                }
            }
        });
    }
}

function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const dateTimeElement = document.getElementById('date-time-block');
    if (dateTimeElement) {
        dateTimeElement.textContent = dateTimeString;
    }
}
function setupNotificationTesting() {
    console.log('🔔 Setting up notification testing...');
    
    const navLinks = document.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href && !this.href.includes('javascript')) {
                showNotification(`📄 Переход на: ${this.textContent}`, 'info', 2000);
            }
        });
    });
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            setTimeout(() => {
                showNotification('🖼️ Изображение загружено', 'success', 1500);
            }, 1000);
        });
    });
    
    let scrollNotificationShown = false;
    window.addEventListener('scroll', function() {
        if (!scrollNotificationShown && window.scrollY > 500) {
            showNotification('📜 Вы прокрутили страницу!', 'info', 2000);
            scrollNotificationShown = true;
        }
    });
    
    window.addEventListener('resize', function() {
        showNotification('📱 Размер окна изменен', 'warning', 1500);
    });
    
    console.log('✅ Notification testing setup complete');
}

setTimeout(setupNotificationTesting, 3000);
function initLazyLoading() {
    console.log('🚀 Starting Lazy Loading...');
    
    showNotification('🖼️ Lazy Loading activated! Scroll to load images.', 'info', 4000);
    
    let processedImages = 0;
    
    document.querySelectorAll('img').forEach((img, index) => {
        if (img.width < 200 || img.height < 200 || img.hasAttribute('data-lazy-processed')) {
            return;
        }
        
        img.setAttribute('data-lazy-processed', 'true');
        
        const originalSrc = img.src;
        img.setAttribute('data-original-src', originalSrc);
        
        const placeholder = createLazyPlaceholder(index + 1);
        img.src = placeholder;
        
        img.style.border = '3px solid #ff4444';
        img.style.borderRadius = '8px';
        img.style.transition = 'all 0.5s ease';
        
        processedImages++;
        console.log(`🔴 Lazy loaded image ${index + 1}`);
    });
    
    console.log(`✅ Lazy loading setup for ${processedImages} images`);
    
    function loadVisibleImages() {
        document.querySelectorAll('img[data-original-src]').forEach(img => {
            const rect = img.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight + 100 && rect.bottom > -100) {
                const originalSrc = img.getAttribute('data-original-src');
                
                img.src = originalSrc;
                img.style.border = '3px solid #180165ff'; 
                img.removeAttribute('data-original-src');
                
                console.log('🟢 Loaded:', originalSrc.split('/').pop());
                
                if (document.querySelectorAll('img[data-original-src]').length > 0) {
                    showNotification('🖼️ Image loaded!', 'success', 2000);
                }
            }
        });
    }
    
    window.addEventListener('scroll', loadVisibleImages);
    window.addEventListener('resize', loadVisibleImages);
    
    setTimeout(loadVisibleImages, 500);
}

function createLazyPlaceholder(number) {
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f8f9fa"/>
            <text x="50%" y="45%" font-family="Arial" font-size="16" fill="#3C3B6E" 
                  text-anchor="middle" font-weight="bold">LAZY LOADING</text>
            <text x="50%" y="60%" font-family="Arial" font-size="14" fill="#B22234" 
                  text-anchor="middle">Image ${number}</text>
            <text x="50%" y="75%" font-family="Arial" font-size="12" fill="#666" 
                  text-anchor="middle">Scroll to load</text>
        </svg>
    `)}`;
}
function initCopyButtons() {
    const copyableElements = document.querySelectorAll('.card-text-custom, .read-more-content, .aca-accordion-content p');
    
    copyableElements.forEach(element => {
        const copyButton = document.createElement('button');
        copyButton.className = 'btn btn-sm btn-outline-custom copy-btn';
        copyButton.setAttribute('data-bs-toggle', 'tooltip');
        copyButton.setAttribute('title', 'Copy to clipboard');
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        
        const container = document.createElement('div');
        container.className = 'position-relative';
        element.parentNode.insertBefore(container, element);
        container.appendChild(element);
        container.appendChild(copyButton);
        
        new bootstrap.Tooltip(copyButton);
        
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(element.textContent.trim());
                
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.classList.add('btn-success');
                
                const tooltip = bootstrap.Tooltip.getInstance(copyButton);
                tooltip.setContent({ '.tooltip-inner': 'Copied to clipboard!' });
                
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.classList.remove('btn-success');
                    tooltip.setContent({ '.tooltip-inner': 'Copy to clipboard' });
                }, 2000);
                
            } catch (err) {
                console.error('Failed to copy text: ', err);
                const tooltip = bootstrap.Tooltip.getInstance(copyButton);
                tooltip.setContent({ '.tooltip-inner': 'Failed to copy' });
            }
        });
    });
}
function initCultureSearch() {
    const searchInput = document.getElementById('cultureSearch');
    const suggestions = document.getElementById('searchSuggestions');
    const searchBtn = document.querySelector('.search-container .btn');

    if (!searchInput || !searchBtn) return;

    const alwaysVisibleSelectors = [
        '.navbar-custom',
        '.aca-hero',
        '.search-container',
        '.aca-newsletter',
        '.aca-team-section',
        '.aca-faq-section',
        '.aca-footer'
    ];

    function getPageWords() {
        const text = document.body.innerText;
        const words = text.match(/\b[A-Za-z]{3,}\b/g) || [];
        return [...new Set(words.map(w => w.toLowerCase()))];
    }

    const pageWords = getPageWords();

    function highlightText(query) {
        removeHighlights();
        if (!query.trim()) return;
        const regex = new RegExp(`(${query})`, 'gi');
        document.querySelectorAll('section, .aca-about, .aca-categories, .aca-gallery, .aca-facts')
            .forEach(section => {
                section.querySelectorAll('*').forEach(el => {
                    if (el.children.length === 0 && el.textContent.match(regex)) {
                        el.innerHTML = el.textContent.replace(regex, '<mark class="search-highlight">$1</mark>');
                    }
                });
            });
    }

    function removeHighlights() {
        document.querySelectorAll('.search-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
    }

    function filterInsideSections(query) {
        const lowerQuery = query.toLowerCase();
        document.querySelectorAll('section, .aca-about, .aca-categories, .aca-gallery, .aca-facts').forEach(section => {
            if (alwaysVisibleSelectors.some(sel => section.matches(sel))) {
                section.style.display = '';
                return;
            }
            const items = section.querySelectorAll('p, h2, h3, h4, li, .card, .fact-item, .gallery-item, .aca-accordion-item');
            let hasVisible = false;
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (lowerQuery && text.includes(lowerQuery)) {
                    item.style.display = '';
                    hasVisible = true;
                } else if (lowerQuery.length === 0) {
                    item.style.display = '';
                    hasVisible = true;
                } else {
                    item.style.display = 'none';
                }
            });
            section.style.display = hasVisible ? '' : 'none';
        });
    }

    function performSearch() {
        const query = searchInput.value.trim();
        highlightText(query);
        filterInsideSections(query);
    }

    function updateSuggestions() {
        const query = searchInput.value.toLowerCase().trim();
        suggestions.innerHTML = '';
        if (query.length === 0) {
            suggestions.style.display = 'none';
            return;
        }
        const filtered = pageWords.filter(w => w.includes(query)).slice(0, 8);
        if (filtered.length === 0) {
            const div = document.createElement('div');
            div.classList.add('suggestion-item');
            div.textContent = 'No results found';
            suggestions.appendChild(div);
        } else {
            filtered.forEach(w => {
                const div = document.createElement('div');
                div.classList.add('suggestion-item');
                div.innerHTML = w.replace(new RegExp(query, 'gi'), m => `<b>${m}</b>`);
                div.addEventListener('click', () => {
                    searchInput.value = w;
                    performSearch();
                    suggestions.style.display = 'none';
                });
                suggestions.appendChild(div);
            });
        }
        suggestions.style.display = 'block';
    }

    searchInput.addEventListener('input', updateSuggestions);
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    document.addEventListener('click', e => {
        if (!e.target.closest('.search-container')) suggestions.style.display = 'none';
    });
}
document.addEventListener('DOMContentLoaded', function() {
    initCultureSearch();
});

document.addEventListener('DOMContentLoaded', function() {
    initCultureSearch();
});

function initNewsletterForms() {
    const mainForm = document.getElementById('mainNewsletterForm');
    if (mainForm) {
        mainForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Please wait...';
            setTimeout(() => {
                alert('Thank you for subscribing to our newsletter!');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                this.reset();
            }, 2000);
        });
    }
}

function loadAllImagesNow() {
    const images = document.querySelectorAll('img[data-original-src]');
    let loaded = 0;
    
    images.forEach(img => {
        const originalSrc = img.getAttribute('data-original-src');
        img.src = originalSrc;
        img.style.border = '3px solid #4444ff'; 
        img.removeAttribute('data-original-src');
        loaded++;
    });
    
    showNotification(`🚀 Loaded ${loaded} images instantly!`, 'success', 3000);
    console.log(`🚀 Force loaded ${loaded} images`);
}

function checkLazyLoadingStatus() {
    const waiting = document.querySelectorAll('img[data-original-src]').length;
    const total = document.querySelectorAll('img[data-lazy-processed]').length;
    const loaded = total - waiting;
    
    const status = waiting > 0 ? 'WORKING 🟢' : 'COMPLETED ✅';
    
    showNotification(
        `📊 Lazy Loading: ${status}\n${loaded}/${total} images loaded`, 
        waiting > 0 ? 'info' : 'success', 
        4000
    );
    
    console.log(`📊 Status: ${status}`);
    console.log(`📊 ${loaded}/${total} images loaded`);
}

function initAdminButtons() {
    const enterAdminBtn = document.getElementById('enterAdminBtn');
    
    if (enterAdminBtn) {
        enterAdminBtn.addEventListener('click', () => {
            enterAdminMode();
        });
    }

    const isAdmin = localStorage.getItem('adminSession') === 'true';
    if (isAdmin && enterAdminBtn) {
        enterAdminBtn.style.display = 'none';
    }
}



document.addEventListener('DOMContentLoaded', function() {
    initPopup();
    initThemeToggle();
    initScrollAnimations();
    initSoundEffects();
    initInteractiveFAQ();
    initRatingStars();
    initKeyboardNavigation();
    initFAQAccordion();
    initReadMore();
    initInteractiveGallery();
    initCulturalFacts();
    initTimeBasedGreeting();
    initNotificationSystem();
    initCopyButtons(); 
    initNewsletterForms(); 
    initCultureSearch();
    initAdminAccess();
    initAdminButtons();
    initAdminPanel();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    setInterval(initCopyButtons, 3000);

    setTimeout(() => {
        showNotification('Welcome to American Cultural Association! 🎉', 'success', 5000);
    }, 2000);

    renderGallery();
    renderFacts();
    initInteractiveFAQ();

});

window.testNotificationSystem = function() {
    addNotification('info', 'Test Notification', 'This is a test notification from the system.');
};

window.clearAllNotifications = function() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        notifications = [];
        saveNotifications();
        updateNotificationCount();
        renderNotifications();
        showNotification('All notifications cleared', 'success');
    }
};