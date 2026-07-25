// ========================================
// TEST SERIES ADMIN CONTROLLER
// NEW DATABASE STRUCTURE
//
// Subject
//   Topic
//      Module
//          questions[]
//          tests[]
//
// ========================================


let selectedQuestions = [];




// ========================================
// PAGE NAVIGATION
// ========================================


function openPage(id){


document
.querySelectorAll(".page")
.forEach(page=>{

page.classList.remove("active");

});


document
.getElementById(id)
.classList.add("active");



refresh();


}






// ========================================
// MODAL SYSTEM
// ========================================


function openModal(id){


let modal =
document.getElementById(id);



if(modal)

modal.style.display="flex";


}




function closeModal(id){


let modal =
document.getElementById(id);



if(modal)

modal.style.display="none";


}





window.onclick=function(e){


document
.querySelectorAll(".modal")
.forEach(modal=>{


if(e.target===modal)

modal.style.display="none";


});


}





document.addEventListener(
"keydown",
function(e){


if(e.key==="Escape"){


document
.querySelectorAll(".modal")
.forEach(modal=>{


modal.style.display="none";


});


}


});









// ========================================
// DASHBOARD
// ========================================


function updateDashboard(){


let subjects=0;

let topics=0;

let modules=0;

let questions=0;



db.subjects.forEach(subject=>{


subjects++;



subject.topics.forEach(topic=>{


topics++;



topic.modules.forEach(module=>{


modules++;


questions +=
(module.questions || []).length;



});


});


});




countSubjects.innerHTML =
subjects;


countTopics.innerHTML =
topics;


countModules.innerHTML =
modules;


countQuestions.innerHTML =
questions;



}









// ========================================
// SUBJECT MANAGEMENT
// ========================================


function saveSubject(){


let name =
subjectName.value.trim();



if(!name){

alert(
"Enter subject name"
);

return;

}



addSubject(name);



subjectName.value="";



closeModal(
"subjectModal"
);



refresh();


}





function renderSubjects(){


let html="";



db.subjects.forEach(subject=>{


html+=`

<tr>

<td>
${subject.name}
</td>


<td>
${subject.topics.length}
</td>



<td>


<button onclick="
deleteSubjectAdmin(${subject.id})
">

Delete

</button>


</td>


</tr>


`;



});



subjectTable.innerHTML =
html ||
"<tr><td colspan='3'>No Subjects</td></tr>";



}






function deleteSubjectAdmin(id){


if(confirm(
"Delete Subject?"
)){


removeSubject(id);


refresh();


}


}









// ========================================
// TOPIC MANAGEMENT
// ========================================


function openTopicModal(){


openModal(
"topicModal"
);


loadTopicSubjects();


}







function loadTopicSubjects(){


let html="";



db.subjects.forEach(subject=>{


html+=`

<option value="${subject.id}">

${subject.name}

</option>

`;



});



topicSubject.innerHTML =
html;


}






function saveTopic(){



addTopic(

topicSubject.value,

topicName.value

);



topicName.value="";



closeModal(
"topicModal"
);



refresh();


}









// ========================================
// MODULE MANAGEMENT
// ========================================


function openModuleModal(){


openModal(
"moduleModal"
);


loadModuleSubjects();


}







function loadModuleSubjects(){


let html="";



db.subjects.forEach(subject=>{


html+=`

<option value="${subject.id}">

${subject.name}

</option>

`;



});



moduleSubject.innerHTML =
html;



loadModuleTopics();


}








function loadModuleTopics(){



let subject =
getSubject(
moduleSubject.value
);



let html="";



if(subject){


subject.topics.forEach(topic=>{


html+=`

<option value="${topic.id}">

${topic.name}

</option>

`;



});


}



moduleTopic.innerHTML =
html;



}







function saveModule(){



addModule(

moduleSubject.value,

moduleTopic.value,

moduleName.value

);



moduleName.value="";



closeModal(
"moduleModal"
);



refresh();


}









