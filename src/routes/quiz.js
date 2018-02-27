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


// returns a promise which resolves when data is fetched from all source apis and the data is reformatted into the required form
const getQuestions = () => {
  const promiseGetandFormatData = new Promise((resolve, reject) => {
    const getquestionset = rp('https://5gj1qvkc5h.execute-api.us-east-1.amazonaws.com/dev/allQuestions');
    getquestionset.then((bookdetails) => {
      const questionsArray = JSON.parse(bookdetails).allQuestions;
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
            response(msg).code(200);
          }).catch(error => console.log(error.message));
          // response(datatosend).code(200);
        } else {
          console.log('data', data.length);
          const datatosend = [];
          for (let i = 0; i < data.length; i += 1) {
            const obj = {
              question: data[i].question,
              questionId: data[i].questionId,
              option1: data[i].option1,
              option2: data[i].option2,
              option3: data[i].option3,
              option4: data[i].option4,
            };
            datatosend.push(obj);
          }
          console.log(datatosend);
          response(datatosend).code(200);
        }
      });
    },
  },

];

