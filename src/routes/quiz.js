const rp = require('request-promise');
const model = require('../../models');
require('es6-promise');

const url2 = 'https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/findAnswerById/';

// returns an array of promises to get ratings for each book id
const getpromisesquestionanswers = (questionsArray) => {
  const questionanswerspromisesresult = [];
  for (let i = 0; i < questionsArray.length; i += 1) {
    questionanswerspromisesresult.push(rp(`${url2}${questionsArray[i].questionId}`));
  }
  return questionanswerspromisesresult;
};

const ansobjectfromresult = (ans, quesarr) => {
  const ansarray = [];
  for (let i = 0; i < quesarr.length; i += 1) {
    ansarray.push({ questionId: quesarr[i].questionId, answer: JSON.parse(ans[i]).answer });
  }
  return ansarray;
};


// returns a promise which resolves when data is sucessfully inserted in the database

const insertquestionsAndAnswersindb = (questionsArray, ansArray) => {
  const promiseinsertdb1 = new Promise((resolve, reject) => {
    model.myquestions.destroy({ where: {} }).then(() => {
      model.myquestions.bulkCreate(questionsArray).then(() => {
        resolve('questions');
      });
    });
  });
  const promiseinsertdb2 = new Promise((resolve, reject) => {
    model.myanswers.destroy({ where: {} }).then(() => {
      model.myanswers.bulkCreate(ansArray).then(() => {
        console.log('here');
        resolve('answers');
      });
    });
  });
  return Promise.all([promiseinsertdb1, promiseinsertdb2]);
};

const insertintoScores = (uname, score) => {
  const promiseinsertuserscore = new Promise((resolve, reject) => {
    model.userscores.destroy({
      where: {
        uname,

      },
    }).then((data) => {
      model.userscores.create(({
        uname,
        score,

      })).then((data2) => {
        resolve(('response-updated')).code(200);
      });
    });
  });

  return promiseinsertuserscore;
};
const getscore = (datafromserver, datafromuser) => {
  let score = 0;
  console.log('dtahh', datafromserver);
  console.log('dtahfffh', datafromuser);
  if (datafromserver.length !== datafromuser.length) {
    return score;
  }
  for (let i = 0; i < datafromserver.length; i++) {
    const currkey = datafromserver[i].questionId;
    for (let j = 0; j < datafromuser.length; j++) {
      const userkey = datafromuser[j].questionId;
      if (currkey === userkey) {
        if (datafromserver[i].answer === datafromuser[j].answer) {
          score += 1;
        } else {
          j = datafromuser.length;
        }
      }
    }
  }
  // console.log(score);
  return score;
  // for(let i=0; i<datafromserver.length){
  //   if(storeserverans[])
  // }
};

// returns a promise which resolves when data is fetched from all source apis and the data is reformatted into the required form
const getQuestions = () => {
  const promiseGetandFormatData = new Promise((resolve, reject) => {
    const getquestionset = rp('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allQuestions');
    getquestionset.then((bookdetails) => {
      let questionsArray = JSON.parse(bookdetails).allQuestions;
      const finalquestionsArray = [];
      for (let i = 0; i < questionsArray.length; i++) {
        const obj = {
          question: questionsArray[i].question,
          questionId: questionsArray[i].questionId,
          options: [questionsArray[i].option1, questionsArray[i].option2,
            questionsArray[i].option3, questionsArray[i].option4],

        };
        finalquestionsArray.push(obj);
      }
      questionsArray = finalquestionsArray;
      const questionsanspromises = getpromisesquestionanswers(questionsArray);
      Promise.all(questionsanspromises).then((answersarray) => {
        const ansobj = ansobjectfromresult(answersarray, questionsArray);
        // console.log(questionsArray);
        // console.log(ansobj);
        insertquestionsAndAnswersindb(questionsArray, ansobj).then((msg) => {
          resolve(questionsArray);
        });
      });
    }).catch(() => { reject(new Error('failed in getting and inserting data')); });
  });
  return promiseGetandFormatData;
};


module.exports = [

  {
    method: 'GET',
    path: '/getQuestions',
    handler: (request, response) => {
      model.myquestions.findAll().then((data) => {
        if (data.length === 0) {
          getQuestions().then((msg) => {
            console.log('mas', msg);
            response(JSON.stringify(msg)).code(201);
          }).catch(error => console.log(error.message));
          // response(datatosend).code(200);
        } else {
          console.log('data', data.length);
          const datatosend = [];
          for (let i = 0; i < data.length; i += 1) {
            const obj = {
              question: data[i].question,
              questionId: data[i].questionId,
              options: data[i].options,

            };
            datatosend.push(obj);
          }
          console.log(datatosend);
          response(JSON.stringify(datatosend)).code(200);
        }
      });
    },
  },
  {
    method: 'GET',
    path: '/updateResponse/{username}/{qid}/{ans}',
    handler: (request, response) => {
      model.useranswers.destroy({
        where: {
          uname: request.params.username,
          questionId: request.params.qid,
        },
      }).then((data) => {
        model.useranswers.create(({
          questionId: request.params.qid,
          uname: request.params.username,
          answer: request.params.ans,
        })).then((data2) => {
          response(JSON.stringify('response-updated')).code(200);
        });
        // console.log(datatosend);
        // response(JSON.stringify(datatosend)).code(200);
      });
    },
  },
  {
    method: 'GET',
    path: '/getPreviousReponse/{username}',
    handler: (request, response) => {
      model.useranswers.findAll({
        where: {
          uname: request.params.username,

        },
      }).then((data) => {
        const datatosend = [];
        for (let i = 0; i < data.length; i += 1) {
          const obj = {
            uname: data[i].uname,
            questionId: data[i].questionId,
            answer: data[i].answer,
          };
          datatosend.push(obj);
        }

        // console.log(datatosend);
        response(JSON.stringify(datatosend)).code(200);
      });
    },
  },
  {
    method: 'GET',
    path: '/calculateScore/{username}',
    handler: (request, response) => {
      model.myanswers.findAll().then((data) => {
        const datafromserver = [];
        for (let i = 0; i < data.length; i += 1) {
          const obj = {

            questionId: data[i].questionId,
            answer: data[i].answer,
          };
          datafromserver.push(obj);
        }
        console.log(datafromserver);
        model.useranswers.findAll({
          where: {
            uname: request.params.username,

          },
        }).then((data) => {
          const datafromuser = [];
          for (let i = 0; i < data.length; i += 1) {
            const obj = {

              questionId: data[i].questionId,
              answer: data[i].answer,
            };
            datafromuser.push(obj);
          }
          const score = getscore(datafromserver, datafromuser);
          // console.log(datatosend);
          insertintoScores(request.params.username, score).then((msg) => {
            response(JSON.stringify(score)).code(200);
          });
        });
        // console.log(datatosend);
      });
    },
  },

];

