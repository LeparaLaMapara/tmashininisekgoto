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
            My research focuses on self-supervised learning, probabilistic modeling, and distributed ML systems
             designed to function reliably in real-world, low-resource environments..
            <br />
            <br />
            Beyond academia, I operate as a{" "}
            <span className="purple">
               Principal Data Scientist and Software engineer
            </span>
            . I’ve spent years designing and delivering production-grade AI/ML and
            data platforms across telecoms, banking, education, and research —
            often operating at the intersection of research, data science & engineering, and
            execution.
            <br />
            <br />
            I am the co-founder of{" "}
            <span className="purple">ThaBangVision Studio Labs</span>, an end-to-end creative
            technology studio operating at the intersection of visual production and
            advanced engineering. The studio spans photography, filmmaking, and applied R&D.
            <br />
            <br />
            Within the studio, the research arm operates under{" "}
            <span className="purple">Ubunye Artificial Intelligence Ecosystems (UAIE)</span>,
            Here, I design and build AI systems for both the creative and enterprise sectors, including:

            <ul >
            <li>Open-source AI tools</li>
            <li>Standardized ETL/ML frameworks to uplift organizational engineering maturity.</li>
            <li>Embedded systems and intelligent automation platforms.</li>
            </ul>

            At heart, I enjoy building—software, systems, tools, and the teams behind them. I collaborate with startups 
            and organizations on ambitious projects that require
             deep engineering capability and systemic thinking. My goal is to create work that is both technically rigorous and deeply impactful.
            <br />
            <br />
            Outside of the lab and the terminal, I stay inspired through:
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