// ========================================
// INITIAL DROPDOWN LOAD
// ========================================


function loadAllDropdowns(){



loadTopicSubjects();


loadModuleSubjects();


loadQuestionSubjects();


loadBuilderSubjects();



}








// ========================================
// REFRESH
// ========================================


function refresh(){


updateDashboard();


renderSubjects();


renderTopics();


renderModules();


renderQuestions();


loadAllDropdowns();


}



window.onload=function(){


refresh();


};

// ========================================
// QUESTION BANK
// ========================================



function openQuestionModal(){


openModal(
"questionModal"
);


loadQuestionSubjects();


}








// ========================================
// QUESTION DROPDOWNS
// ========================================



function loadQuestionSubjects(){


let html="";



db.subjects.forEach(subject=>{


html+=`

<option value="${subject.id}">

${subject.name}

</option>

`;



});



questionSubject.innerHTML =
html;



loadQuestionTopics();


}








function loadQuestionTopics(){


let subject =
getSubject(
questionSubject.value
);



let html="";



if(subject){



subject.topics.forEach(topic=>{


html+=`

<option value="${topic.id}">

${topic.name}

</option>

`;



});



}



questionTopic.innerHTML =
html;



loadQuestionModules();


}








function loadQuestionModules(){


let topic =
getTopic(

questionSubject.value,

questionTopic.value

);



let html="";



if(topic){



topic.modules.forEach(module=>{


html+=`

<option value="${module.id}">

${module.name}

</option>

`;



});



}



questionModule.innerHTML =
html;



}









// ========================================
// SAVE QUESTION
// ========================================



function saveQuestion(){



let data={



question:
questionText.value.trim(),



A:
optionA.value.trim(),



B:
optionB.value.trim(),



C:
optionC.value.trim(),



D:
optionD.value.trim(),



answer:
correctAnswer.value,



difficulty:
difficulty.value



};




if(!data.question){


alert(
"Enter question"
);


return;


}



addQuestion(

questionSubject.value,

questionTopic.value,

questionModule.value,

data

);





closeModal(
"questionModal"
);



clearQuestionForm();



refresh();


}









function clearQuestionForm(){


questionText.value="";


optionA.value="";


optionB.value="";


optionC.value="";


optionD.value="";



}









// ========================================
// DISPLAY QUESTION TABLE
// ========================================



function renderQuestions(){



let html="";



db.subjects.forEach(subject=>{



subject.topics.forEach(topic=>{



topic.modules.forEach(module=>{



(module.questions || [])
.forEach(question=>{





html+=`

<tr>


<td>

${question.question}

</td>


<td>

${module.name}

</td>



<td>

${question.difficulty}

</td>




<td>



<button onclick="
editQuestionOpen(
${subject.id},
${topic.id},
${module.id},
${question.id}
)
">

Edit

</button>




<button onclick="
deleteQuestionAdmin(
${subject.id},
${topic.id},
${module.id},
${question.id}
)
">

Delete

</button>



</td>



</tr>


`;




});



});



});



});





questionTable.innerHTML =
html ||
`
<tr>
<td colspan="4">
No Questions
</td>
</tr>
`;



}









// ========================================
// EDIT QUESTION
// ========================================



function editQuestionOpen(
sid,
tid,
mid,
qid
){



let module =
getModule(
sid,
tid,
mid
);



let q =
module.questions.find(
x=>x.id==qid
);



editQuestionId.value =
q.id;



editQuestionText.value =
q.question;



editOptionA.value =
q.options.A;



editOptionB.value =
q.options.B;



editOptionC.value =
q.options.C;



editOptionD.value =
q.options.D;



editCorrectAnswer.value =
q.answer;




editModal.dataset.sid=sid;

editModal.dataset.tid=tid;

editModal.dataset.mid=mid;



openModal(
"editModal"
);



}









