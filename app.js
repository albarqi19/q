// Global variables
let currentStep = 1;
const totalSteps = 5;
let formData = {};

// Page navigation variables
let isWelcomePage = true;

// Registration dates
const REGISTRATION_START = new Date('2025-09-18T00:00:00+03:00'); // 18 سبتمبر 2025
const REGISTRATION_END = new Date('2025-10-02T23:59:59+03:00'); // 2 أكتوبر 2025 (بعد أسبوعين)

// Countdown variables
let countdownInterval;

// Audio control variables
let backgroundMusic;
let backgroundAudio;
let audioControlBtn;
let isMusicPlaying = true; // الصوت مشغل بشكل افتراضي
let isAudioPlaying = true; // للتوافق مع الكود الموجود
let logoClickCount = 0;
let isDeveloperMode = false;

// Initialize countdown
function initializeCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Update countdown timer
function updateCountdown() {
    const now = new Date();
    const countdownTitle = document.getElementById('countdownTitle');
    const startBtn = document.getElementById('startBtn');
    const registrationStatus = document.getElementById('registrationStatus');
    
    let targetDate, titleText, statusText, statusClass, buttonEnabled;
    
    if (now < REGISTRATION_START) {
        // Before registration starts
        targetDate = REGISTRATION_START;
        titleText = 'باقي على بداية التسجيل';
        statusText = 'التسجيل لم يبدأ بعد';
        statusClass = 'not-started';
        buttonEnabled = false;
    } else if (now >= REGISTRATION_START && now <= REGISTRATION_END) {
        // Registration is active
        targetDate = REGISTRATION_END;
        titleText = 'باقي على نهاية التسجيل';
        statusText = 'التسجيل مفتوح الآن!';
        statusClass = 'active';
        buttonEnabled = true;
    } else {
        // Registration ended
        targetDate = null;
        titleText = 'انتهى التسجيل';
        statusText = 'انتهت فترة التسجيل';
        statusClass = 'ended';
        buttonEnabled = false;
    }
    
    // Update title
    if (countdownTitle) {
        countdownTitle.textContent = titleText;
    }
    
    // Update button state (مؤقتاً: الزر مفعل دائماً)
    if (startBtn) {
        startBtn.disabled = false; // مؤقتاً: تفعيل الزر دائماً
        startBtn.textContent = 'ابدأ التسجيل الآن'; // مؤقتاً: نص ثابت
        
        // الكود الأصلي معطل مؤقتاً:
        // startBtn.disabled = !buttonEnabled;
        // if (buttonEnabled) {
        //     startBtn.textContent = 'ابدأ التسجيل الآن';
        // } else if (now < REGISTRATION_START) {
        //     startBtn.textContent = 'التسجيل لم يبدأ بعد';
        // } else {
        //     startBtn.textContent = 'انتهى التسجيل';
        // }
    }
    
    // Update status
    if (registrationStatus) {
        registrationStatus.textContent = statusText;
        registrationStatus.className = `registration-status ${statusClass}`;
    }
    
    // Update countdown numbers
    if (targetDate) {
        const difference = targetDate.getTime() - now.getTime();
        
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        } else {
            // Timer reached zero, refresh the state
            setTimeout(updateCountdown, 1000);
        }
    } else {
        // No active countdown
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// Audio control functions
function initializeAudio() {
    backgroundAudio = document.getElementById('backgroundAudio');
    audioControlBtn = document.getElementById('audioControlBtn');
    
    if (backgroundAudio && audioControlBtn) {
        // ضبط الصوت ليكون مشغل بشكل افتراضي
        backgroundAudio.loop = true;
        backgroundAudio.volume = 0.3;
        
        // ضبط الحالة الافتراضية للزر (مشغل)
        isAudioPlaying = true;
        isMusicPlaying = true;
        audioControlBtn.classList.remove('muted');
        audioControlBtn.title = 'إيقاف الصوت';
        
        // Try to play audio automatically
        const playPromise = backgroundAudio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // نجح التشغيل التلقائي
                console.log('تم تشغيل الصوت تلقائياً');
            }).catch(() => {
                // Auto-play prevented by browser - لكن نبقي الزر يظهر أنه مشغل
                console.log('منع المتصفح التشغيل التلقائي - اضغط الزر لتشغيل الصوت');
            });
        }
        
        // Add click event to audio control button
        audioControlBtn.addEventListener('click', toggleAudio);
        
        // إضافة مستمع لأول تفاعل للمستخدم لبدء الصوت
        document.addEventListener('click', function firstClick() {
            if (!backgroundAudio.paused) return; // الصوت يعمل بالفعل
            
            backgroundAudio.play().then(() => {
                isAudioPlaying = true;
                isMusicPlaying = true;
                audioControlBtn.classList.remove('muted');
                audioControlBtn.title = 'إيقاف الصوت';
                console.log('تم تشغيل الصوت بعد تفاعل المستخدم');
            }).catch(error => {
                console.log('فشل في تشغيل الصوت:', error);
            });
            
            // إزالة المستمع بعد أول نقرة
            document.removeEventListener('click', firstClick);
        });
    }
}

