import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "AI Researcher",
          "Principal Data Scientist",
          "Distributed Systems Engineer",
          "Software Engineer",
          "Machine Learning Architect",
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
