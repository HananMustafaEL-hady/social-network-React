import React from "react";

function Card({ name, imgsrc, city, country }) {
  return (
    <div>
      <div>
        <img src={imgsrc} alt="" />
      </div>
      <div>
        <h2>{name}</h2>
        <span>{city} </span>
        <span>{country} </span>
      </div>
    </div>
  );
}

export default Card;
