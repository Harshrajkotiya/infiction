import React, { MutableRefObject, useEffect, useRef, useState } from "react";

export default function Book(props) {
  const divRef = props.divRefs;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (window.innerWidth > 425) {
      for (let i = 0; i < divRef.length; i++) {
        const page = divRef[i].current;
        if (i % 2 === 0) {
          page.style.zIndex = divRef.length - i;
        }
        page.pageNum = i + 1;
        page.onclick = function () {
          if (this.pageNum % 2 === 0) {
            this.classList.remove("flipped");
            this.previousElementSibling.classList.remove("flipped");
          } else {
            this.classList.add("flipped");
            this.nextElementSibling.classList.add("flipped");
          }
        };
      }
    }
  }, [divRef]);
  return (
    <>
      <style jsx>{`
        .book {
          transition: opacity 0.4s 0.2s;
        }
        p {
          // margin-top: 8vw;
          text-align: center;
          font-size: 20px !important;
          color: #000000;
          line-height: 1.2em;
          padding: 40px;
          white-space: wrap;
        }
        .page {
          width: 30vw;
          height: 44vw;
          background-color: #111111;
          float: left;
          margin-bottom: 0.5em;
          background: left top no-repeat;
          background-size: cover;
        }
        .page:nth-child(even) {
          clear: both;
        }
        .book {
          perspective: 250vw;
        }
        .book .pages {
          width: 60vw;
          height: 44vw;
          position: relative;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          border-radius: 4px;
          /*box-shadow: 0 0 0 1px #e3dfd8;*/
        }
        .book .page {
          float: none;
          clear: none;
          margin: 0;
          position: absolute;
          top: 0;
          width: 30vw;
          height: 44vw;
          transform-origin: 0 0;
          transition: transform 1.4s;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          cursor: pointer;
          user-select: none;
          background: #f0f0f0;
          clip-path: polygon(
            0 0,
            0% 93%,
            2% 95%,
            4% 93%,
            6% 95%,
            8% 93%,
            10% 95%,
            12% 93%,
            14% 95%,
            16% 93%,
            18% 95%,
            20% 93%,
            22% 95%,
            24% 93%,
            26% 95%,
            28% 93%,
            30% 95%,
            32% 93%,
            34% 95%,
            36% 93%,
            38% 95%,
            40% 93%,
            42% 95%,
            44% 93%,
            46% 95%,
            48% 93%,
            50% 95%,
            52% 93%,
            54% 95%,
            56% 93%,
            58% 95%,
            60% 93%,
            62% 95%,
            64% 93%,
            66% 95%,
            68% 93%,
            70% 95%,
            72% 93%,
            74% 95%,
            76% 93%,
            78% 95%,
            80% 93%,
            82% 95%,
            84% 93%,
            86% 95%,
            88% 93%,
            90% 95%,
            92% 93%,
            94% 95%,
            96% 93%,
            98% 95%,
            100% 93%,
            100% 0%
          );
          filter: brightness(0.95) grayscale(100%);
        }
        .book .page:before {
          content: "";
          position: absolute;
          // top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0), url("../page_bg.jpg");
          transition: background 0.7s;
          z-index: 2;
        }
        .book .page:first-child {
          background: url(../Footer_design.svg), url(../page_bg.jpg) !important;
          background-position-y: bottom !important;
          background-repeat: no-repeat !important;
          background-size: 100% !important;
        }
        .book .page:nth-child(odd) {
          pointer-events: all;
          transform: rotateY(0deg);
          right: 0;
          border-radius: 0 4px 4px 0;
          background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.15) 0%,
            rgba(0, 0, 0, 0) 10%
          );
          background: url("../page_bg.jpg");
        }
        .book .page:nth-child(odd):hover {
          transform: rotateY(-15deg);
        }
        .book .page:nth-child(odd):hover:before {
          background: rgba(0, 0, 0, 0.03);
        }
        .book .page:nth-child(odd):before {
          background: rgba(0, 0, 0, 0);
        }
        .book .page:nth-child(even) {
          pointer-events: none;
          transform: rotateY(180deg);
          transform-origin: 100% 0;
          left: 0;
          border-radius: 4px 0 0 4px;
          border-color: black;
          background-image: linear-gradient(
            to left,
            rgba(0, 0, 0, 0.12) 0%,
            rgba(0, 0, 0, 0) 10%
          );
          background: url("../page_bg.jpg");
        }
        .book .page:nth-child(even):before {
          background: rgba(0, 0, 0, 0.2);
        }
        .book .page.grabbing {
          transition: none;
        }
        .book .page.flipped:nth-child(odd) {
          pointer-events: none;
          transform: rotateY(-180deg);
        }
        .book .page.flipped:nth-child(odd):before {
          background: rgba(0, 0, 0, 0.2);
        }
        .book .page.flipped:nth-child(even) {
          pointer-events: all;
          transform: rotateY(0deg);
        }
        .book .page.flipped:nth-child(even):hover {
          transform: rotateY(15deg);
        }
        .book .page.flipped:nth-child(even):hover:before {
          background: rgba(0, 0, 0, 0.03);
        }
        .book .page.flipped:nth-child(even):before {
          background: rgba(0, 0, 0, 0);
        }
        *,
        * :before,
        *:after {
          box-sizing: border-box;
        }
        html,
        .main {
          background: rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(5px);
          box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
        }
        html {
          height: 100% !important;
        }
        .main {
          min-height: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          padding: 2em 0 !important;
          line-height: 2em !important;
        }
        .page:nth-child(odd) {
          background-position: right top;
        }
        .contetntext {
          font-size: 20px;
          text-align: justify;
          text-align-last: left;
          padding-top: 0;
          color: black;
          word-break: normal;
          word-spacing: 5px;
        }
        @media only screen and (max-width: 425px) {
          .mobile_page {
            border-radius: 4px 0 0 4px;
            border-color: black;
            background: url(../page_bg.jpg) !important;
            background-position-y: bottom !important;
            // background-repeat: no-repeat !important;
            // background-size: 100% !important;
            height: 50vh;
            width: 100%;
            overflow: auto;
          }
          .mobile_page p {
            padding: 0 10px 0 10px;
          }
          .contetntext {
            font-size: 11px !important;
            word-spacing: 0px;
          }
          .book .pages {
            width: 90vw;
            height: 100vw;
          }
          .book .page {
            width: 50vw;
            height: 100vw;
            right: 1%;
            display: block;
          }
          // .book .page.flipped:nth-child(even):not(:first-child):not(:last-child) {
          //   display:none;
          // }

          .page {
            width: 50vw;
            height: 150vw;
          }
        }
        @media only screen and (min-width: 426px) and (max-width: 768px) {
          .contetntext {
            font-size: 14px !important;
            word-spacing: 0px;
          }
          .book .pages {
            width: 94vw;
            height: 85vw;
          }
          .book .page {
            width: 47vw;
            height: 85vw;
          }
          .page {
            width: 45vw;
            height: 85vw;
          }
        }
        @media only screen and (min-width: 769px) and (max-width: 1024px) {
          .contetntext {
            font-size: 14px !important;
            word-spacing: 0px;
          }
          .book .pages {
            width: 80vw;
            height: 57vw;
          }
          .book .page {
            width: 40vw;
            height: 57vw;
          }
        }
        @media only screen and (min-width: 1025px) and (max-width: 1439px) {
          .contetntext {
            font-size: 13px !important;
            word-spacing: 0px;
          }
        }
        @media only screen and (min-width: 1440px) and (max-width: 1919px) {
          .contetntext {
            font-size: 15px !important;
            word-spacing: 0px;
          }
        }
        @media only screen and (min-width: 1920px) {
          .contetntext {
            font-size: 20px !important;
            word-spacing: 0px;
          }
        }
      `}</style>

      <div className="main">
        <div className="book">
          {window.innerWidth <= 425 ? (
            <div>
              {isClient && (
                <div className="mobile_page">
                  <div>
                    <h1
                      style={{
                        paddingTop: "3vh",
                        fontSize: window.innerWidth <= 768 ? "45px" : "65px",
                        fontWeight: "1000",
                        color: "black",
                        // backgroundImage: `linear-gradient(
                        //   to left,
                        //   rgba(0, 0, 0, 0.12) 0%,
                        //   rgba(0, 0, 0, 0) 10%
                        // )`,
                        background: "url(../page_bg.jpg)",
                      }}
                    >
                      {props.title}
                    </h1>
                    <p
                      dangerouslySetInnerHTML={{ __html: props.content }}
                      className="contetntext"
                    />
                    <p
                      dangerouslySetInnerHTML={{ __html: props.content1 }}
                      className="contetntext"
                    />
                    <p
                      dangerouslySetInnerHTML={{ __html: props.content2 }}
                      className="contetntext"
                    />
                    <p
                      dangerouslySetInnerHTML={{ __html: props.content3 }}
                      className="contetntext"
                    />
                    <p
                      dangerouslySetInnerHTML={{ __html: props.content4 }}
                      className="contetntext"
                    />
                    <p
                      dangerouslySetInnerHTML={{ __html: props.content5 }}
                      className="contetntext"
                    />
                    <p
                      dangerouslySetInnerHTML={{ __html: props.content6 }}
                      className="contetntext"
                    />
                    <p
                      dangerouslySetInnerHTML={{ __html: props.content7 }}
                      className="contetntext"
                    />
                    <p
                      dangerouslySetInnerHTML={{ __html: props.content8 }}
                      className="contetntext"
                    />
                    <p
                      dangerouslySetInnerHTML={{ __html: props.content9 }}
                      className="contetntext"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div id="pages" className="pages" ref={divRef}>
                {divRef.map((ref, index) => (
                  <div className="page" key={index} ref={ref}>
                    {index === 0 && (
                      <>
                        {/* <h1> About </h1> */}
                        <h1
                          style={{
                            paddingTop: "15vh",
                            fontSize:
                              window.innerWidth <= 768 ? "45px" : "65px",
                            fontWeight: "1000",
                            color: "black",
                            background: "url(../page_bg.jpg)",
                          }}
                        >
                          {index === 0 ? props.title : ""}
                        </h1>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <h4
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {" "}
                          {props.subtitle}{" "}
                        </h4>
                        <br />
                        {isClient && (
                          <p
                            dangerouslySetInnerHTML={{ __html: props.content }}
                            className="contetntext"
                          />
                        )}
                      </>
                    )}
                    {index === 3 && props.length >= 4 && (
                      <>
                        <h4
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {" "}
                          {props.subtitle}{" "}
                        </h4>
                        <br />
                        {isClient && (
                          <p
                            dangerouslySetInnerHTML={{ __html: props.content2 }}
                            className="contetntext"
                          />
                        )}
                      </>
                    )}
                    {index === 4 && (
                      <>
                        <h4
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {" "}
                          {props.subtitle}{" "}
                        </h4>
                        <br />
                        {isClient && (
                          <p
                            dangerouslySetInnerHTML={{ __html: props.content3 }}
                            className="contetntext"
                          />
                        )}
                      </>
                    )}
                    {index === 5 && (
                      <>
                        <h4
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {" "}
                          {props.subtitle}{" "}
                        </h4>
                        <br />
                        {isClient && (
                          <p
                            dangerouslySetInnerHTML={{ __html: props.content4 }}
                            className="contetntext"
                          />
                        )}
                      </>
                    )}
                    {index === 6 && (
                      <>
                        <h4
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {" "}
                          {props.subtitle}{" "}
                        </h4>
                        <br />
                        {isClient && (
                          <p
                            dangerouslySetInnerHTML={{ __html: props.content5 }}
                            className="contetntext"
                          />
                        )}
                      </>
                    )}
                    {index === 7 && (
                      <>
                        <h4
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {" "}
                          {props.subtitle}{" "}
                        </h4>
                        <br />
                        {isClient && (
                          <p
                            dangerouslySetInnerHTML={{ __html: props.content6 }}
                            className="contetntext"
                          />
                        )}
                      </>
                    )}
                    {index === 8 && (
                      <>
                        <h4
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {" "}
                          {props.subtitle}{" "}
                        </h4>
                        <br />
                        {isClient && (
                          <p
                            dangerouslySetInnerHTML={{ __html: props.content7 }}
                            className="contetntext"
                          />
                        )}
                      </>
                    )}
                    {index === 9 && (
                      <>
                        <h4
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {" "}
                          {props.subtitle}{" "}
                        </h4>
                        <br />
                        {isClient && (
                          <p
                            dangerouslySetInnerHTML={{ __html: props.content8 }}
                            className="contetntext"
                          />
                        )}
                      </>
                    )}
                    {index === 10 && (
                      <>
                        <h4
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {" "}
                          {props.subtitle}{" "}
                        </h4>
                        <br />
                        {isClient && (
                          <p
                            dangerouslySetInnerHTML={{ __html: props.content9 }}
                            className="contetntext"
                          />
                        )}
                      </>
                    )}
                    {/* <img src="../Footer_design.svg" alt="" /> */}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
