import React from "react";
import "./Card.css";

function Avatar(props) {
  return <img className="circle-img" src={props.imgsrc} alt="avatar_img" />;
}

export default Avatar;