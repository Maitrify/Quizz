const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const progress = (value) => {
    const percentage = (value/ time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};
let questions =[],
    time= 30,
    score=0,
    currentQuestion,
    timer;

const startBtn = document.querySelector(".start"),
          numQuestion = document.querySelector("#num-questions"),
          category = document.querySelector("#category"),
          difficulty = document.querySelector("#difficulty"),
          timePerQuestion = document.querySelector("#time"),
          quiz = document.querySelector(".quiz"),
          startscreen = document.querySelector(".start-screen");
          
// let submitBtn;
// let nextBtn;
const startQuiz =() =>{
  const num = numQuestion.value;
  cat=category.value;
  diff = difficulty.value;
  //api url
  const url=`https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
  fetch(url).then((res) =>res.json())
  .then((data) =>{
    questions = data.results;
    startscreen.classList.add('hide');
    quiz.classList.remove('hide');
    currentQuestion = 1;
    showQuestion(questions[0]);
  },1000);

};
startBtn.addEventListener("click", startQuiz);



 const submitBtn=document.querySelector(".submit"),
 nextBtn = document.querySelector(".next");

const showQuestion = (question) =>{
  const questionText = document.querySelector(".question"),
  answersWrapper = document.querySelector(".answer-wrapper"),
  questionNumber= document.querySelector(".number");
  questionText.innerHTML = question.question;

//correct and wrong answer are separated lets mix them
const answers= [...question.incorrect_answers,question.correct_answer];
answersWrapper.innerHTML = "",
//correct answer will always be at last so suffling the array
answers.sort(() => Math.random() -0.5);

answers.forEach((answer) =>{
  answersWrapper.innerHTML += `<div class="answer">
                    <span class="text">${answer}</span>
                    <span class="checkbox">
                        <span class="icon">&#10003</span>
                    </span>
                </div>`;
});
 questionNumber.innerHTML= `
 Question <span class="current">${questions.indexOf(question) +1}</span>
 <span class="total">/${questions.length}</span>`;

//event listner on answer
const answerDiv = document.querySelectorAll(".answer");
answerDiv.forEach((answer) =>{
  answer.addEventListener("click", () =>{
    //if answer is already commited
    if(!answer.classList.contains("checked")){
      //remove checked form other answer
      answerDiv.forEach((answer) =>{
        answer.classList.remove("selected");
      });
      // add selected on currently clicked
      answer.classList.add("selected");
      //after any answer is selected enable submit btn
      submitBtn.disabled = false;
    }
  });
});
//after updating question start timer
time = timePerQuestion.value;
startTimer(time);
};
const startTimer =(time)=>{
  timer = setInterval(()=>{
    if(time >= 0){
      //if timer more than 0 means time remaining
      //move progress
      progress(time);
      time--;
    }else{
      //if time is less then 0
      checkAnswer();
    }
  },1000);
};
submitBtn.addEventListener("click", () =>{
  checkAnswer();
});
const checkAnswer = () =>{
  //first clear interval when check answer triggered
  clearInterval(timer);

  const selectedAnswer = document.querySelector(".answer.selected");
  //any anser is selected
  if(selectedAnswer){
    const answer = selectedAnswer.querySelector(".text").innerText;
    if(answer=== questions[currentQuestion - 1].correct_answer){
      //if answer matched with current quest correct ans
      //increase question
      score++;
      //add correct class on selected
      selectedAnswer.classList.add("correct");
    } else{
      //if wrong selected
      //correct answer added lets add wrong on selected
      selectedAnswer.classList.add("wrong");
      const correctAnswer = document.querySelectorAll(".answer").forEach((answer) => {
        if(answer.querySelector(".text").innerHTML === questions[currentQuestion-1].correct_answer){
          //only add correct class to correct answer
          answer.classList.add("correct");
        }
      });
    }
  }
  //answer check will also be triggered when time reaches 0
  //what is nothing is selected amd time is finished 
  // lets just add correct class on correct answer when no answer is selected
   else{
     const correctAnswer = document.querySelectorAll(".answer").forEach((answer) => {
         if(answer.querySelector(".text").innerHTML === questions[currentQuestion-1].correct_answer){
           //only add correct class to correct answer
           answer.classList.add("correct");
        }
       });

   }
  //lets block user to select further answers
  const answerDiv = document.querySelectorAll(".answer");
  answerDiv.forEach((answer) =>{
    answer.classList.add("checked");
    //add checked class on all answer as we check for it when on click answer if its present do nothing

  })
  // after submit show next btn to go to next questiion
  submitBtn.style.display= "none";
  nextBtn.style.display = "block";
};
//to show next question on next btn click
nextBtn.addEventListener("click",()=>{
  nextQuestion();
  //also show submit btn on next queestion and hide next btn
  nextBtn.style.display= "none";
  submitBtn.style.display = "block";
});
 const nextQuestion =() =>{
  //if there is remaining question
  if(currentQuestion < questions.length){
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1])
  }
  else{
    //if no question remaining
    showScore();
  }
 };
 const endScreen =document.querySelector(".end-screen"),
 finalScore = document.querySelector(".final-score"),
 totalScore = document.querySelector(".total-score");

 const showScore= () =>{
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/${questions.length}`;
 };

 const restartBtn =document.querySelector(".restart");
 restartBtn.addEventListener("click", ()=>{
  //reload the page on click
  window.location.reload();
 });
