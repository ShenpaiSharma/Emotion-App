
const video = document.getElementById('video')
const ema = document.getElementById('Email').innerHTML;
const opi = document.getElementById('Password').innerHTML;
const First = document.getElementById('First').innerHTML;
const Last = document.getElementById('Last').innerHTML;
const Account = document.getElementById('Account').innerHTML;
const Status = document.getElementById('Status').innerHTML;

const button = document.getElementsByTagName("button")[1];

console.log(Status, 'This is status');

let flag = false;

button.addEventListener("click", function() {
  flag = true;
})

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

function stopStreamedVideo(videoElem) {
  const stream = videoElem.srcObject;
  const tracks = stream.getTracks();

  tracks.forEach(function(track) {
    track.stop();
  });

  videoElem.srcObject = null;
}

let facial_expressions = {
  angry: 0,
  disgusted: 0,
  fearful: 0,
  happy: 0,
  neutral: 0,
  sad: 0,
  surprised: 0
};

let user_id;
let account_id;
let f_name;
let l_name;
let email;
let start_time;
let password;
let expressions_array;

let Email = ema;
let Password = opi;

if (Status === 'register') {
  fetch('http://localhost:5050/expression', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      account_id: Account,
      first_name: First,
      last_name: Last,
      email: Email,
      password: Password,
      start_time: new Date(),
      end_time: new Date(),
      expression_array: []
    })
  })
    .then(response => response.json())
    .then(obj => {
      if (obj._id) {
        console.log(obj);
        user_id = obj._id;
        account_id = obj.account_id;
        f_name = obj.first_name;
        l_name = obj.last_name;
        email = obj.email;
        start_time = obj.start_time;
        password = obj.password;
        expressions_array = obj.expression_arr;
      } else {
        // console.log("errrsdsdad");
        window.location.href = "/failure";
      }
    })
    .catch((err) => {
      // console.log("Errrrrror with register");
      console.log(err);
      window.location.href = "/failure";
    })
} else if (Status === 'signin') {

  fetch('http://localhost:5050/signin', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: Email,
      password: Password
    })
  })
    .then(response => response.json())
    .then(obj => {
      if (obj._id) {
        console.log(obj);
        user_id = obj._id;
        account_id = obj.account_id;
        f_name = obj.first_name;
        l_name = obj.last_name;
        email = obj.email;
        start_time = obj.start_time;
        password = obj.password;
        expressions_array = obj.expression_arr;
      } else {
        // console.log("errrsdsdad");
        window.location.href = "/failure";
      }
    })
    .catch((err) => {
      console.log(err);
      window.location.href = "/failure";
    })
} else {
  window.location.href = "/failure";
}

const expressions_arr = [];
const emotion_arr = [];

let count = 0;

function updateExpression(expressions_array) {
  fetch('http://localhost:5050/update/expression', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      user_id: user_id,
      first_name: f_name,
      email: email,
      expression_array: expressions_array
    })
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      stopStreamedVideo(video);
      window.location.href = ('/success');
    })
    .catch((err) => {
      console.log(err);
      window.location.href = "/failure";
    })
    
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {

    try{
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
      

      let expressions_detection = detections[Object.keys(detections)[0]].expressions;

      let emotion_obj = {
        timestamp: new Date(),
        emotions: expressions_detection
      }
      emotion_arr.push(emotion_obj);
      facial_expressions = emotion_obj;

      count++;
      // console.log(count);

      if(count === 1) {
        start_time = new Date();
      }
      

      if (flag) {
        flag = false;
        expression_obj = {
          Day: expressions_array.length + 1,
          emotion_arr: emotion_arr
        }
        expressions_arr.push(expression_obj);

        updateExpression(expressions_arr);

      }
      
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
      
      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    } 
    catch (err) {
      console.log('Keep your face in center', err);
      if (flag) {
        flag = false;
        expression_obj = {
          Day: expressions_array.length + 1,
          emotion_arr: emotion_arr
        }
        expressions_arr.push(expression_obj);
        
        updateExpression(expressions_arr);
      }
      
    }
  }, 1000)
});
