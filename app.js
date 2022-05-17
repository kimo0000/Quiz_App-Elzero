let questionCount = document.querySelector('.question_count span');
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let bullets = document.querySelector('.bullets');
let quizQuestion = document.querySelector('.quiz_question');
let quizAnswer = document.querySelector('.quiz_answer');
let btnSubmit = document.querySelector('.btn_submit');
let resultContainer = document.querySelector('.quiz_result');
let quizCounter = document.querySelector('.quiz_counter');


let currentQuestion = 0;
let rightAnswer = 0;
let countDownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

        myRequest.onreadystatechange = function() {
            if(this.readyState === 4 && this.status === 200) {
                 let questionObject = JSON.parse(this.responseText);
                 //console.log(questionObject);
                 let questionCount = questionObject.length;
                 //console.log(questionCount);

                 createBullets(questionCount);

                 addData(questionObject[currentQuestion], questionCount);

                 countDown(5, questionCount);

                 btnSubmit.onclick = () => {
                      let theRightAnswer = questionObject[currentQuestion].right_answer;
                          //console.log(theRightAnswer);
                          currentQuestion ++;

                      sheckAnswer(theRightAnswer, questionCount);

                      quizQuestion.innerHTML= "";
                      quizAnswer.innerHTML = "";

                      addData(questionObject[currentQuestion], questionCount);

                      handleBullets();

                      clearInterval(countDownInterval);
                      countDown(5, questionCount);

                      showResults(questionCount);


                 }
            }
        }

        myRequest.open('GET', 'question.json', true);
        myRequest.send();

}

getQuestions();


function createBullets(num) {
    questionCount.innerHTML = num;

    for(let i = 0; i < num; i++) {
        let bulletSpan = document.createElement('span');
            if(i === 0) {
               bulletSpan.className = 'on';
            }

        bulletsSpanContainer.appendChild(bulletSpan);
    }
}


function addData(obj, count) {
    //console.log(obj);
    //console.log(count);
    if(currentQuestion < count) {
         //console.log(currentQuestion);
         //console.log(count);
         let questionTitle = document.createElement('h2');
         let questionText = document.createTextNode(obj.title)

         questionTitle.appendChild(questionText);

         quizQuestion.appendChild(questionTitle);

    for(let i = 1; i <= 4; i++) {
        let mainDiv = document.createElement('div');
            mainDiv.className = 'answer';

        let theInput = document.createElement('input');
            theInput.name = 'question';
            theInput.type = 'radio';
            theInput.id = `answer_${i}`;
            theInput.dataset.answer = obj[`answer_${i}`];
            //console.log(theInput);

            if(i === 1) {
                theInput.checked = true;
            }

        let label = document.createElement('label');
            label.htmlFor = `answer_${i}`;

        let labelText = document.createTextNode(obj[`answer_${i}`]);
            label.appendChild(labelText);

        mainDiv.appendChild(theInput);
        mainDiv.appendChild(label);

        quizAnswer.appendChild(mainDiv);

    }
 }
}

function sheckAnswer(rAnswer, count) {
    //console.log(rAnswer);
    //console.log(count);
    let answers = document.getElementsByName('question');
    //console.log(answers);
    let theChoosenAnswer;

    for(let i = 0; i < answers.length; i++) {
        if(answers[i].checked) {
           theChoosenAnswer = answers[i].dataset.answer;
           //console.log(theChoosenAnswer);
        }
    }
        if(rAnswer === theChoosenAnswer) {
             rightAnswer++;
             //console.log('good answer');
        }
}



function handleBullets() {
    let bulletsSpan = document.querySelectorAll('.bullets .spans span');
    let arraybulletsSpan = Array.from(bulletsSpan);
    //console.log(arraybulletsSpan)
    arraybulletsSpan.forEach((span, index) => {
        //console.log(span);
        //console.log(index);
        //console.log(currentQuestion);
        if(currentQuestion === index) {
             span.className = 'on';
        }
    })
}


function showResults(count) {
    let results; 

    if(currentQuestion === count) {
         quizQuestion.remove();
         quizAnswer.remove();
         btnSubmit.remove();
         bullets.remove();

         if(rightAnswer > count / 2 && rightAnswer < count) {
             results = `<span class='good'>Good </span> you inswer ${rightAnswer} from ${count}`;
         }else if(rightAnswer === count) {
             results = `<span class='perfect'>Perfect </span> you inswer ${rightAnswer} from ${count}`;
         }else {
             results = `<span class='bad'>Bad </span> you inswer ${rightAnswer} from ${count}`;
         }

         resultContainer.innerHTML = results;
         resultContainer.style.padding = '10px';
         resultContainer.style.marginTop = '10px';
         resultContainer.style.backgroundColor = '#fff';
    }
}


function countDown(duration, count) {
    if(currentQuestion < count) {
        let minutes,
            seconds;

            countDownInterval = setInterval(() => {
                minutes = parseInt(duration / 60);
                seconds = parseInt(duration % 60);

                minutes = minutes < 10 ? `0${minutes}` : minutes;
                seconds = seconds < 10 ? `0${seconds}` : seconds;

                quizCounter.innerHTML = `${minutes} : ${seconds}`;
    
                   if(--duration < 0) {
                       clearInterval(countDownInterval);
                       btnSubmit.click();
                   }
            }, 1000)

    }
}