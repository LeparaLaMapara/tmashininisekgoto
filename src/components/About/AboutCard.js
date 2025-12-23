import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi, I’m <span className="purple">Thabang Mashinini-Sekgoto</span> from{" "}
            <span className="purple">Johannesburg, South Africa</span>, a <span className="purple">PhD researcher</span> at{" "}
            <span className="purple">the University of the Witwatersrand</span>,
            where my research focuses on computer vision, distributed systems,
            probabilistic modelling, geospatial data, and building AI systems that work reliably
            under real-world constraints.
            <br />
            <br />
            Beyond academia, I work as an{" "}
            <span className="purple">
              software engineer, Data Scientist, and open-source developer
            </span>
            . I’ve spent years designing and delivering production-grade AI/ML and
            data platforms across telecoms, banking, education, and research —
            often operating at the intersection of research, data science & engineering, and
            execution.
            <br />
            <br />
            I’m also the co-founder of{" "}
            <span className="purple">ThaBangVision Studio Labs</span>, an end-to-end creative
            technology studio operating at the intersection of visual production and
            advanced engineering. The studio spans photography, filmmaking, visual design,
            gear experimentation and rental, and applied R&D.
            <br />
            <br />
            Within the studio, the research arm operates under{" "}
            <span className="purple">Ubunye Artificial Intelligence Ecosystems (UAIE)</span>,
            where I design and build AI systems for both the creative industry and
            enterprise sectors. This includes open-source AI and computer vision tools,
            bespoke embedded and distributed software systems, and applied ML solutions
            across domains such as computer vision analytics, and intelligent automation platforms.
            <br />
            <br />
            Through this structure, I collaborate with teams, startups, and organisations
            on ambitious technical and creative projects that require both deep engineering
            capability and strong system-level thinking.
            <br />
            <br />
            At heart, I enjoy building things — software, systems, tools, and
            the teams behind them — with the goal of creating work
            that’s both technically rigorous and impactful.
            <br />
            <br />
            Outside of engineering and research, I love staying creative and inspired through:
          </p>


          <ul>
            <li className="about-activity">
              <ImPointRight /> Photography & Filmmaking 🎥
            </li>
            <li className="about-activity">
              <ImPointRight /> Music Production 🎶
            </li>
            <li className="about-activity">
              <ImPointRight /> Calisthenics & Exploring New Places 🌍
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Strive to build things that make a difference."
          </p>
          <footer className="blockquote-footer">
            Thabang Mashinini-Sekgoto
          </footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
