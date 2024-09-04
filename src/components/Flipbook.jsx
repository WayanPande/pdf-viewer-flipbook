import React from "react";
import HTMLFlipBook from "react-pageflip";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdf from "./example_compressed.pdf";

const workerPath =
  import.meta.env.MODE === "production"
    ? "/assets/pdf.worker.mjs"
    : "/dist/assets/pdf.worker.mjs"; // For local development

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  workerPath,
  import.meta.url
).toString();

console.log(import.meta.env.MODE);

const Pages = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage" ref={ref}>
      <p>{props.children}</p>
      <p>Page number: {props.number}</p>
    </div>
  );
});

Pages.displayName = "Pages";

function Flipbook() {
  const [numPages, setNumPages] = useState();
  const [file, setFile] = useState(pdf);
  const bookRef = React.useRef();
  const [currentPage, setCurrentPage] = useState(0);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onFileChange(event) {
    const { files } = event.target;

    const nextFile = files?.[0];

    if (nextFile) {
      setFile(nextFile);
      setNumPages(1);
    }
  }

  return (
    <>
      <div className="h-full min-h-screen w-screen flex flex-col gap-5 justify-center items-center bg-gray-900 overflow-hidden text-white">
        <div className="Example__container__load">
          <label htmlFor="file">Load from file:</label>{" "}
          <input onChange={onFileChange} type="file" />
        </div>
        <div className="flex gap-3">
          <button
            className="bg-white text-black px-5 py-3"
            onClick={() => bookRef.current.pageFlip().flipPrev()}
          >
            Prev
          </button>
          <button
            className="bg-white text-black px-5 py-3"
            onClick={() => bookRef.current.pageFlip().flipNext()}
          >
            Next
          </button>
          <button
            className="bg-white text-black px-5 py-3"
            onClick={() => bookRef.current.pageFlip().flip(1)}
          >
            First
          </button>
          <button
            className="bg-white text-black px-5 py-3"
            onClick={() => bookRef.current.pageFlip().flip(numPages - 1)}
          >
            Last
          </button>
          <button
            className="bg-white text-black px-5 py-3"
            onClick={() => bookRef.current.pageFlip().flip(10)}
          >
            Jump to page
          </button>
        </div>
        <HTMLFlipBook
          width={768}
          height={1100}
          ref={bookRef}
          onFlip={(e) => setCurrentPage(e)}
        >
          {[...Array(numPages).keys()].map((pNum) => (
            <Pages key={pNum} number={pNum + 1}>
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <Page
                  pageNumber={pNum}
                  width={768}
                  height={1366}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </Document>
            </Pages>
          ))}
        </HTMLFlipBook>
        <p className="text-center text-white">
          Page {bookRef?.current?.pageFlip()?.getCurrentPageIndex() - 1} -{" "}
          {bookRef?.current?.pageFlip()?.getCurrentPageIndex()} of {numPages}
        </p>

        <div className="overflow-x-scroll max-w-screen-xl mb-60">
          <Document file={file} className={"flex gap-5 "}>
            {Array.from(Array(numPages).keys()).map((pNum) => (
              <Page
                key={pNum}
                pageNumber={pNum}
                width={300}
                height={500}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onClick={() => {
                  bookRef?.current?.pageFlip()?.flip(pNum);
                }}
                className={
                  "hover:scale-105 transition-transform duration-500 cursor-pointer"
                }
              />
            ))}
          </Document>
        </div>
      </div>
    </>
  );
}

export default Flipbook;
