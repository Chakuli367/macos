import { useState } from "react";
import  FindAPlace01 from "src/components/DAY_01/FINDAPLACE/01";
import  SetYourTimes02  from "src/components/DAY_01/SETYOURTIMES/02";
import  HelpWithAnxiety03  from "src/components/DAY_01/HELPWITHTHEIRANXIETY/03";
import  SkillNavigator  from "src/components/DAY_01/SKELETAL COMPONENTS/navigator";


const Day1Navigator = () => {
  const [pageIndex, setPageIndex] = useState(0);

  // Array of pages in order
  const pages = [
    <FindAPlace01 />,
    <SetYourTimes02 />,
    <HelpWithAnxiety03 />,
    <SkillNavigator />,
   
  ];

  const nextPage = () => {
    if (pageIndex < pages.length - 1) setPageIndex(p => p + 1);
  };

  const prevPage = () => {
    if (pageIndex > 0) setPageIndex(p => p - 1);
  };

  return (
    <div>
      {/* Render current page */}
      <div>{pages[pageIndex]}</div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button onClick={prevPage} disabled={pageIndex === 0}>
          Previous
        </button>

        <button onClick={nextPage} disabled={pageIndex === pages.length - 1}>
          Next
        </button>
      </div>

      {/* Optional: Progress Indicator */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        Page {pageIndex + 1} of {pages.length}
      </div>
    </div>
  );
};

export default Day1Navigator;