
const questions = [
    { question: "Which planet is called Earth's twin?", options: ['Mars', 'Venus', 'Jupiter', 'Neptune'], answer: 'Venus' },
    { question: "Who was the last Mughal Emperor of India?", options: ['Aurangzeb', 'Akbar', 'Bahadur Shah Zafar', 'Humayun'], answer: 'Bahadur Shah Zafar' },
    { question: "Which is the smallest continent in the world?", options: ['Europe', 'Australia', 'South America', 'Antarctica'], answer: 'Australia' },
    { question: "Which Indian state is called the Land of Five Rivers?", options: ['Haryana', 'Punjab', 'Rajasthan', 'Gujarat'], answer: 'Punjab' },
    { question: "In which sport is the term LBW used ?", options: ['Cricket', 'Football', 'Hockey', 'Basketball'], answer: 'Cricket' },
    { question: "Who is known as the Captain cool in Cricket?", options: ['Virat Kohli', 'Sachin Tendulkar', 'Kapil Dev', 'M.S.Dhoni'], answer: 'M.S.Dhoni' },
    { question: "Which is the most famous social media app in the world (2025)?", options: ['Instagram', 'Twitter/X', 'TikTok', 'Snapchat'], answer: 'Instagram' },
    { question: "What is the hardest natural substance on Earth?", options: ['Iron', 'Gold', 'Diamond', 'Platinum'], answer: 'Diamond' },
    { question: "Who is the first Indian to win a Nobel Prize?", options: ['Rabindranath Tagore', 'Mother Teresa', 'C.V.Raman', 'Amartya Sen'], answer: 'Rabindranath Tagore' },
    { question: "Who was the first Indian woman to go into space?", options: ['Sunita Williams', 'Ritu Karidhal', 'Tessy Thomas', 'Kalpana Chawla'], answer: 'Kalpana Chawla' },
    { question: "The first Indian satellite was named?", options: ['INSAT-1A', 'Aryabhata', 'Bhaskara', 'Rohini'], answer: 'Aryabhata' },
    { question: "What is the smallest country in the world by population?", options: ['Vatican City', 'Monaco', 'Nauru', 'Liechtenstein'], answer: 'Vatican City' },
    { question: "What is the longest river in South America?", options: ['Nile', 'Parana', 'Amazon', 'Orinoco'], answer: 'Amazon' },
    { question: "Mount Kilimanjaro is located in which country?", options: ['Kenya', 'Tanzania', 'Uganda', 'Ethiopia'], answer: 'Tanzania' },
    { question: "Who developed the World Wide Web?", options: ['Tim Berners-Lee', 'Bill Gates', 'Steve Jobs', 'Mark Zuckerberg'], answer: 'Tim Berners-Lee' }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswers = {};
let shuffledQuestions = [];
let timer = null;
let timeLeft = 120;
let playerName = "";

const landingPage = document.getElementById('landingPage');
const quizPage = document.getElementById('quizPage');
const resultPage = document.getElementById('resultPage');
const questionElement = document.getElementById('questions');
const options = document.getElementById('options');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const retryBtn = document.getElementById('retryBtn');
const scoreElement = document.getElementById('score');
const feedbackElement = document.getElementById('feedback');
const quizProgressEl = document.getElementById('quizProgress');
const timerElement = document.getElementById('timer');
const lastScoreEl = document.getElementById("lastScore");
const highScoreEl = document.getElementById("highScore");

if (lastScoreEl) lastScoreEl.innerText = "Last Score: " + (localStorage.getItem("lastScore") || "N/A");
if (highScoreEl) highScoreEl.innerText = "High Score: " + (localStorage.getItem("highScore") || "N/A");


function startQuiz() {
    const nameInput = document.getElementById("username").value.trim();
    if (!nameInput) {
        alert("Please enter your name to start the quiz 🙂");
        return;
    }
    playerName = nameInput;

    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswers = {};
    timeLeft = 120;

    landingPage.classList.add('d-none');
    quizPage.classList.remove('d-none');
    resultPage.classList.add('d-none');

    loadQuestion();
    startTimer();
}


function loadQuestion() {
    const current = shuffledQuestions[currentQuestionIndex];
    questionElement.innerText = current.question;
    options.innerHTML = "";

    current.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'list-group-item list-group-item-action';
        btn.type = 'button';
        btn.innerText = option;

        if (selectedAnswers[currentQuestionIndex] === option) btn.classList.add('selected');

        btn.addEventListener('click', () => {
            selectedAnswers[currentQuestionIndex] = option;
            document.querySelectorAll('#options button').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });

        options.appendChild(btn);
    });

    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.classList.toggle('d-none', currentQuestionIndex === shuffledQuestions.length - 1);
    submitBtn.classList.toggle('d-none', currentQuestionIndex !== shuffledQuestions.length - 1);

    updateProgress();
}

function nextQuestion() {
    if (!selectedAnswers[currentQuestionIndex]) { alert("Please select an answer."); return; }
    currentQuestionIndex++;
    loadQuestion();
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function submitQuiz() {
    if (timer) { clearInterval(timer); timer = null; }

    score = 0;
    shuffledQuestions.forEach((q, i) => {
        if (selectedAnswers[i] === q.answer) score++;
    });

    localStorage.setItem("lastScore", score);
    const highScore = Number(localStorage.getItem("highScore") || 0);
    if (score > highScore) localStorage.setItem("highScore", score);

    quizPage.classList.add('d-none');
    resultPage.classList.remove('d-none');

    if (scoreElement) scoreElement.innerText = `${score} / ${shuffledQuestions.length}`;
    if (feedbackElement) {
        if (score === shuffledQuestions.length) feedbackElement.innerText = "Excellent 🎉";
        else if (score >= shuffledQuestions.length / 2) feedbackElement.innerText = "Good job 👍";
        else feedbackElement.innerText = "Keep practicing 💪";
    }
}

function retryQuiz() {
    resultPage.classList.add('d-none');
    landingPage.classList.remove('d-none');
    if (timer) { clearInterval(timer); timer = null; }
    if (timerElement) timerElement.textContent = formatTime(120);
    quizProgressEl.style.width = '0%';
}


function updateProgress() {
    if (!quizProgressEl) return;
    const percent = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
    quizProgressEl.style.width = percent + '%';
    quizProgressEl.setAttribute('aria-valuenow', percent.toFixed(0));
}
function startTimer() {
    if (!timerElement) return;
    if (timer) { clearInterval(timer); timer = null; }
    timerElement.textContent = formatTime(timeLeft);

    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
            alert("⏰ Time's up!");
        }
    }, 1000);
}

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