function toggleAudio() {
    if (backgroundAudio) {
        if (isAudioPlaying) {
            backgroundAudio.pause();
            isAudioPlaying = false;
            isMusicPlaying = false;
            audioControlBtn.classList.add('muted');
            audioControlBtn.title = 'تشغيل الصوت';
        } else {
            // في حالة أول تشغيل بعد منع المتصفح للتشغيل التلقائي
            backgroundAudio.play().then(() => {
                isAudioPlaying = true;
                isMusicPlaying = true;
                audioControlBtn.classList.remove('muted');
                audioControlBtn.title = 'إيقاف الصوت';
            }).catch(error => {
                console.log('فشل في تشغيل الصوت:', error);
            });
        }
    }
}

function updateAudioButton() {
    if (audioControlBtn) {
        if (isAudioPlaying) {
            audioControlBtn.classList.remove('muted');
            audioControlBtn.title = 'إيقاف الصوت';
        } else {
            audioControlBtn.classList.add('muted');
            audioControlBtn.title = 'تشغيل الصوت';
        }
    }
}

// Logo click handler for development mode
function initializeLogoClicks() {
    const logo = document.getElementById('mainLogo');
    if (logo) {
        logo.addEventListener('click', handleLogoClick);
        logo.style.cursor = 'pointer';
    }
}

function handleLogoClick() {
    logoClickCount++;
    
    // Clear previous timeout
    if (logoClickTimeout) {
        clearTimeout(logoClickTimeout);
    }
    
    // Check if reached 10 clicks
    if (logoClickCount >= 10) {
        // Enable development mode - force registration to open
        console.log('Development mode activated!');
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.textContent = 'ابدأ التسجيل الآن (وضع التطوير)';
            startBtn.style.background = '#28a745';
        }
        logoClickCount = 0;
        return;
    }
    
    // Reset counter after 3 seconds of no clicks
    logoClickTimeout = setTimeout(() => {
        logoClickCount = 0;
    }, 3000);
}

// Start registration function
function startRegistration() {
    console.log('Starting registration');
    
    // مؤقتاً: تعطيل التحقق من التاريخ والسماح بالتسجيل
    // Check if registration is active or development mode is enabled
    // const startBtn = document.getElementById('startBtn');
    // const isDevelopmentMode = startBtn && startBtn.textContent.includes('وضع التطوير');
    // const now = new Date();
    
    // if (!isDevelopmentMode && (now < REGISTRATION_START || now > REGISTRATION_END)) {
    //     return; // Button should be disabled anyway
    // }
    
    const welcomePage = document.getElementById('welcomePage');
    const registrationForm = document.getElementById('registrationForm');
    
    if (welcomePage && registrationForm) {
        // Hide welcome page with animation
        welcomePage.style.opacity = '0';
        welcomePage.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            welcomePage.style.display = 'none';
            registrationForm.style.display = 'block';
            
            // Show registration form with animation
            setTimeout(() => {
                registrationForm.style.opacity = '1';
                registrationForm.style.transform = 'translateY(0)';
            }, 50);
            
            isWelcomePage = false;
            
            // Clear countdown when entering form
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        }, 300);
    }
}

