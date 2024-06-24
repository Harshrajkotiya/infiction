import React from "react";

export default function FormatPrice({ price }) {
  const formatter = new Intl.NumberFormat('en-IN');
  return <div>{formatter.format(price)}</div>;
 
}
