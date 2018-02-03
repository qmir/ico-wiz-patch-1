import React from 'react';
import '../../assets/stylesheets/application.css';


export const Button = props => {
  return (
    <div className={props.containerStyle}>
      <div onClick={() => props.onClick()} className="button button_fill"> {props.text} </div>
    </div>
  );
};
