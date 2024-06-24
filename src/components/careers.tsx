import Book from "@/components/book";
import React, { useRef } from "react";

export default function careers() {

  const htmlString = '<p style="margin-top: 5%;">If you are an expert in the fields of writing, professional reading, software development, AI, ML, audience analytics, filmmaking, film financing, InFiction is the perfect place for you. The best way to predict your future is to create it! <br /><br/> At InFiction, we foster a culture of experimentation, teamwork, equality, while continuously challenging ourselves to do better.<br /><br />Most importantly, you’ll work with inspiring colleagues to build and cater to the changing needs of the entertainment industry. Come join us!<br /><br /> Introduce yourself along with your professional background and we’ll get in touch! <br /><br />Send your details to <b>hello@infictionapp.com<b/></p>'
  const divRefs = Array.from({ length: 4 }, () => useRef(null));

  return (
    <div style={{ textAlign: "center" }}>
      <Book title="Careers" content={htmlString} length={4} divRefs={divRefs} />
    </div>
  );
}
