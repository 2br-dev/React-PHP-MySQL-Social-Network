import $ from 'jquery';
import API from '../functions/API';

export function startTest(id) {
  const formData = new FormData();
  formData.append('id', id);
  $.ajax({
    url: `${API}/api/test/start.php`,
    data: formData,
    processData: false,
    contentType: false,
    type: 'POST',
    success: res => {
      console.log(res)
    },
    error: err => console.log(err)
  });
}

export function setupResult(data) {
  const formData = new FormData();
  formData.append('test_id', data.test_id);
  formData.append('user_id', data.user_id);
  formData.append('user_name', data.user_name);
  formData.append('date', data.date);
  formData.append('estimated_time', data.estimated_time);

  $.ajax({
    url: `${API}/api/result/init.php`,
    data: formData,
    processData: false,
    contentType: false,
    type: 'POST',
    success: res => {
      console.log(res)
    },
    error: err => console.log(err)
  });
}

export function updateResult(data) {
  const formData = new FormData();
  formData.append('test_id', data.test_id);
  formData.append('variants', data.variants);
  formData.append('estimated_time', data.estimated_time);
  formData.append('question_id', data.question_id);

  $.ajax({
    url: `${API}/api/result/update.php`,
    data: formData,
    processData: false,
    contentType: false,
    type: 'POST',
    error: err => console.log(err)
  });
}

export function finishTest(data) {
  const formData = new FormData();
  formData.append('id', data.id);
  formData.append('estimated_time', data.estimated_time);

  $.ajax({
    url: `${API}/api/test/finish.php`,
    data: formData,
    processData: false,
    contentType: false,
    type: 'POST',
    success: res => console.log(res),
    error: err => console.log(err)
  });
}

export async function createEvent(data) {
  const formData = new FormData();
  
  for (let key in data) {
    formData.append(key, data[key]);    
  }
  let result;
  
  await $.ajax({
    url: `${API}/api/calendar/addEvent.php`,
    data: formData,
    processData: false,
    contentType: false,
    type: 'POST',
    success: async (res) => {
      result = await res;
    }
  }); 

  return await result;
}

export function deleteEvent(id) {
  const formData = new FormData();
  formData.append('id', id);
  
  $.ajax({
    url: `${API}/api/calendar/deleteEvent.php`,
    data: formData,
    processData: false,
    contentType: false,
    type: 'POST',
    success: res => console.log(res),
    error: err => console.log(err)
  });
}

export function signUpOnEvent(data) {
  const formData = new FormData();
  formData.append('id', data.id);
  formData.append('username', `${data.name} ${data.surname}`);

  $.ajax({
    url: `${API}/api/calendar/signUp.php`,
    data: formData,
    processData: false,
    contentType: false,
    type: 'POST',
    success: res => console.log(res),
    error: err => console.log(err)
  });
}

export function unSignUpOnEvent(data) {
  const formData = new FormData();
  formData.append('id', data.id);
  formData.append('username', `${data.name} ${data.surname}`);

  $.ajax({
    url: `${API}/api/calendar/unSignUp.php`,
    data: formData,
    processData: false,
    contentType: false,
    type: 'POST',
    success: res => console.log(res),
    error: err => console.log(err)
  });
}

export default [];