function updateQuestion(){



let sid =
editModal.dataset.sid;



let tid =
editModal.dataset.tid;



let mid =
editModal.dataset.mid;




updateQuestionDB(
sid,
tid,
mid,
editQuestionId.value,

{

question:
editQuestionText.value,


A:
editOptionA.value,


B:
editOptionB.value,


C:
editOptionC.value,


D:
editOptionD.value,


answer:
editCorrectAnswer.value,


difficulty:"Medium"


}

);



closeModal(
"editModal"
);



refresh();


}









// ========================================
// UPDATE QUESTION HELPER
// ========================================



function updateQuestionDB(
sid,
tid,
mid,
qid,
data
){



let module =
getModule(
sid,
tid,
mid
);



let question =
module.questions.find(
q=>q.id==qid
);



if(!question)
return;



question.question =
data.question;



question.options.A =
data.A;



question.options.B =
data.B;



question.options.C =
data.C;



question.options.D =
data.D;



question.answer =
data.answer;



question.difficulty =
data.difficulty;



saveDatabase();


}









// ========================================
// DELETE QUESTION
// ========================================



function deleteQuestionAdmin(
sid,
tid,
mid,
qid
){



if(!confirm(
"Delete question?"
))

return;



let module =
getModule(
sid,
tid,
mid
);



module.questions =
module.questions.filter(
q=>q.id!=qid
);



saveDatabase();



refresh();



}

// ========================================
// TEST BUILDER
// ========================================


function loadBuilderSubjects(){


let html="";



db.subjects.forEach(subject=>{


html+=`

<option value="${subject.id}">

${subject.name}

</option>

`;



});



builderSubject.innerHTML =
html;



loadBuilderTopics();


}







function loadBuilderTopics(){


let subject =
getSubject(
builderSubject.value
);



let html="";



if(subject){


subject.topics.forEach(topic=>{


html+=`

<option value="${topic.id}">

${topic.name}

</option>

`;



});


}



builderTopic.innerHTML =
html;



loadBuilderModules();


}








function loadBuilderModules(){



let topic =
getTopic(

builderSubject.value,

builderTopic.value

);



let html="";



if(topic){


topic.modules.forEach(module=>{


html+=`

<option value="${module.id}">

${module.name}

</option>

`;



});


}



builderModule.innerHTML =
html;



loadBuilderQuestions();


}









// ========================================
// LOAD QUESTIONS FOR TEST
// ========================================



function loadBuilderQuestions(){



let module =
getModule(

builderSubject.value,

builderTopic.value,

builderModule.value

);



selectedQuestions=[];



if(!module){

builderQuestions.innerHTML="";

return;

}



displayBuilderQuestions(
module.questions
||
[]
);



}









function displayBuilderQuestions(list){



let search =
builderSearch
?
builderSearch.value.toLowerCase()
:
"";



let html="";



list.forEach(q=>{



if(
search &&
!q.question
.toLowerCase()
.includes(search)
)

return;




let checked =
selectedQuestions.includes(q.id)
?
"checked"
:
"";



html+=`

<div class="question-item">


<label>


<input

type="checkbox"

${checked}

onchange="
toggleQuestion(
${q.id},
this
)
">


${q.question}


</label>



</div>

`;



});




builderQuestions.innerHTML =
html ||
"No questions found";



selectedCount.innerHTML =
selectedQuestions.length;



}








// ========================================
// SEARCH QUESTION BUILDER
// ========================================


function searchBuilderQuestions(){


loadBuilderQuestions();


}









// ========================================
// SELECT QUESTIONS
// ========================================



function toggleQuestion(
id,
checkbox
){



if(
checkbox.checked
){


if(
!selectedQuestions.includes(id)
)

selectedQuestions.push(id);



}

else{


selectedQuestions =
selectedQuestions.filter(
x=>x!=id
);



}



selectedCount.innerHTML =
selectedQuestions.length;



}









