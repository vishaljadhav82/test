function saveAttempt(
score,
correct,
wrong,
skipped
){


let attempts =
JSON.parse(
localStorage.getItem("attempts")
)
||
[];



let total =
currentTest.questions.length;


let percentage =
((score / total) * 100)
.toFixed(2);



let answersData=[];



currentTest.questions.forEach(q=>{


answersData.push({

questionId:q.id,

question:q.question,

yourAnswer:
answers[q.id] || "Not Attempted",

correctAnswer:
q.answer,


status:
answers[q.id] == q.answer
?
"Correct"
:
answers[q.id]
?
"Wrong"
:
"Skipped"


});


});




let result={


id:Date.now(),


testId:
currentTest.id,


testName:
currentTest.name,


totalQuestions:
total,


score,


percentage,


correct,


wrong,


skipped,


accuracy:
(
(correct/(correct+wrong))*100
||
0
)
.toFixed(2),



timeTaken:
(currentTest.duration*60)-timeLeft,



answers:
answersData,



date:
new Date().toLocaleString()


};





attempts.push(result);



localStorage.setItem(
"attempts",
JSON.stringify(attempts)
);



localStorage.setItem(
"latestResult",
JSON.stringify(result)
);



}