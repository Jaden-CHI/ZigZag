// 게임 변수들
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 20;
let answered = false;

// 사용할 문제 개수 (사용자 설정 가능)
let questionCount = 10;

// 전체 퀴즈 데이터
let allQuizData = [];
let quizData = [];

// 게임 요소 참조
const startScreen = document.getElementById('startScreen');
const quizContainer = document.getElementById('quizContainer');
const resultScreen = document.getElementById('resultScreen');
const startButton = document.getElementById('startButton');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const feedbackElement = document.getElementById('feedback');
const explanationElement = document.getElementById('explanation');
const nextButton = document.getElementById('nextButton');
const questionCountElement = document.getElementById('questionCount');
const progressElement = document.getElementById('progress');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const resultMessageElement = document.getElementById('resultMessage');
const medalElement = document.getElementById('medal');
const finalFactElement = document.getElementById('finalFact');
const restartButton = document.getElementById('restartButton');

// 추가 역사 사실
const historyFacts = [
    "<strong>알고 계셨나요?</strong> 메소포타미아의 수메르인들은 60진법을 사용했는데, 이것이 오늘날 우리가 시간(60초, 60분)을 측정하는 방식의 기원입니다.",
    "<strong>알고 계셨나요?</strong> 알렉산더 대왕은 33세의 나이로 사망했지만, 그의 제국은 그리스에서 인도까지 이르렀습니다.",
    "<strong>알고 계셨나요?</strong> 중국 진나라의 시황제는 만리장성 건설을 명령한 것으로 유명하지만, 그의 무덤에는 8,000개 이상의 테라코타 전사가 있습니다.",
    "<strong>알고 계셨나요?</strong> 마야 문명은 초콜릿 음료를 신성한 것으로 여겼으며, 이를 '신들의 음식'이라고 불렀습니다.",
    "<strong>알고 계셨나요?</strong> 바이킹들은 북아메리카를 콜럼버스보다 약 500년 먼저 발견했으며, 이를 '빈란드'라고 불렀습니다."
];

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    // 전체 퀴즈 데이터 합치기
    allQuizData = [...allQuizQuestions, ...allQuizQuestions2, ...allQuizQuestions3];
    console.log(`총 ${allQuizData.length}개의 문제가 로드되었습니다.`);
    
    // 문제 수 설정
    document.getElementById('questionCountSelect').addEventListener('change', function() {
        questionCount = parseInt(this.value);
        document.getElementById('totalQuestions').textContent = questionCount;
    });
    
    // 시작 버튼 이벤트
    startButton.addEventListener('click', startQuiz);
    
    // 다음 버튼 이벤트
    nextButton.addEventListener('click', () => {
        clearInterval(timer);
        currentQuestion++;
        
        if (currentQuestion < questionCount) {
            showQuestion();
        } else {
            showResults();
        }
    });
    
    // 다시 시작 버튼 이벤트
    restartButton.addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        resultScreen.style.display = 'none';
        startScreen.style.display = 'block';
    });
});

// 퀴즈 시작 함수
function startQuiz() {
    // 모든 문제에서 랜덤하게 선택
    let selectedQuestions = [];
    
    // 전체 문제 수가 요청한 문제 수보다 많으면 랜덤 선택
    if (allQuizData.length > questionCount) {
        // 인덱스 배열 생성 (0부터 전체 문제 수-1까지)
        const indices = Array.from({ length: allQuizData.length }, (_, i) => i);
        
        // 인덱스 섞기 (Fisher-Yates 알고리즘)
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        // 필요한 만큼의 문제 선택
        for (let i = 0; i < questionCount; i++) {
            selectedQuestions.push(allQuizData[indices[i]]);
        }
    } else {
        // 전체 문제 수가 요청한 문제 수보다 적으면 모든 문제 사용
        selectedQuestions = [...allQuizData];
        questionCount = selectedQuestions.length; // 문제 수 조정
    }
    
    // 전역 퀴즈 데이터 업데이트
    quizData = selectedQuestions;
    
    // 상태 초기화
    currentQuestion = 0;
    score = 0;
    
    // 화면 전환
    startScreen.style.display = 'none';
    quizContainer.style.display = 'block';
    showQuestion();
}

// 문제 표시 함수
function showQuestion() {
    resetState();
    
    // 현재 문제 데이터
    const currentQuizData = quizData[currentQuestion];
    
    // 진행 상황 업데이트
    questionCountElement.textContent = `문제 ${currentQuestion + 1}/${quizData.length}`;
    progressElement.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;
    
    // 문제 표시
    questionElement.textContent = currentQuizData.question;
    
    // 선택지 생성
    currentQuizData.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        
        optionElement.addEventListener('click', () => {
            if (!answered) {
                checkAnswer(index);
            }
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    // 타이머 시작
    startTimer();
}

// 타이머 시작 함수
function startTimer() {
    timeLeft = 20;
    timerElement.textContent = `남은 시간: ${timeLeft}초`;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `남은 시간: ${timeLeft}초`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (!answered) {
                const options = document.querySelectorAll('.option');
                const correctIndex = quizData[currentQuestion].correct;
                
                options[correctIndex].classList.add('correct');
                feedbackElement.textContent = "시간 초과! 정답을 확인하세요.";
                explanationElement.textContent = quizData[currentQuestion].explanation;
                explanationElement.style.display = 'block';
                answered = true;
                nextButton.style.display = 'block';
            }
        }
    }, 1000);
}

// 답변 확인 함수
function checkAnswer(selectedIndex) {
    clearInterval(timer);
    answered = true;
    
    const options = document.querySelectorAll('.option');
    const correctIndex = quizData[currentQuestion].correct;
    
    if (selectedIndex === correctIndex) {
        options[selectedIndex].classList.add('correct');
        feedbackElement.textContent = "정답입니다!";
        score++;
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[correctIndex].classList.add('correct');
        feedbackElement.textContent = "틀렸습니다!";
    }
    
    // 설명 표시
    explanationElement.textContent = quizData[currentQuestion].explanation;
    explanationElement.style.display = 'block';
    
    // 다음 버튼 표시
    nextButton.style.display = 'block';
}

// 결과 화면 표시 함수
function showResults() {
    quizContainer.style.display = 'none';
    resultScreen.style.display = 'block';
    
    // 점수 표시
    scoreElement.textContent = `점수: ${score}/${quizData.length}`;
    
    // 결과 메시지와 메달 설정
    if (score >= Math.round(quizData.length * 0.9)) {
        medalElement.textContent = '🏆';
        resultMessageElement.textContent = "훌륭합니다! 당신은 세계사 전문가입니다!";
    } else if (score >= Math.round(quizData.length * 0.7)) {
        medalElement.textContent = '🥈';
        resultMessageElement.textContent = "잘했습니다! 세계사에 대한 지식이 풍부합니다!";
    } else if (score >= Math.round(quizData.length * 0.5)) {
        medalElement.textContent = '🥉';
        resultMessageElement.textContent = "좋습니다! 세계사의 기본 지식을 잘 알고 있습니다.";
    } else {
        medalElement.textContent = '📚';
        resultMessageElement.textContent = "조금 더 공부가 필요합니다. 다시 도전해보세요!";
    }
    
    // 랜덤한 역사 사실 표시
    const randomFact = historyFacts[Math.floor(Math.random() * historyFacts.length)];
    finalFactElement.innerHTML = randomFact;
}

// 상태 초기화 함수
function resetState() {
    answered = false;
    nextButton.style.display = 'none';
    feedbackElement.textContent = '';
    explanationElement.style.display = 'none';
    
    // 선택지 컨테이너 비우기
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}