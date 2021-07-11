import React, { useState, useEffect } from 'react';
import Card from './Card';
import './Dashboard.css'
import { Line, Pie } from 'react-chartjs-2';
import axios from "axios";
import happy from "./Image/happy.png";
import sad from "./Image/sad.png"
import angry from "./Image/angry.png"
import disgusted from "./Image/disgusted.png"
import surprised from "./Image/surprised.png"
import neutral from "./Image/neutral.png"

const obj = {
  angry: 0,
  disgusted: 0,
  neutral: 0,
  fearful:0,
  happy: 0,
  sad: 0,
  surprsed: 0
}

const Dashboard = ({ user }) => {
  const id = user.user_id;
  const [lastDay, setLastDay] = useState(obj);
  const [chartPieData, setChartPieData] = useState(obj);
  const [chartData, setChartData] = useState({});
  const [chartDayData, setChartDayData] = useState({});
  const [chartValence, setValence] = useState({});
  const [avgfilter, setavgfilter] = useState(1);
  const [fromEmotion, setFromEmotion] = useState(1);
  const [toEmotion, setToEmotion] = useState(user.expression_arr.length);
  const [fromValenceEmotion, setFromValenceEmotion] = useState(1);
  const [toValenceEmotion, setToValenceEmotion] = useState(user.expression_arr.length);
  // const [flag, setFlag] = useState(false);
  const [count, setCount] = useState(0);



  function changeFilter(event) {
    setavgfilter(event.target.value);
  }

  function onFilterSubmit() {
    // setFlag(true);
    setCount(count + 1);
  }

  function changeFromFilter(event) {
    setFromEmotion(event.target.value);
  }

  function changeToFilter(event) {
    setToEmotion(event.target.value);
  }

  function changeFromValenceFilter(event) {
    setFromValenceEmotion(event.target.value);
  }

  function changeToValenceFilter(event) {
    setToValenceEmotion(event.target.value);
  }

  useEffect(() => {
    //if (!flag) return;
    let Happy;
    let Angry;
    let Sad;
    let Surprised;
    let Disgust;
    let Fear;

    axios
    .get('http://localhost:5050/expression/average_time/' + id)
    .then(data => {
      setLastDay(data.data[0].avg_emotion);
      
      const AverageData = data.data[0].avg_emotion;

      const RemoveNeutral = (1 - AverageData.neutral);
      Happy = Math.floor((AverageData.happy/RemoveNeutral)*100);
      Angry = Math.floor((AverageData.angry/RemoveNeutral)*100);
      Sad = Math.floor((AverageData.sad/RemoveNeutral)*100);
      Surprised = Math.floor((AverageData.surprsed/RemoveNeutral)*100);
      Disgust = Math.floor((AverageData.disgusted/RemoveNeutral)*100);
      Fear = Math.floor((AverageData.fearful/RemoveNeutral)*100);


      setChartPieData({
        labels: ['Happy', 'Angry', 'Surprised', 'Sad', 'Disgust', 'Fear'],
        datasets: [
          {
            label: "Last Day Average Emotion data",
            data: [Happy, Angry, Sad, Surprised, Disgust, Fear],
            fill: false,
            backgroundColor: [
              "#F48F57",
              "#45379B",
              "#E66B9D",
              "#934E9F",
              "#2097B7",
              "#866755"
            ],
            borderColor: "#F48F57"
          }
        ]
      });
    })
    .catch(err => {
      console.log(err);
    });
    // setFlag(false);
    //console.log("last Day");
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    //if (!flag) return;

    const fill = avgfilter;

    let Happy = [];
    let Angry = [];
    let Sad = [];
    let Surprised = [];
    let Disgust = [];
    let Fear = [];
    let array = [];
    axios
      .get('http://localhost:5050/expression/average_time/' + id, { params: { filter: fill } })
      .then(data => {
        // setAvgTime(data.data);
        // console.log(data.data.length, 'data');
        // console.log(avgTime.length, avgTime);
        const dayTime = data.data;
        for(let i=0;i<dayTime.length;i++) {

          const RemoveNeutral = (1 - dayTime[i].avg_emotion.neutral);

          Happy.push((dayTime[i].avg_emotion.happy/RemoveNeutral)*100);
          Sad.push((dayTime[i].avg_emotion.sad/RemoveNeutral)*100);
          Disgust.push((dayTime[i].avg_emotion.disgusted/RemoveNeutral)*100);
          Surprised.push((dayTime[i].avg_emotion.surprsed/RemoveNeutral)*100);
          Angry.push((dayTime[i].avg_emotion.angry/RemoveNeutral)*100);
          Fear.push((dayTime[i].avg_emotion.fearful/RemoveNeutral)*100);
        }
        

        for(let i=0;i<dayTime.length;i++) {
          array.push((i+1)*fill);
        }

        setChartData({
          labels: array,
          datasets: [
            {
              label: "Happy",
              data: Happy,
              fill: false,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "#F48F57",
              pointRadius: 5
            },
            {
              label: "Angry",
              data: Angry,
              fill: false,
              borderColor: "#45379B",
              pointRadius: 5
            },
            {
              label: "Surprised",
              data: Surprised,
              fill: false,
              borderColor: "#E66B9D",
              pointRadius: 5
            },
            {
              label: "Sad",
              data: Sad,
              fill: false,
              borderColor: "#934E9F",
              pointRadius: 5
            },
            {
              label: "Disgust",
              data: Disgust,
              fill: false,
              borderColor: "#2097B7",
              pointRadius: 5
            },
            {
              label: "Fear",
              data: Fear,
              fill: false,
              borderColor: "#866755",
              pointRadius: 5
            }
          ]
        });
        
      })
      .catch(err => {
        console.log(err);
      });

    // setFlag(false);
    //console.log("GEFD");
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps



  useEffect(() => {
    //if (!flag) return;
    let Happy = [];
    let Angry = [];
    let Sad = [];
    let Surprised = [];
    let Disgust = [];
    let Fear = [];
    let array = [];
    // http://localhost:5050/expression/average_day/60e5e5e27a86c43100cc6fc4
    const from = fromEmotion;
    const to = toEmotion;
    //console.log(user.expression_arr.length);
    axios
    .get('http://localhost:5050/expression/average_day/' + id, { params: { from: from, to: to } })
    .then(data => {
      // setAvgDay(data.data);
      // console.log(data.data);
      const averageDay = data.data;

      for(let i=0;i<averageDay.length;i++) {

        const RemoveNeutral = (1 - averageDay[i].avg_emotion.neutral);

        Happy.push((averageDay[i].avg_emotion.happy/RemoveNeutral)*100);
        Sad.push((averageDay[i].avg_emotion.sad/RemoveNeutral)*100);
        Disgust.push((averageDay[i].avg_emotion.disgusted/RemoveNeutral)*100);
        Surprised.push((averageDay[i].avg_emotion.surprsed/RemoveNeutral)*100);
        Angry.push((averageDay[i].avg_emotion.angry/RemoveNeutral)*100);
        Fear.push((averageDay[i].avg_emotion.fearful/RemoveNeutral)*100);
      }

      for(let i=from;i<=to;i++) {
        array.push(i);
      }

      setChartDayData({
        labels: array,
        datasets: [
          {
            label: "Happy",
            data: Happy,
            fill: false,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "#F48F57",
            pointRadius: 5
          },
          {
            label: "Angry",
            data: Angry,
            fill: false,
            borderColor: "#45379B",
            pointRadius: 5
          },
          {
            label: "Surprised",
            data: Surprised,
            fill: false,
            borderColor: "#E66B9D",
            pointRadius: 5
          },
          {
            label: "Sad",
            data: Sad,
            fill: false,
            borderColor: "#934E9F",
            pointRadius: 5
          },
          {
            label: "Disgust",
            data: Disgust,
            fill: false,
            borderColor: "#2097B7",
            pointRadius: 5
          },
          {
            label: "Fear",
            data: Fear,
            fill: false,
            borderColor: "#866755",
            pointRadius: 5
          }
        ]
      });
    })
    .catch(err => {
      console.log(err);
    });
  

    // setFlag(false);
    //console.log('sdhl');
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps



  useEffect(() => {
    //if (!flag) return;
    let Positive = [];
    let Negative = [];
    let array = [];
    // http://localhost:5050/valence/average_day/

    const from = fromValenceEmotion;
    const to = toValenceEmotion;
    //console.log(user.expression_arr.length);
    axios
    .get('http://localhost:5050/valence/average_day/' + id, { params: { from: from, to: to } })
    .then(data => {
      // setAvgValence(data.data);

      const averageValence = data.data;

      for(let i=0;i<averageValence.length;i++) {
        Positive.push(averageValence[i].avg_emotion.positive);
        Negative.push(averageValence[i].avg_emotion.negative);
      }

      for(let i=from;i<=to;i++) {
        array.push(i);
      }

      // console.log(Positive);
      setValence({
        labels: array,
        datasets: [
          {
            label: "Positive",
            data: Positive,
            fill: false,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            pointRadius: 5
          },
          {
            label: "Negative",
            data: Negative,
            fill: false,
            borderColor: "#742774",
            pointRadius: 5
          }
        ]
      });
    })
    .catch(err => {
      console.log(err);
    });


    // setFlag(false);
    //console.log('djslkaj');
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps

  // function onSubmit() {
  //   setFlag(true);
  // }

  return (
    <div>
      <div className='white f3'>
        <p>We analyzes emotion data every second.</p>
        <p>Hi {user.first_name}</p>
      </div>
      <div className="cardv" >
        <Card 
        name = "Happy"
        imgsrc = {happy}
        tel = "Last Day Average"
        score = {Math.floor((lastDay.happy/(1 - lastDay.neutral))*100)}
        />

        <Card 
        name = "Angry"
        imgsrc = {angry}
        tel = "Last Day Average"
        score = {Math.floor((lastDay.angry/(1 - lastDay.neutral))*100)}
        />

        <Card 
        name = "Sad"
        imgsrc = {sad}
        tel = "Last Day Average"
        score = {Math.floor((lastDay.sad/(1 - lastDay.neutral))*100)}
        />
      </div>
      <div className="cardv" >
        <Card 
        name = "Surprised"
        imgsrc = {surprised}
        tel = "Last Day Average"
        score = {Math.floor((lastDay.surprsed/(1 - lastDay.neutral))*100)}
        />

        <Card 
        name = "Disgusted"
        imgsrc = {disgusted}
        tel = "Last Day Average"
        score = {Math.floor((lastDay.disgusted/(1 - lastDay.neutral))*100)}
        />

        <Card 
        name = "Fear"
        imgsrc = {neutral}
        tel = "Last Day Average"
        score = {Math.floor((lastDay.fearful/(1 - lastDay.neutral))*100)}
        />
      </div>
      {/*<input
        onClick={onSubmit}
        className="b ph3 pv2 input-reset ba b--black bg-light-purple grow pointer f6 dib"
        type="submit"
        value="Load the Data"
      />*/}

      <div className="pie-container">
        <Pie 
        data={chartPieData}  
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
                display: true,
                text: 'Last Day Average Emotion data',
                font: {
                  size: 17
                }
            }
          }
        }}
        />
      </div>

      <div className="chart-container" >
        <div>
          <div className='center'>
            <div className='form center pa4 br3'>
              <input className='f4 pa2 w-40 center' type='tex' onChange={changeFilter} />
              <button
                style={{fontSize: '15px'}}
                className='w-40 grow f4 link ph3 pv2 dib white bg-light-purple'
                onClick={onFilterSubmit}
              >Filter</button>
            </div>
          </div>
          <Line 
          className="day-line"
          data={chartData}  
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              title: {
                  display: true,
                  text: 'Last Day Emotion Data of Every Second (Filter to average w.r.t seconds)',
                  font: {
                    size: 17
                  }
              }
            }
          }}
          />
        </div>


        <div>
          <div className='center'>
            <div className='form center pa4 br3'>
              <input 
              className='f4 pa2 w-25 center' 
              type='tex' 
              placeholder='From' 
              style={{fontSize: '15px'}} 
              onChange={changeFromFilter} 
              />
              <input 
              className='f4 pa2 w-25 center' 
              type='tex' 
              placeholder='To' 
              style={{fontSize: '15px'}} 
              onChange={changeToFilter}
              />
              <button
                style={{fontSize: '15px'}}
                className='w-40 grow f4 link ph3 pv2 dib white bg-light-purple'
                onClick={onFilterSubmit}
              >Filter</button>
            </div>
          </div>
          <Line 
          className="day-line"
          data={chartDayData}  
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              title: {
                  display: true,
                  text: 'Average Emotion Data of each Day (Filter to choose From which Day To which Day)',
                  font: {
                    size: 17
                  }
              }
            }
          }}
          />
        </div>
        

        <div>
          <div className='center'>
            <div className='form center pa4 br3'>
              <input 
              className='f4 pa2 w-25 center' 
              type='tex' 
              placeholder='From' 
              style={{fontSize: '15px'}} 
              onChange={changeFromValenceFilter} 
              />
              <input 
              className='f4 pa2 w-25 center' 
              type='tex' 
              placeholder='To' 
              style={{fontSize: '15px'}} 
              onChange={changeToValenceFilter}
              />
              <button
                style={{fontSize: '15px'}}
                className='w-40 grow f4 link ph3 pv2 dib white bg-light-purple'
                onClick={onFilterSubmit}
              >Filter</button>
            </div>
          </div>
          <Line 
          className="day-line"
          data={chartValence}  
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              title: {
                  display: true,
                  text: 'Average Valence Emotion Score of each Day (Filter to choose From which Day To which Day)',
                  font: {
                    size: 17
                  }
              }
            }
          }}
          />
        </div>
        
      </div>
        
        
    </div>
  );
}

export default Dashboard;