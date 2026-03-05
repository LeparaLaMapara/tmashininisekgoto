import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Founder of Ubunye AI Ecosystems",
          "Distributed Systems Engineer",
          "ML Researcher — Wits University",
          "Open Source Framework Developer",
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
