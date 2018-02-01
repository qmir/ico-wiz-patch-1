import React from 'react';
import '../../assets/stylesheets/application.css';


export const Button = props => {
  return (
    <div onClick={() => props.onSubmitInp()} className="button button_fill"> {props.text} </div>
  );
};
