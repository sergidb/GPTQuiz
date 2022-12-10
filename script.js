const QUESTION_SECONDS = 30;
const QUESTION_QTY_PER_GAME = 15;

let questions, currentQuestion, questionTimeout;
let questionRef, resp1Ref, resp2Ref, resp3Ref, resp4Ref;
let rightScoreRef, wrongScoreRef, rightScoreEndRef, wrongScoreEndRef;
let timeoutBarRef, startButtonRef, restartButtonRef, menuViewRef, gameViewRef, endViewRef;

let correctAnswers = 0, wrongAnswers = 0;

window.onload = init;

function init() {

    // Bind DOM elems
    questionRef = document.querySelector('#question');
    resp1Ref = document.querySelector('#resp1');
    resp2Ref = document.querySelector('#resp2');
    resp3Ref = document.querySelector('#resp3');
    resp4Ref = document.querySelector('#resp4');
    rightScoreRef = document.querySelector('#rightScore');
    wrongScoreRef = document.querySelector('#wrongScore');
    rightScoreEndRef = document.querySelector('#rightScoreEnd');
    wrongScoreEndRef = document.querySelector('#wrongScoreEnd');
    timeoutBarRef = document.querySelector('#timeoutBar');
    startButtonRef = document.querySelector('#startButton');
    menuViewRef = document.querySelector('#menuView');
    gameViewRef = document.querySelector('#gameView');
    endViewRef = document.querySelector('#endView');
    restartButtonRef = document.querySelector('#restartButton');

    // Bind click events
    resp1Ref.onclick = e => onResponseClick(e);
    resp2Ref.onclick = e => onResponseClick(e);
    resp3Ref.onclick = e => onResponseClick(e);
    resp4Ref.onclick = e => onResponseClick(e);
    startButtonRef.onclick = e => resetGame();
    restartButtonRef.onclick = e => resetGame();
    
}

function resetGame() {
    
    // Show game view
    menuViewRef.classList.add('collapse');
    gameViewRef.classList.remove('collapse'); 
    endViewRef.classList.add('collapse');

    // Set score counters to 0
    correctAnswers = 0;
    wrongAnswers = 0;
    printScore();

    // Load questions
    fetch('questions_es.json')
    .then(response => response.json())
    .then(json => {
        questions = json;
        showNewQuestion();
    });

}

function stopGame() {
    clearTimeout(questionTimeout);

    rightScoreEndRef.innerHTML = correctAnswers;
    wrongScoreEndRef.innerHTML = wrongAnswers;

    menuViewRef.classList.add('collapse');
    gameViewRef.classList.add('collapse');
    endViewRef.classList.remove('collapse');
}

function getRandomQuestion() {
    const indiceAleatorio = Math.floor(Math.random() * questions.length);
    const q = questions.splice(indiceAleatorio, 1)[0];
    currentQuestion = q;
    
    return {
        question: q.question,
        answers: randomizeArray(duplicateArray(q.answers))
    }
}

function printQuestion(question) {
    questionRef.innerHTML = question.question;
    resp1Ref.innerHTML = question.answers[0];
    resp2Ref.innerHTML = question.answers[1];
    resp3Ref.innerHTML = question.answers[2];
    resp4Ref.innerHTML = question.answers[3];
}

function onResponseClick(ev) {
    const resp = ev.target.innerHTML;
    const isCorrect = resp == currentQuestion.answers[0];
    registerAnswer(isCorrect);
}

function registerAnswer(isCorrect) {
    if (isCorrect) {
        correctAnswers++;
    } else {
        wrongAnswers++;
    }
    printScore();
    showNewQuestion();
}

function printScore() {
    rightScoreRef.innerHTML = correctAnswers;
    wrongScoreRef.innerHTML = wrongAnswers;
}

function showNewQuestion() {

    if (questions.length == 0 || correctAnswers + wrongAnswers == QUESTION_QTY_PER_GAME) {
        stopGame();
        return;
    }

    onNewQuestion();

    const q = getRandomQuestion();
    printQuestion(q);
}

function onNewQuestion() {
    clearTimeout(questionTimeout);
    questionTimeout = setTimeout(() => registerAnswer(false), QUESTION_SECONDS * 1000);
    timeoutBarRef.classList.remove('empty');
    setTimeout(() => timeoutBarRef.classList.add('empty'), 100);
}

function randomizeArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function duplicateArray(array) {
    return Array.from(array.map(item => item));
}