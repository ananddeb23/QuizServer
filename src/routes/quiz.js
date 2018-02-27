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
    path: '/updateresponse/{username}/{qid}/{ans}',
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

];

