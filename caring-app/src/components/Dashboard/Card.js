import React from "react";
import "./Card.css";
import Avatar from "./Avatar";

function Card(props) {
  return (
    <div className="card">
      <div className="top">
        <h2 className="name">{props.name}</h2>
        <Avatar 
        imgsrc={props.imgsrc}
        />
      </div>
      <div className="bottom">
        <p className="info" >{props.tel}</p>
        <p className="val" >{props.score}%</p>
      </div>
    </div>
  );
}

export default Card;