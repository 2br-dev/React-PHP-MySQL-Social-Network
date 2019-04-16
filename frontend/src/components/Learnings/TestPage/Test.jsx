import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import styled from 'styled-components';
import { fetchSingleQuestion } from '../../Effects/fetches';
import Loader from '../../Loader/Loader';
import { connect } from 'react-redux';
import Question from './Question';
import Circles from './Circles';
import Legend from './Legend';
import { updateResult, finishTest } from '../../Effects/requests';
import Finish from './Finish';

function Test({ store, object }) {
  // eslint-disable-next-line
  const [_, updateState] = useState(0);
  const [variants, setVariants] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [allQuestionsId, setAllQuestionsId] = useState([]);
  const [question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skipped, setSkipped] = useState([]);
  const [answered, setAnswered] = useState([]);
  const [finished, setFinished] = useState(false);
  const [test, setTest] = useState([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const allQuestionsId = store.tests[0].questions.split(',');
    setTest(store.tests[0]);
    setAllQuestionsId(allQuestionsId);
    async function fetchData() {
      const response = await fetchSingleQuestion(allQuestionsId[questionNumber]);
      await setQuestion(response);
      await getVariants(response); 
      if (loading) await setLoading(false);
    }
    fetchData();
  }, [questionNumber]);

  useEffect(() => {
    const allQuestionsId = store.tests[0].questions.split(',');
    if (object && object.length > 1) loadSave(object, allQuestionsId);
  }, []);

  function pauseTest() {
    setPaused(true);
  }

  function resumeTest() {
    setPaused(false);
  }

  function loadSave(save, allQuestionsId) {
    let idArray = save[1].answered;
    let result = [];

    for (let i = 0; i < idArray.length; i++) {
      for (let j = 0; j < allQuestionsId.length; j++) {
        if (idArray[i] === allQuestionsId[j]) {
          result.push(j);
          continue;
        }
      }
    }

    setAnswered(result);

    let next = 0;

    for (let i = 0; i < result.length; i++) {
      if (!allQuestionsId.includes(i)) {
        next = i;
      } else {
        next = i + 1;
      }
    }
    setQuestionNumber(next);
  }

  function getVariants(question) {
    const splitted = question[0].variants.split("\n");
    let variants = [];
    splitted.forEach((item, i) => {
      variants.push({
        id: i,
        item: item,
        checked: false
      })
    })
    setVariants(variants);
  }

  function setChecked(id) {
    let newVariants = variants;

    if (!question[0].answers) {
      newVariants.forEach(variant => {
        variant.checked = false;
      });
    }

    newVariants[id].checked = !newVariants[id].checked;
    setVariants(newVariants);
    updateState(Math.random());
  }

  function nextQuestion() {
    let newState = answered;
    if (!answered.includes(questionNumber)) {
      newState.push(questionNumber);
      setAnswered(newState);
    }
    updateTestResult();
    getNextStep(questionNumber);
  }

  function prevQuestion() {
    setQuestionNumber(questionNumber - 1);
  }

  function skipQuestion() {
    let newState = skipped;
    if (!skipped.includes(questionNumber)) {
      newState.push(questionNumber);
      setSkipped(newState);
    }
    getNextStep(questionNumber);
  }

  function getNextStep() {
    if (allQuestionsId.length === answered.length) {
      finish();
      return;
    }

    let next = questionNumber;

    if (answered.includes(next)) {
      next = Math.max(...answered);
    }

    if (next + 1 === allQuestionsId.length) {
      for (let i = 0; i < allQuestionsId.length; i++) {
        if (!answered.includes(i)) {
          next = i;
          break;
        }
      }
      setQuestionNumber(next);
    } else {
      setQuestionNumber(next + 1);
    }
  }

  async function finish() {
    const test = await store.tests[0];
    const testData = {
      id: test.id,
      estimated_time: document.getElementById('timer') ? document.getElementById('timer').innerHTML : 0
    }

    await finishTest(testData);
    await setFinished(true);
  }

  async function updateTestResult() {
    const test = await store.tests[0];
    const checkedVariants = variants.filter(variant => variant.checked);
    const checked = [];

    checkedVariants.forEach(variant => {
      checked.push(variant.item);
    })

    const testData = {
      question_id: allQuestionsId[questionNumber],
      test_id: test.id,
      variants: checked,
      estimated_time: document.getElementById('timer') ? document.getElementById('timer').innerHTML : 0
    }

    updateResult(testData);
  }

  function findTimer() {
    return !Array.isArray(test) && !test.estimated_time.includes('false');
  }

  return (
    <Container>
      {!finished && findTimer()
        ? <Timer style={`${loading ? { opacity: 0 } : { opacity: 1 }}`} pauseTest={pauseTest} resumeTest={resumeTest} finish={finish} />
        : null}

      {loading
        ? <Loader minHeight='45vh' />
        : (
          !finished ?
            <QuestionWrapper>
              <Question
                question={question[0]}
                questionNumber={questionNumber}
                nextQuestion={nextQuestion}
                prevQuestion={prevQuestion}
                skipQuestion={skipQuestion}
                setChecked={setChecked}
                variants={variants}
                answered={answered}
                allQuestionsId={allQuestionsId}
                findTimer={findTimer}
                paused={paused}
              />
              <div style={{ width: '25%' }}>
                <Legend />
                <hr></hr>
                <Circles
                  skipped={skipped}
                  answered={answered}
                  questions={allQuestionsId}
                />
              </div>
            </QuestionWrapper>
            : <Finish />
        )}
    </Container>
  )
}

const Container = styled.div`
  width: 1000px;
  margin-top: -50px;
  min-height: 75vh;
  padding: 30px 35px;
`;
const QuestionWrapper = styled.div`
  display: flex;

  hr {
    background: #f5f5f5;
    border: none;
    height: 2px;
    margin-bottom: 30px;
  }
`;

export default connect(
  state => ({ store: state })
)(Test);