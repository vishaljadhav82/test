// =======================================
// TEST SERIES MANAGER
// LOCAL STORAGE DATABASE ENGINE
// =======================================


// DATABASE

let db = JSON.parse(
    localStorage.getItem("testSeriesDB")
) || {

    subjects:[]

};



// =======================================
// STORAGE
// =======================================


function saveDB(){

    localStorage.setItem(
        "testSeriesDB",
        JSON.stringify(db)
    );

    refresh();

}





// UNIQUE ID

function uid(){

    return Date.now() + Math.floor(Math.random()*1000);

}





// =======================================
// PAGE NAVIGATION
// =======================================


function showSection(id){


    document
    .querySelectorAll(".section")
    .forEach(sec=>{

        sec.classList.remove("active");

    });



    document
    .getElementById(id)
    .classList.add("active");


}





// =======================================
// SUBJECT CRUD
// =======================================


function saveSubject(){


let name =
subjectInput.value.trim();



if(!name){

alert("Enter subject name");

return;

}



db.subjects.push({

id:uid(),

name:name,

topics:[]

});


subjectInput.value="";


saveDB();


}





function deleteSubject(id){


if(!confirm(
"Delete subject and all data?"
))
return;



db.subjects =
db.subjects.filter(
s=>s.id!=id
);


saveDB();


}





// =======================================
// TOPIC CRUD
// =======================================



function saveTopic(){


let sid =
topicSubjectSelect.value;


let subject =
db.subjects.find(
s=>s.id==sid
);



if(!topicInput.value.trim())
return;



subject.topics.push({

id:uid(),

name:
topicInput.value,

modules:[]

});


topicInput.value="";


saveDB();


}






function deleteTopic(sid,tid){


let subject =
db.subjects.find(
s=>s.id==sid
);



subject.topics =
subject.topics.filter(
t=>t.id!=tid
);


saveDB();


}






// =======================================
// MODULE CRUD
// =======================================


function saveModule(){


let subject =
db.subjects.find(
s=>s.id==moduleSubjectSelect.value
);



let topic =
subject.topics.find(
t=>t.id==moduleTopicSelect.value
);



topic.modules.push({

id:uid(),

name:
moduleInput.value,

tests:[]

});



moduleInput.value="";


saveDB();



}





function deleteModule(
sid,
tid,
mid
){


let subject =
db.subjects.find(
s=>s.id==sid
);



let topic =
subject.topics.find(
t=>t.id==tid
);



topic.modules =
topic.modules.filter(
m=>m.id!=mid
);



saveDB();


}







// =======================================
// TEST CRUD
// =======================================


function saveTest(){



let subject =
db.subjects.find(
s=>s.id==testSubjectSelect.value
);



let topic =
subject.topics.find(
t=>t.id==testTopicSelect.value
);



let module =
topic.modules.find(
m=>m.id==testModuleSelect.value
);




module.tests.push({

id:uid(),

name:
testInput.value,


duration:
testDuration.value,


questions:[]

});



testInput.value="";

testDuration.value="";


saveDB();



}





function deleteTest(
sid,
tid,
mid,
testid
){



let subject =
db.subjects.find(
s=>s.id==sid
);


let topic =
subject.topics.find(
t=>t.id==tid
);


let module =
topic.modules.find(
m=>m.id==mid
);



module.tests =
module.tests.filter(
t=>t.id!=testid
);



saveDB();



}







// =======================================
// MCQ CRUD
// =======================================



function saveMCQ(){


let testId =
mcqTestSelect.value;


let test;



db.subjects.forEach(s=>{

s.topics.forEach(t=>{

t.modules.forEach(m=>{


let found =
m.tests.find(
x=>x.id==testId
);


if(found)
test=found;


});

});

});




test.questions.push({

id:uid(),


question:
questionInput.value,


options:{


A:option1.value,

B:option2.value,

C:option3.value,

D:option4.value


},


answer:
answerSelect.value


});



questionInput.value="";

option1.value="";

option2.value="";

option3.value="";

option4.value="";


saveDB();



}







function deleteMCQ(
testid,
qid
){


let test;



db.subjects.forEach(s=>{

s.topics.forEach(t=>{

t.modules.forEach(m=>{


let found =
m.tests.find(
x=>x.id==testid
);


if(found)
test=found;


});

});

});



test.questions =
test.questions.filter(
q=>q.id!=qid
);



saveDB();


}







// =======================================
// DROPDOWNS
// =======================================


function loadDropdowns(){



let subjects="";


db.subjects.forEach(s=>{


subjects+=`

<option value="${s.id}">
${s.name}
</option>

`;

});



topicSubjectSelect.innerHTML=subjects;

moduleSubjectSelect.innerHTML=subjects;

testSubjectSelect.innerHTML=subjects;






updateTopics();


}