// ========================================
// RANDOM QUESTION PICK
// ========================================



function randomSelectQuestions(){



let module =
getModule(

builderSubject.value,

builderTopic.value,

builderModule.value

);



if(!module)
return;



let count =
Number(
randomCount.value
);



if(!count ||
count<=0
){

alert(
"Enter random count"
);

return;

}



let questions =
[...module.questions];



questions.sort(
()=>Math.random()-0.5
);



selectedQuestions =
questions
.slice(0,count)
.map(
q=>q.id
);



loadBuilderQuestions();



}









// ========================================
// CREATE TEST
// ========================================



function createTest(){



if(
selectedQuestions.length===0
){


alert(
"Select questions"
);


return;


}



addTest(


builderSubject.value,


builderTopic.value,


builderModule.value,


{


title:
testName.value,


duration:
testDuration.value,


questionIds:
selectedQuestions



}



);



alert(
"Test Created Successfully"
);



testName.value="";



selectedQuestions=[];



refresh();



}









// ========================================
// TEST LIST (OPTIONAL DISPLAY)
// ========================================



function renderTests(){



let html="";



db.subjects.forEach(subject=>{


subject.topics.forEach(topic=>{


topic.modules.forEach(module=>{


module.tests.forEach(test=>{


html+=`

<tr>


<td>
${test.title}
</td>


<td>
${module.name}
</td>


<td>
${test.questionIds.length}
</td>



</tr>

`;



});



});



});



});



if(
document.getElementById("testTable")
)

testTable.innerHTML =
html;



}









// ========================================
// RESTORE FILE
// ========================================


if(
typeof restoreFile !== "undefined"
){



restoreFile.onchange=function(e){


let file =
e.target.files[0];



if(file)


restoreBackup(file);



};



}









// ========================================
// GLOBAL EVENTS
// ========================================



if(builderSubject)

builderSubject.onchange =
loadBuilderTopics;



if(builderTopic)

builderTopic.onchange =
loadBuilderModules;



if(builderModule)

builderModule.onchange =
loadBuilderQuestions;



if(builderSearch)

builderSearch.onkeyup =
searchBuilderQuestions;









// ========================================
// FINAL INIT
// ========================================



window.onload=function(){


loadDatabase();


refresh();



};

function renderTopics(){


let html="";


db.subjects.forEach(subject=>{


subject.topics.forEach(topic=>{


html+=`

<tr>

<td>
${subject.name}
</td>


<td>
${topic.name}
</td>


<td>
${topic.modules.length}
</td>


<td>

<button onclick="
deleteTopicAdmin(
${subject.id},
${topic.id}
)
">

Delete

</button>


</td>


</tr>

`;


});


});



topicTable.innerHTML =
html ||
`
<tr>
<td colspan="4">
No Topics
</td>
</tr>
`;

}

function deleteTopicAdmin(
sid,
tid
){


if(!confirm("Delete Topic?"))
return;



removeTopic(
sid,
tid
);



refresh();


}
function renderModules(){


let html="";


db.subjects.forEach(subject=>{


subject.topics.forEach(topic=>{


topic.modules.forEach(module=>{


html+=`

<tr>


<td>
${subject.name}
</td>


<td>
${topic.name}
</td>


<td>
${module.name}
</td>


<td>
${module.questions ? module.questions.length : 0}
</td>


<td>

<button onclick="
deleteModuleAdmin(
${subject.id},
${topic.id},
${module.id}
)
">

Delete

</button>

</td>


</tr>


`;



});


});


});



moduleTable.innerHTML =
html ||
`
<tr>
<td colspan="5">
No Modules
</td>
</tr>
`;



}
function deleteModuleAdmin(
sid,
tid,
mid
){


if(!confirm("Delete Module?"))
return;



removeModule(
sid,
tid,
mid
);



refresh();


}