// Back to welcome page function
function backToWelcome() {
    console.log('Going back to welcome page');
    
    const welcomePage = document.getElementById('welcomePage');
    const registrationForm = document.getElementById('registrationForm');
    
    if (welcomePage && registrationForm) {
        // Hide registration form
        registrationForm.style.opacity = '0';
        registrationForm.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            registrationForm.style.display = 'none';
            welcomePage.style.display = 'block';
            
            // Show welcome page
            setTimeout(() => {
                welcomePage.style.opacity = '1';
                welcomePage.style.transform = 'translateY(0)';
            }, 50);
            
            isWelcomePage = true;
            
            // Restart countdown when returning to welcome page
            initializeCountdown();
            
            // Reset form
            resetForm();
        }, 300);
    }
}

// Competition levels data
const competitionLevels = {
    general: {
        name: "المسابقة العامة",
        options: [
            "خمسة عشر جزء",
            "عشرة أجزاء", 
            "خمسة أجزاء"
        ]
    },
    minor: {
        name: "المسابقة الصغرى",
        options: [
            "ثلاثة أجزاء",
            "جزء تبارك وعم",
            "جزء عم"
        ]
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application initialized');
    
    // Initialize audio
    initializeAudio();
    
    // Initialize logo clicks for development mode
    initializeLogoClicks();
    
    // Start countdown on welcome page
    if (isWelcomePage) {
        initializeCountdown();
    }
    
    updateProgressBar();
    updateStepIndicators();
    
    // Ensure first step is visible
    showStep(1);
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Setup other initializations
    populateDates();
    toggleLevelOptions();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Auto-format phone numbers
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    });

    // Ensure number inputs only accept numbers
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            // Check age restrictions when age is entered
            if (e.target.id === 'age') {
                checkAgeRestrictions();
            }
        });
        
        // Prevent non-numeric keypress
        input.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                e.preventDefault();
            }
        });
    });

    // Add Enter key navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const activeStep = document.querySelector('.form-step.active');
            const nextButton = activeStep ? activeStep.querySelector('.next-btn') : null;
            if (nextButton && !nextButton.disabled) {
                nextButton.click();
            }
        }
    });
    
    // Real-time validation
    addRealTimeValidation();
}

// Populate date options
function populateDates() {
    // Birth year dropdown
    const birthYearSelect = document.getElementById('birthYear');
    if (birthYearSelect) {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 50; // 50 years back
        const endYear = currentYear - 5; // At least 5 years old
        
        // Clear existing options except the placeholder
        while (birthYearSelect.children.length > 1) {
            birthYearSelect.removeChild(birthYearSelect.lastChild);
        }
        
        for (let year = endYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            birthYearSelect.appendChild(option);
        }
    }
}

// Navigation functions
function nextStep(step) {
    console.log('Next step called for step:', step);
    
    if (validateStep(step)) {
        saveStepData(step);
        
        if (step < totalSteps) {
            showStep(step + 1);
        }
    }
}

function prevStep(step) {
    console.log('Previous step called for step:', step);
    
    if (step > 1) {
        showStep(step - 1);
    }
}