function updateTopics(){



let sid =
moduleSubjectSelect.value;



let subject =
db.subjects.find(
s=>s.id==sid
);



if(!subject)
return;



let html="";


subject.topics.forEach(t=>{


html+=`

<option value="${t.id}">
${t.name}
</option>

`;

});



moduleTopicSelect.innerHTML=html;

testTopicSelect.innerHTML=html;



updateModules();


}





function updateModules(){


let subject =
db.subjects.find(
s=>s.id==testSubjectSelect.value
);



if(!subject)
return;



let topic =
subject.topics.find(
t=>t.id==testTopicSelect.value
);



if(!topic)
return;



let html="";


topic.modules.forEach(m=>{


html+=`

<option value="${m.id}">
${m.name}
</option>

`;

});



testModuleSelect.innerHTML=html;



updateTests();



}






function updateTests(){


let html="";



db.subjects.forEach(s=>{

s.topics.forEach(t=>{

t.modules.forEach(m=>{

m.tests.forEach(test=>{


html+=`

<option value="${test.id}">
${test.name}
</option>

`;


});


});


});


});



mcqTestSelect.innerHTML=html;


}







// =======================================
// DISPLAY
// =======================================


function render(){


let html="";



db.subjects.forEach(s=>{


html+=`

<div class="card">

<h3>
${s.name}

<button 
class="deleteBtn smallBtn"
onclick="deleteSubject(${s.id})">

Delete

</button>

</h3>

`;



s.topics.forEach(t=>{


html+=`

<p>
<b>Topic:</b>
${t.name}
</p>

`;



t.modules.forEach(m=>{


html+=`

<p>
<b>Module:</b>
${m.name}
</p>

`;



m.tests.forEach(test=>{


html+=`

<p>
<b>Test:</b>
${test.name}

(${test.questions.length} Questions)

</p>

`;



});


});


});



html+="</div>";



});



dashboardData.innerHTML=html;


subjectList.innerHTML=html;


}




// =======================================
// DASHBOARD
// =======================================


function statistics(){


let subjects=
db.subjects.length;


let tests=0;

let mcq=0;



db.subjects.forEach(s=>{

s.topics.forEach(t=>{

t.modules.forEach(m=>{

m.tests.forEach(test=>{


tests++;


mcq +=
test.questions.length;



});


});


});


});



totalSubjects.innerHTML=subjects;

totalTests.innerHTML=tests;

totalMCQ.innerHTML=mcq;


}







// =======================================
// SEARCH
// =======================================


function searchData(){


let key =
searchBox.value.toLowerCase();



document
.querySelectorAll(".card")
.forEach(card=>{


card.style.display =
card.innerText
.toLowerCase()
.includes(key)
?
"block"
:
"none";


});


}








// =======================================
// BACKUP
// =======================================


function exportData(){


let data =
JSON.stringify(db);



let blob =
new Blob(
[data],
{
type:"application/json"
}
);



let a =
document.createElement("a");


a.href =
URL.createObjectURL(blob);


a.download =
"test-series-backup.json";


a.click();


}





function importData(){


importFile.click();



}




importFile.onchange=function(e){


let file =
e.target.files[0];


let reader =
new FileReader();



reader.onload=function(){


db =
JSON.parse(
reader.result
);


saveDB();


alert(
"Backup restored"
);


};


reader.readAsText(file);


}








// =======================================
// INIT
// =======================================



function refresh(){


render();

statistics();

loadDropdowns();


}



topicSubjectSelect.onchange =
updateTopics;


moduleSubjectSelect.onchange =
updateTopics;


testSubjectSelect.onchange =
updateTopics;


testTopicSelect.onchange =
updateModules;



refresh();


// =======================================
// VALIDATION HELPERS
// =======================================


function exists(arr,name){

    return arr.some(
        x =>
        x.name.toLowerCase()
        ===
        name.toLowerCase()
    );

}




function empty(value){

    return !value ||
    value.trim()==="";

}



// =======================================
// BETTER NOTIFICATION
// =======================================


function notify(msg){

    alert(msg);

}

function renderMCQList(){


let html="";


db.subjects.forEach(s=>{

s.topics.forEach(t=>{

t.modules.forEach(m=>{

m.tests.forEach(test=>{


test.questions.forEach((q,index)=>{


html+=`

<table>


<tr>

<th>
Question
</th>


<th>
Answer
</th>


<th>
Action
</th>


</tr>


<tr>


<td>

${index+1}.
${q.question}

<br>

A:
${q.options.A}

<br>

B:
${q.options.B}

<br>

C:
${q.options.C}

<br>

D:
${q.options.D}


</td>



<td>

${q.answer}

</td>



<td>


<button
class="deleteBtn"
onclick="
deleteMCQ(
${test.id},
${q.id}
)
">

Delete

</button>


</td>



</tr>


</table>


`;



});


});


});


});


});



mcqList.innerHTML =
html ||
"<p>No questions added</p>";

}