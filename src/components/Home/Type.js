import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Machine Learning research scientist",
          "Data Scientist",
          "Distributed Systems Engineer",
          "PhD Student",
          "Software Engineer",
          "Open Source Framework Developer",
          "Founder of Ubunye AI Ecosystem",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
