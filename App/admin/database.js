// =====================================
// TEST SERIES DATABASE ENGINE
// MODULE BASED QUESTION BANK
// =====================================


const DB_KEY = "testSeriesDB";



let db = {

subjects:[]

};




// =====================================
// LOAD DATABASE
// =====================================


function loadDatabase(){


try{


let data =
localStorage.getItem(DB_KEY);



if(data){


db =
normalizeDatabase(
JSON.parse(data)
);


}


}

catch(error){


console.error(
"Database Load Error",
error
);



db={
subjects:[]
};


}



}







// =====================================
// SAVE DATABASE
// =====================================


function saveDatabase(){


localStorage.setItem(

DB_KEY,

JSON.stringify(db)

);


}







// =====================================
// NORMALIZE OLD DATABASE
// =====================================


function normalizeDatabase(data){



if(!data.subjects)

data.subjects=[];



data.subjects.forEach(subject=>{


if(!subject.id)

subject.id=generateId();



if(!subject.topics)

subject.topics=[];



subject.topics.forEach(topic=>{


if(!topic.id)

topic.id=generateId();



if(!topic.modules)

topic.modules=[];



topic.modules.forEach(module=>{


if(!module.id)

module.id=generateId();



if(!module.questions)

module.questions=[];



if(!module.tests)

module.tests=[];



module.questions.forEach(q=>{


if(!q.id)

q.id=generateId();



});



module.tests.forEach(test=>{


if(!test.id)

test.id=generateId();



if(!test.questionIds){



// OLD SUPPORT

if(test.questions){


test.questionIds =
test.questions.map(
q=>q.id
);


}

else{


test.questionIds=[];


}


}



});


});


});


});



return data;


}







// =====================================
// ID
// =====================================


function generateId(){


return Date.now()
+
Math.floor(
Math.random()*9999
);


}







// =====================================
// SUBJECT CRUD
// =====================================



function addSubject(name){



db.subjects.push({

id:generateId(),

name:name,

topics:[]

});



saveDatabase();


}






function updateSubject(id,name){



let subject =
getSubject(id);



if(subject){


subject.name=name;


saveDatabase();


}



}





function removeSubject(id){


db.subjects =
db.subjects.filter(
s=>s.id!=id
);



saveDatabase();


}









// =====================================
// TOPIC CRUD
// =====================================



function addTopic(
subjectId,
name
){



let subject =
getSubject(subjectId);



if(!subject)
return;



subject.topics.push({


id:generateId(),

name:name,

modules:[]


});



saveDatabase();


}








function updateTopic(
subjectId,
topicId,
name
){



let topic =
getTopic(
subjectId,
topicId
);



if(topic){


topic.name=name;


saveDatabase();


}


}








function removeTopic(
subjectId,
topicId
){



let subject =
getSubject(subjectId);



if(subject){


subject.topics =
subject.topics.filter(
t=>t.id!=topicId
);


saveDatabase();


}



}









// =====================================
// MODULE CRUD
// =====================================



function addModule(
subjectId,
topicId,
name
){



let topic =
getTopic(
subjectId,
topicId
);



if(!topic)
return;



topic.modules.push({

id:generateId(),

name:name,


questions:[],


tests:[]


});



saveDatabase();


}









function updateModule(
subjectId,
topicId,
moduleId,
name
){



let module =
getModule(
subjectId,
topicId,
moduleId
);



if(module){


module.name=name;


saveDatabase();


}



}









function removeModule(
subjectId,
topicId,
moduleId
){



let topic =
getTopic(
subjectId,
topicId
);



if(topic){


topic.modules =
topic.modules.filter(
m=>m.id!=moduleId
);



saveDatabase();


}



}









// =====================================
// QUESTION BANK
// =====================================



function addQuestion(
subjectId,
topicId,
moduleId,
data
){



let module =
getModule(
subjectId,
topicId,
moduleId
);



if(!module)
return;



module.questions.push({


id:generateId(),


question:data.question,


options:{


A:data.A,

B:data.B,

C:data.C,

D:data.D


},



answer:data.answer,


difficulty:
data.difficulty ||
"Medium",



explanation:
data.explanation ||
""



});



saveDatabase();


}









function updateQuestion(
subjectId,
topicId,
moduleId,
questionId,
data
){



let module =
getModule(
subjectId,
topicId,
moduleId
);



let q =
module.questions.find(
x=>x.id==questionId
);



if(q){


q.question=data.question;


q.options.A=data.A;

q.options.B=data.B;

q.options.C=data.C;

q.options.D=data.D;


q.answer=data.answer;


q.difficulty=data.difficulty;



saveDatabase();


}



}









function deleteQuestion(
subjectId,
topicId,
moduleId,
questionId
){



let module =
getModule(
subjectId,
topicId,
moduleId
);



if(module){


module.questions =
module.questions.filter(
q=>q.id!=questionId
);



saveDatabase();


}



}









// =====================================
// TEST CRUD
// =====================================



function addTest(
subjectId,
topicId,
moduleId,
data
){



let module =
getModule(
subjectId,
topicId,
moduleId
);



if(!module)
return;



module.tests.push({


id:generateId(),


title:data.title,


duration:
Number(data.duration)||30,


marks:
Number(data.marks)||0,


negative:
Number(data.negative)||0,


difficulty:
data.difficulty ||
"Mixed",



status:"Draft",



questionIds:
data.questionIds || []



});



saveDatabase();


}








function updateTest(
subjectId,
topicId,
moduleId,
testId,
data
){



let module =
getModule(
subjectId,
topicId,
moduleId
);



let test =
module.tests.find(
t=>t.id==testId
);



if(test){


Object.assign(
test,
data
);


saveDatabase();


}



}









function deleteTest(
subjectId,
topicId,
moduleId,
testId
){



let module =
getModule(
subjectId,
topicId,
moduleId
);



module.tests =
module.tests.filter(
t=>t.id!=testId
);



saveDatabase();


}









// =====================================
// FINDERS
// =====================================



function getSubject(id){


return db.subjects.find(
s=>s.id==id
);


}





function getTopic(
subjectId,
topicId
){


let subject =
getSubject(subjectId);



return subject?.topics.find(
t=>t.id==topicId
);



}







function getModule(
subjectId,
topicId,
moduleId
){



let topic =
getTopic(
subjectId,
topicId
);



return topic?.modules.find(
m=>m.id==moduleId
);



}









function findTest(testId){



for(let s of db.subjects){


for(let t of s.topics){


for(let m of t.modules){



let test =
m.tests.find(
x=>x.id==testId
);



if(test)

return test;



}


}


}



return null;


}









// =====================================
// EXPORT BACKUP
// =====================================



function exportBackup(){



let blob =
new Blob(

[
JSON.stringify(
db,
null,
2
)

],

{
type:"application/json"
}

);



let link =
document.createElement("a");



link.href =
URL.createObjectURL(blob);



link.download =
"test-series-backup.json";



link.click();


}









// =====================================
// RESTORE BACKUP
// =====================================



function restoreBackup(file){



let reader =
new FileReader();



reader.onload=function(){



try{


let data =
JSON.parse(
reader.result
);



if(!data.subjects)

throw "Invalid";



db =
normalizeDatabase(data);



saveDatabase();



alert(
"Restore Successful"
);



location.reload();



}

catch(e){


alert(
"Invalid JSON"
);



}



};



reader.readAsText(file);


}









// =====================================
// INIT
// =====================================


loadDatabase();