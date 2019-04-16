import API from '../functions/API';

export async function fetchMistakes() {
  let result = [];

  await fetch(`${API}/api/mistake/read.php`)
    .then(response => response.json())
    .then(mistakes => result = mistakes.data)
    .catch(err => console.log(err))
  
  return await result;
}

export async function fetchTests() {
  let result = [];

  await fetch(`${API}/api/test/read.php`)
    .then(response => response.json())
    .then(res => result = res.data)
    .catch(err => console.log(err))
  
  return await result;
}

export async function fetchTestsById() {
  let result = [];

  await fetch(`${API}/api/test/read.php?byid=true`)
    .then(response => response.json())
    .then(res => result = res.data)
    .catch(err => console.log(err))
  
  return await result;
}

export async function fetchQuestions() {
  let result = [];

  await fetch(`${API}/api/question/read.php`)
    .then(response => response.json())
    .then(res => result = res.data)
    .catch(err => console.log(err))
  
  return await result;
}

export async function fetchCategories() {
  let result = [];

  await fetch(`${API}/api/getCategories.php`)
    .then(response => response.json())
    .then(res => result = res)
    .catch(err => console.log(err))
  
  return await result;
}

export async function fetchTestLastId() {
  let result = '';

  await fetch(`${API}/api/test/getLastId.php`)
    .then(response => response.json())
    .then(res => result = res)
    .catch(err => console.log(err))
  
  return await result;
}

export async function fetchSingleTest(id) {
  let result = [];

  await fetch(`${API}/api/test/getSingleTest.php?id=${id}`)
    .then(response => response.json())
    .then(res => result = res.data)
    .catch(err => console.log(err))
  
  return await result;
}

export async function fetchSingleQuestion(id) {
  let result = [];

  await fetch(`${API}/api/question/getSingleQuestion.php?id=${id}`)
    .then(response => response.json())
    .then(res => result = res.data)
    .catch(err => console.log(err))
  
  return await result;
}

export async function fetchTestStatus(id) {
  let result = [];

  await fetch(`${API}/api/test/getStatus.php?id=${id}`)
    .then(response => response.json())
    .then(res => result = res.data)
    .catch(err => console.log(err))
  
  return await result;
}

export default [];