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
  <span className="purple">Johannesburg, South Africa</span>.
  I’m an <span className="purple">AI researcher</span> at{" "}
  <span className="purple">the University of the Witwatersrand</span>, where my work
  focuses on self-supervised learning, distributed systems, probabilistic modeling,
  and large-scale data engineering.
  <br />
  <br />

  At the core of my work is a simple idea: <b>AI should work reliably in the real world</b>.
  Not just as models or demos, but as systems that survive noisy data, scale,
  organizational constraints, and real human use.
  <br />
  <br />
  Over the years, I’ve designed and delivered <span className="purple">mission-critical AI platforms </span>
  across <span className="purple">telecoms</span>, 
             <span className="purple"> banking</span>, <span className="purple"> education</span>, 
             and <span className="purple"> global-research </span>moving beyond experimentation
  to create measurable business and societal impact:
</p>

<ul >
  <li className="about-activity">
    <ImPointRight /> <span className="purple">Telecoms (Vodacom)</span> — Architected a national-scale
    network optimization engine for smart-generator allocation, contributing to
    <span className="purple"> R1 billion in annual OPEX savings</span> and improving
    network <span className="purple">uptime by 5%</span>.
  </li>
  <br />
  <li className="about-activity">
   <ImPointRight /> <span className="purple">Banking & Insurance (ABSA)</span> — Led an enterprise-wide
    <span className="purple"> Databricks-based ML transformation</span>, reducing model
    training and scoring latency by <span className="purple">80–90%</span> and improving
    client retentions by <span className="purple">10%</span>.
  </li>
  <br />
  <li className="about-activity">
    <ImPointRight /> <span className="purple">Global Research (IBM)</span> — Built geospatial and climate
    risk intelligence platforms, improving seasonal forecast accuracy by
    <span className="purple"> 15%</span> and enabling real-time epidemiological tools
    for public health authorities.
  </li>
  <br />
  <li className="about-activity">
   <ImPointRight /> <span className="purple">Education (Wits BIS)</span> — Modernized institutional data
    capabilities and designed recommendation systems that generated over
    <span className="purple"> R2 million</span> in annual goverment subsidy through improved
    enrollment alignment.
  </li>
</ul>

<p style={{ textAlign: "justify" }}>
  <br />
  Alongside my research and industry work, I’m the co-founder of{" "}
  <span className="purple">ThaBangVision Studio Labs</span>, focused on modernizing the photography and filmmaking industry in the age of AI.
  <br />
  <br />

  The studio’s research arm operates under{" "}
  <span className="purple">Ubunye Artificial Intelligence Ecosystems (UAIE)</span>, where
  I design and build AI systems for both creative and enterprise environments,
  including:
</p>

<ul>
  <li className="about-activity"> <ImPointRight /> Open-source AI and computer vision tools</li>
    <br />

  <li className="about-activity"><ImPointRight /> Standardized ETL/ML frameworks for production systems</li>
    <br />
  <li className="about-activity"><ImPointRight /> Embedded systems and intelligent automation platforms</li>
</ul>

<p style={{ textAlign: "justify" }}>
  At heart, I enjoy building software, systems, tools, and the teams behind them.
  I collaborate with startups and organizations on ambitious projects that require
  deep engineering, AI, long-term thinking, and technical rigor.
  <br />
  <br />

Outside the lab and the terminal, I stay grounded and creatively energized through my hobbies, 
and I enjoy documenting parts of that journey on my YouTube channel:
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
            <li className="about-activity">
              <ImPointRight /> Skydiving 🪂
            </li>
            <li className="about-activity">
              <ImPointRight /> Drag Racing 🏁
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
