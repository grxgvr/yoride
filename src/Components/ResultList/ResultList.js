import React from "react";
import ResultElement from "../ResultElement/ResultElement";
import "./ResultList.css";

const list = props => {
  let suggTrips =
    props.suggestedTrips !== undefined ? (
      <div>
        {props.intention && props.suggestedTrips? <h4>Предложенные поездки</h4> : null}
      <div className="list">
        {props.suggestedTrips.map(element => (
          <ResultElement
            element={element}
            key={element.id}
            toggle={props.toggle}
            type={"s"}
          />
        ))}
      </div>
      </div>
    ) : null;
  let takenTrips =
    props.takenTrips !== undefined ? (
      <div>
        {props.intention && props.takenTrips? <h4>Забронированные поездки</h4> : null}
      <div className="list">
        {props.takenTrips.map(element => (
          <ResultElement
            element={element}
            key={element.id}
            toggle={props.toggle}
            type={"t"}
          />
        ))}
      </div>
      </div>
    ) : null;
  let historyTrips = props.historyTrips !== undefined ? (
    <div className="list">
    {props.historyTrips.map(element => (
      <ResultElement
        element={element}
        key={element.id}
        toggle={props.toggle}
        type={"h"}
      />
    ))}
  </div>
  )
  :null
  return (
    <div>
      {suggTrips}
      {takenTrips}
      {historyTrips}
    </div>
  );
};

export default list;
