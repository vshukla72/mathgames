let score = 0;
let timeRemaining = 60;
let timerInterval;
let playing;
let correctAnswer;
let selectedQuestions = [];
let usedQuestions = [];

document.getElementById("startreset").onclick = function() {
    if (playing == true) {
        location.reload();
    } else {
        playing = true;
        score = 0;
        timeRemaining = 180;
        clearInterval(timerInterval);
        generateQuestions();
        generateValues();
        startTimer();
        document.getElementById('score').innerText = `Score: ${score}`;
        document.getElementById("timeremaining").style.display = "block";
        document.getElementById('timeremainingvalue').innerHTML = timeRemaining;
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById("startreset").innerHTML = "Reset Game";
        document.getElementById("container").classList.remove("hidden");
        document.getElementById('start-image').classList.add('hidden');
        document.getElementById('reset').classList.remove('hidden');
    }
};

function startTimer() {
    timerInterval = setInterval(function() {
        timeRemaining--;
        document.getElementById('timeremainingvalue').innerText = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            document.getElementById("gameOver").innerHTML = "<p>Game Over!</p><p>Your score is " + score + ".</p>";
            document.getElementById("gameOver").style.display = "block";
            document.getElementById("timeremaining").style.display = "none";
            playing = false;
            document.getElementById("startreset").innerHTML = "Start Game";
            document.getElementById("formula").classList.add("hidden");
            document.getElementById("container").classList.add("hidden");
        }
    }, 1000);
}

function generateQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    let newQuestion = getRandomQuestion();
    while (usedQuestions.includes(newQuestion)) {
        newQuestion = getRandomQuestion();
    }
    usedQuestions.push(newQuestion);
    if (usedQuestions.length === questions.length) {
        usedQuestions = [];
    }
    selectedQuestions = [newQuestion];
    selectedQuestions.forEach((q, index) => {
        const questionHTML = `
            <div style="margin: 20px; padding: 10px; border-radius: 10px;">
                4 × (<span class="length" span id="length${index}" ondrop="drop(event)" ondragover="allowDrop(event)">Drag Length here</span>
                + <span class="width" span id="width${index}" ondrop="drop(event)" ondragover="allowDrop(event)">Drag Width here</span>
                + <span class="height" span id="height${index}" ondrop="drop(event)" ondragover="allowDrop(event)">Drag Height here</span>) =
                <span id="targetPerimeter${index}" style="font-weight: bold;">${q.targetPerimeter}</span>
                <button id="check-button" onclick="checkAnswer(${index})">Check Answer</button>
                <span id="result${index}" style="display: none;"></span>
            </div>
        `;
        container.innerHTML += questionHTML;
    });
}

function getRandomQuestion() {
    const remainingQuestions = questions.filter(q => !usedQuestions.includes(q));
    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    return remainingQuestions[randomIndex];
}

function generateValues() {
    const valuesContainer = document.getElementById('values');
    valuesContainer.innerHTML = '';
    values.forEach(value => {
        const valueHTML = `
            <td><div draggable="true" ondragstart="drag(event)" id="${value} cm" style="background-color: #ffcccc; border: 2px solid #333; border-radius: 5px; padding: 5px; cursor: move;">${value} cm</div></td>
        `;
        valuesContainer.innerHTML += valueHTML;
    });
}

// Rest of your code remains the same...


function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    event.target.textContent = document.getElementById(data).textContent;
}

function updateScore(isCorrect) {
    if (isCorrect) {
        score += 1; 
    } else {
        score -= 1; 
    }
    document.getElementById('score').innerText = `Score: ${score}`;
}

function checkAnswer(index) {
    const height = parseInt(document.getElementById(`height${index}`).innerText);
    const length = parseInt(document.getElementById(`length${index}`).innerText);
    const width = parseInt(document.getElementById(`width${index}`).innerText);
    const targetPerimeter = selectedQuestions[index].targetPerimeter;

    if (!isNaN(height) && !isNaN(length) && !isNaN(width)) {
        const calculatedPerimeter = 4 * (length + width + height) + ' cm';
        if (calculatedPerimeter === targetPerimeter) {
            if (!document.getElementById(`result${index}`).innerText) {
                document.getElementById('result').innerText = `Correct! The perimeter is ${calculatedPerimeter}.☺️`;
                document.getElementById('result').style.color = 'green';
                document.getElementById('myAudio').play();
                document.getElementById('correctAnswerSound').play();
                updateScore(true); 
                showCrackers(); 
                document.getElementById(`result${index}`).innerText = 'Answered';
                setTimeout(function() {
                    document.getElementById('result').innerText = '';
                    generateQuestions(); // Generate next question
                }, 2000);
            } else {
                document.getElementById('result').innerText = `You've already answered this question correctly.`;
                document.getElementById('result').style.color = 'blue';
                setTimeout(function() {
                    document.getElementById('result').innerText = '';
                }, 2000);
            }
        } else {
            document.getElementById('result').innerText = `Incorrect. Try again.😓`;
            document.getElementById('result').style.color = 'red';
            document.getElementById('IncorrectAnswerSound').play();
            updateScore(false);
            setTimeout(function() {
                document.getElementById('result').innerText = '';
            }, 2000);
        }
    } else {
        document.getElementById('result').innerText = `Please drag and drop the correct values.`;
    }
}


function showCrackers() {
    const body = document.body;
    const wrapper = document.createElement('div');
    wrapper.classList.add('burst');

    body.appendChild(wrapper);

    setTimeout(() => {
        wrapper.remove();
    }, 2000);
}

function disableGame() {
    document.getElementById('startreset').style.display = 'block';
    document.getElementById('reset').style.display = 'none';
    document.getElementById('questions-container').style.pointerEvents = 'none';
    document.getElementById('values').style.pointerEvents = 'none';
}

function gameOver() {
    clearInterval(timerInterval);
    document.getElementById('timeremainingvalue').innerText = 'Game Over';
    document.getElementById('score').innerText = `Final Score: ${score}`;
    document.getElementById('gameOver').style.display = 'block';
    disableGame();
}

function startGame() {
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('myAudio').play(); 
    startReset();
    startTimer(); 
}

document.getElementById('reset').addEventListener('click', startGame);

generateQuestions();
generateValues();