function showStep(stepNumber) {
    console.log('Showing step:', stepNumber);
    
    // Hide all steps
    const allSteps = document.querySelectorAll('.form-step');
    allSteps.forEach(step => {
        step.classList.remove('active');
    });
    
    // Show target step
    const targetStep = document.getElementById(`formStep${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        currentStep = stepNumber;
        
        // Check age restrictions when entering step 3 (competition selection)
        if (stepNumber === 3) {
            checkAgeRestrictions();
        }
        
        // Update progress
        updateProgressBar();
        updateStepIndicators();
        
        // Focus first input in the step
        setTimeout(() => {
            const firstInput = targetStep.querySelector('input:not([type="radio"]):not([type="checkbox"]), select');
            if (firstInput && !firstInput.disabled) {
                firstInput.focus();
            }
        }, 100);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const percentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = percentage + '%';
    }
}

function updateStepIndicators() {
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`step${i}`);
        if (stepElement) {
            stepElement.classList.remove('active', 'completed');
            
            if (i < currentStep) {
                stepElement.classList.add('completed');
            } else if (i === currentStep) {
                stepElement.classList.add('active');
            }
        }
    }
}

// Validation functions
function validateStep(step) {
    console.log('Validating step:', step);
    clearErrors();
    let isValid = true;

    switch(step) {
        case 1:
            isValid = validatePersonalInfo();
            break;
        case 2:
            isValid = validateContactInfo();
            break;
        case 3:
            isValid = validateLevelSelection();
            break;
        case 4:
            isValid = validateTermsAgreement();
            break;
    }

    console.log('Step', step, 'validation result:', isValid);
    return isValid;
}

function validatePersonalInfo() {
    let isValid = true;
    
    // Full name validation
    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName) {
        showError('fullNameError', 'يرجى إدخال الاسم الرباعي');
        isValid = false;
    } else if (fullName.split(' ').length < 2) {
        showError('fullNameError', 'يرجى إدخال الاسم الرباعي كاملاً');
        isValid = false;
    }

    // ID number validation
    const idNumber = document.getElementById('idNumber').value.trim();
    if (!idNumber) {
        showError('idNumberError', 'يرجى إدخال رقم الهوية');
        isValid = false;
    } else if (idNumber.length !== 10 || !/^\d{10}$/.test(idNumber)) {
        showError('idNumberError', 'يجب أن يكون رقم الهوية 10 أرقام');
        isValid = false;
    }

    // Age validation
    const age = document.getElementById('age').value.trim();
    if (!age) {
        showError('ageError', 'يرجى إدخال العمر');
        isValid = false;
    } else if (parseInt(age) < 5 || parseInt(age) > 80) {
        showError('ageError', 'يجب أن يكون العمر بين 5 و 80 سنة');
        isValid = false;
    }

    return isValid;
}

function validateContactInfo() {
    let isValid = true;

    // Mosque name validation
    const mosqueName = document.getElementById('mosqueName').value.trim();
    if (!mosqueName) {
        showError('mosqueNameError', 'يرجى إدخال اسم المسجد');
        isValid = false;
    }

    // Mobile number validation
    const mobileNumber = document.getElementById('mobileNumber').value.trim();
    if (!mobileNumber) {
        showError('mobileNumberError', 'يرجى إدخال رقم الجوال');
        isValid = false;
    } else if (!/^05\d{8}$/.test(mobileNumber)) {
        showError('mobileNumberError', 'يجب أن يبدأ رقم الجوال بـ 05 ويتكون من 10 أرقام');
        isValid = false;
    }

    // Alternative mobile number validation (optional)
    const altMobileNumber = document.getElementById('altMobileNumber').value.trim();
    if (altMobileNumber && !/^05\d{8}$/.test(altMobileNumber)) {
        showError('altMobileNumberError', 'يجب أن يبدأ رقم الجوال بـ 05 ويتكون من 10 أرقام');
        isValid = false;
    }

    return isValid;
}

function validateLevelSelection() {
    let isValid = true;

    // Competition type validation
    const competitionType = document.querySelector('input[name="competitionType"]:checked');
    if (!competitionType) {
        showError('competitionTypeError', 'يرجى اختيار نوع المسابقة');
        isValid = false;
    }

    // Competition level validation
    const competitionLevel = document.querySelector('input[name="competitionLevel"]:checked');
    if (!competitionLevel) {
        showError('competitionLevelError', 'يرجى اختيار المستوى');
        isValid = false;
    }

    return isValid;
}

function validateTermsAgreement() {
    const agreeTerms = document.getElementById('agreeTerms').checked;
    if (!agreeTerms) {
        showError('agreeTermsError', 'يجب الموافقة على الشروط والأحكام');
        return false;
    }
    return true;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        const inputElement = errorElement.previousElementSibling;
        
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        if (inputElement && inputElement.classList.contains('form-control')) {
            inputElement.classList.add('error');
        }
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('.form-control.error');
    
    errorElements.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });
    
    inputElements.forEach(element => {
        element.classList.remove('error');
    });
}

// Save step data
function saveStepData(step) {
    console.log('Saving data for step:', step);
    
    switch(step) {
        case 1:
            formData.fullName = document.getElementById('fullName').value.trim();
            formData.idNumber = document.getElementById('idNumber').value.trim();
            formData.age = document.getElementById('age').value.trim();
            break;
        case 2:
            formData.mosqueName = document.getElementById('mosqueName').value.trim();
            formData.mobileNumber = document.getElementById('mobileNumber').value.trim();
            formData.altMobileNumber = document.getElementById('altMobileNumber').value.trim();
            break;
        case 3:
            const competitionType = document.querySelector('input[name="competitionType"]:checked');
            formData.competitionType = competitionType ? competitionType.value : '';
            const competitionLevel = document.querySelector('input[name="competitionLevel"]:checked');
            formData.competitionLevel = competitionLevel ? competitionLevel.value : '';
            break;
        case 4:
            formData.agreeTerms = document.getElementById('agreeTerms').checked;
            showSuccessPage();
            break;
    }
    
    console.log('Current form data:', formData);
}

// Toggle level options based on competition type
function toggleLevelOptions() {
    console.log('Toggling level options');
    
    const competitionType = document.querySelector('input[name="competitionType"]:checked');
    const levelOptions = document.getElementById('levelOptions');
    const levelCards = document.getElementById('levelCards');
    
    if (competitionType && levelOptions && levelCards) {
        // Show level options with animation
        levelOptions.classList.remove('hidden');
        levelOptions.classList.add('show');
        
        // Clear previous level cards
        levelCards.innerHTML = '';
        
        // Add new level cards based on selected type
        const options = competitionLevels[competitionType.value].options;
        options.forEach((option, index) => {
            const levelCard = document.createElement('div');
            levelCard.className = 'level-card';
            
            const levelId = `level_${competitionType.value}_${index}`;
            
            levelCard.innerHTML = `
                <input type="radio" name="competitionLevel" value="${option}" id="${levelId}">
                <label for="${levelId}" class="level-card-label">
                    ${option}
                </label>
            `;
            
            levelCards.appendChild(levelCard);
        });
    } else if (levelOptions) {
        levelOptions.classList.remove('show');
        setTimeout(() => {
            levelOptions.classList.add('hidden');
        }, 400); // Wait for animation to complete
    }
}

// Check age restrictions and update competition options
function checkAgeRestrictions() {
    const age = parseInt(document.getElementById('age').value);
    const generalCard = document.querySelector('.competition-card[data-type="general"]');
    const minorCard = document.querySelector('.competition-card[data-type="minor"]');
    const generalInput = document.getElementById('general');
    const minorInput = document.getElementById('minor');
    
    if (!age || age < 5) return; // No restrictions if age not entered or too young
    
    // Reset all cards first
    generalInput.disabled = false;
    minorInput.disabled = false;
    generalCard.classList.remove('disabled');
    minorCard.classList.remove('disabled');
    
    if (age > 23) {
        // Disable both competitions for age > 23
        generalInput.disabled = true;
        minorInput.disabled = true;
        generalCard.classList.add('disabled');
        minorCard.classList.add('disabled');
        
        // Clear any selection
        generalInput.checked = false;
        minorInput.checked = false;
        
        // Hide level options
        const levelOptions = document.getElementById('levelOptions');
        if (levelOptions) {
            levelOptions.classList.remove('show');
            levelOptions.classList.add('hidden');
        }
        
        // Show age restriction message
        showAgeRestrictionMessage('عذراً، المسابقة مخصصة للأعمار من 5 إلى 23 سنة فقط');
        
    } else if (age > 10) {
        // Disable minor competition for age > 10
        minorInput.disabled = true;
        minorCard.classList.add('disabled');
        
        // If minor was selected, clear it
        if (minorInput.checked) {
            minorInput.checked = false;
            const levelOptions = document.getElementById('levelOptions');
            if (levelOptions) {
                levelOptions.classList.remove('show');
                levelOptions.classList.add('hidden');
            }
        }
        
        hideAgeRestrictionMessage();
    } else {
        // Age 5-10: All competitions available
        hideAgeRestrictionMessage();
    }
}

// Show age restriction message
function showAgeRestrictionMessage(message) {
    let messageDiv = document.getElementById('ageRestrictionMessage');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'ageRestrictionMessage';
        messageDiv.className = 'age-restriction-message';
        
        const competitionCards = document.querySelector('.competition-cards');
        competitionCards.parentNode.insertBefore(messageDiv, competitionCards);
    }
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
}

// Hide age restriction message
function hideAgeRestrictionMessage() {
    const messageDiv = document.getElementById('ageRestrictionMessage');
    if (messageDiv) {
        messageDiv.style.display = 'none';
    }
}

// Show success page with summary
function showSuccessPage() {
    console.log('Showing success page');
    
    // Update summary
    const summaryElements = {
        summaryName: formData.fullName,
        summaryId: formData.idNumber,
        summaryAge: formData.age + ' سنة',
        summaryMosque: formData.mosqueName,
        summaryMobile: formData.mobileNumber
    };
    
    Object.keys(summaryElements).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = summaryElements[key];
        }
    });
    
    const competitionTypeName = competitionLevels[formData.competitionType].name;
    const summaryCompetition = document.getElementById('summaryCompetition');
    const summaryLevel = document.getElementById('summaryLevel');
    
    if (summaryCompetition) summaryCompetition.textContent = competitionTypeName;
    if (summaryLevel) summaryLevel.textContent = formData.competitionLevel;
    
    // Show step 5
    showStep(5);
}

// Reset form
function resetForm() {
    console.log('Resetting form');
    
    // Clear form data
    formData = {};
    
    // Reset all form inputs
    document.querySelectorAll('input, select').forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    // Hide level options
    const levelOptions = document.getElementById('levelOptions');
    if (levelOptions) {
        levelOptions.classList.add('hidden');
    }
    
    // Clear errors
    clearErrors();
    
    // Go back to step 1
    showStep(1);
}

// Add real-time validation feedback
function addRealTimeValidation() {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            // Clear previous errors for this input
            const formGroup = this.closest('.form-group');
            const errorElement = formGroup ? formGroup.querySelector('.error-message') : null;
            
            if (errorElement) {
                errorElement.classList.remove('show');
                this.classList.remove('error');
            }
            
            // Validate based on input type and current step
            if (currentStep === 1 && this.id === 'idNumber' && this.value) {
                if (!/^\d{10}$/.test(this.value)) {
                    showError(this.id + 'Error', 'يجب أن يكون رقم الهوية 10 أرقام');
                }
            }
            
            if (this.type === 'tel' && this.value) {
                if (!/^05\d{8}$/.test(this.value)) {
                    showError(this.id + 'Error', 'يجب أن يبدأ رقم الجوال بـ 05 ويتكون من 10 أرقام');
                }
            }
        });
    });
}

// Debug function to check form state
function debugFormState() {
    console.log('Current step:', currentStep);
    console.log('Form data:', formData);
    console.log('Active step element:', document.querySelector('.form-step.active'));
}

// Expose functions globally for onclick handlers
window.nextStep = nextStep;
window.prevStep = prevStep;
window.resetForm = resetForm;
window.toggleLevelOptions = toggleLevelOptions;
window.checkAgeRestrictions = checkAgeRestrictions;
window.startRegistration = startRegistration;
window.backToWelcome = backToWelcome;
window.debugFormState = debugFormState;