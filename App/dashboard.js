let attempts =

JSON.parse(
localStorage.getItem("attempts")
)
||
[];





function loadDashboard(){


if(attempts.length==0){

document.getElementById(
"stats"
).innerHTML=

`
<h3>
No tests attempted yet
</h3>
`;

return;

}




let totalTests =
attempts.length;



let totalScore=0;

let highest=0;

let correct=0;

let wrong=0;



let labels=[];

let scores=[];



attempts.forEach(a=>{


totalScore +=
Number(a.percentage);


highest =
Math.max(
highest,
Number(a.percentage)
);



correct +=
a.correct;



wrong +=
a.wrong;



labels.push(
a.testName
);


scores.push(
a.percentage
);



});





let average =
(
totalScore / totalTests
)
.toFixed(2);






stats.innerHTML=


`

<div class="card">

<h2>
${totalTests}
</h2>

Tests

</div>



<div class="card">

<h2>
${average}%
</h2>

Average

</div>



<div class="card">

<h2>
${highest}%
</h2>

Highest

</div>



<div class="card">

<h2>
${correct}
</h2>

Correct

</div>


`;






showChart(
labels,
scores
);



showHistory();



}





function showChart(
labels,
scores
){



new Chart(

document.getElementById(
"performanceChart"
),

{


type:"line",


data:{


labels,


datasets:[{


label:
"Score %",


data:
scores,


borderColor:
"#2563eb",


backgroundColor:
"#bfdbfe"


}]


}



}

);


}







function showHistory(){



let html="";



attempts
.reverse()
.forEach(a=>{


html+=


`

<div class="history-card">


<h3>
${a.testName}
</h3>


Score:
${a.score}/${a.totalQuestions}


<br>


Percentage:
${a.percentage}%


<br>


Correct:
${a.correct}


<br>


Wrong:
${a.wrong}


<br>


Date:
${a.date}


<br><br>


<button onclick="
retake('${a.testId}')
">

Retake Test

</button>


</div>


`;



});



history.innerHTML=html;



}





function retake(id){


localStorage.setItem(
"selectedTest",
id
);



window.location.href=
"student.html";


}





loadDashboard();