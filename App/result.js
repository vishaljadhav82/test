let result =

JSON.parse(
localStorage.getItem("latestResult")
);



function grade(p){


if(p>=90)
return "A+";

if(p>=80)
return "A";

if(p>=70)
return "B";

if(p>=60)
return "C";

return "Needs Improvement";


}





function loadResult(){


if(!result){

alert(
"No result found"
);

return;

}



summary.innerHTML=


`

<div class="summary">


<div class="box">

<h2>
${result.score}/${result.totalQuestions}
</h2>

Score

</div>



<div class="box">

<h2>
${result.percentage}%
</h2>

Percentage

</div>



<div class="box">

<h2>
${result.accuracy}%
</h2>

Accuracy

</div>



<div class="box">

<h2>
${grade(result.percentage)}
</h2>

Grade

</div>



</div>


`;





let html="";



result.answers.forEach(
(q,index)=>{


let cls =
q.status=="Correct"
?
"correct"
:
q.status=="Wrong"
?
"wrong"
:
"skipped";



html+=

`

<div class="review ${cls}">


<b>
Q${index+1}.
${q.question}
</b>


<br><br>


Your Answer:
${q.yourAnswer}


<br>


Correct Answer:
${q.correctAnswer}


<br>


Status:
${q.status}



</div>


`;


});



review.innerHTML=html;



createChart();


}




function createChart(){


new Chart(
document
.getElementById("chart"),

{

type:"doughnut",

data:{

labels:[

"Correct",

"Wrong",

"Skipped"

],


datasets:[{

data:[

result.correct,

result.wrong,

result.skipped

],


backgroundColor:[

"green",

"red",

"gray"

]

}]


}


}

);


}





loadResult();