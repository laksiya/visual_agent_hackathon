import { useState } from "react";
import SimliAgent from "../SimliAgent"

export const VideoWrapper = () => {
const [showDottedFace, setShowDottedFace] = useState(true);

  const onStart = () => {
    console.log("Setting setshowDottedface to false...");
    setShowDottedFace(false);
  };

  const onClose = () => {
    console.log("Setting setshowDottedface to true...");
    setShowDottedFace(true);
  };

  return(
    <SimliAgent onClose={onClose} onStart={onStart}/>
  )
}
