import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>

           <p className="home-about-body">
              I’m an{" "}
              <span className="purple">
             Applied Machine Learning Scientist
              </span>{" "} and{" "}
              <span className="purple">PhD Researcher</span>{" "}
              working at the intersection of self-supervised learning, distributed systems,
               probabilistic modeling, and large-scale data engineering. 
              <br />
              <br />
              I don't just design models; I design and operationalize real-world AI systems. My work spans the entire lifecycle—from research and architecture 
              to production-grade execution—ensuring that complex data becomes a reliable operational asset.
             
              I remain a hands-on engineer and architect, building the tools I use. This includes maintaining open-source ecosystems 
              like <span className="purple">UAIE (Ubunye-AI-Ecosystems)</span> for standardized ETL/ML and  Bayesian state estimation.
              <br />
              <br />

             Over the years, I’ve led and delivered ML/AI-driven, mission-critical platforms across <span className="purple">telecoms</span>, 
             <span className="purple">banking</span>, <span className="purple">education</span>, and <span className="purple">research</span>. 
             My work focuses on moving beyond the research to create measurable enterprise value:
            <br />
            <ul >
              <li>
              <span className="purple">Telecoms (Vodacom)</span> — Architected a national-scale network optimization engine for smart-generator allocation,
              contributing to <span className="purple">R1 billion in annual OPEX savings</span> and improving network <span className="purple">uptime by 5%</span>
              </li>
              <br />
              <li>
                <span className="purple">Banking & Insurance (ABSA)</span> — Led the enterprise-wide <span className="purple">Databricks-based ML transformation</span>, cutting model training 
                and scoring latency by <span className="purple">80–90%</span> and improving risk visibility for property insurance by  <span className="purple">80%</span>.
              </li>
              <br />
              <li>
                <span className="purple">Global Research (IBM)</span> — Developed global geospatial and climate risk intelligence platforms, 
                improving seasonal forecast accuracy by <span className="purple">15%</span> and building real-time epidemiological tools for public health authorities.
              </li>
              <br />
              <li>
                <span className="purple">Education (Wits BIS)</span> — Spearheaded the strategic modernization of data capabilities, designing a recommendation system 
                that generated over <span className="purple">R2 million</span> in annual revenue through improved enrollment alignment.
              </li>
           </ul>

            <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              WORK <span className="purple"> WITH </span> ME
            </h1>
            </Col>

            I partner with founders, leadership teams, and technical organizations to design, modernize, 
            and scale <span className="purple">real-world AI and data engineering platforms.</span> How I Can Help:
              <br />
              <br />

    
          <ul >
            <li>
            <span className="purple">AI & Data Science Strategy</span> — Consulting on system design and roadmaps that align
             technical delivery with measurable business outcomes.
            </li>
            <br />

            <li>
              <span className="purple">Enterprise ML & cloud transformation</span> — Architecting production platforms—specializing 
              in Databricks, AWS, and streaming architectures (Kafka, Flink) to cut latency and scale scoring.
            </li>
            <br />

            <li>
              <span className="purple">Advanced Analytics & Decision Systems</span> — Turning complex, multi-terabyte datasets (including geospatial 
              and IoT telemetry) into operational insights.
            </li>
            <br />

            <li>
              <span className="purple">Technical Leadership</span> — Providing Senior/Principal-level consulting to stabilize high-value systems, 
              introduce MLOps, and establish AI governance.
            </li>
            <br />

            <li>
              <span className="purple">Capability Enablement</span> — Mentoring teams and running workshops to upskill engineers/data scienists in distributed ML,
               probabilistic modeling, and modern engineering practices.
            </li>
          </ul>
          Tackling a complex AI or platform challenge?{" "}
                <a
                  href="https://calendar.app.google/JzUn4JQ2pnzmmjLx5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="conversation-link"
                >
                  LET'S TALK
                  </a>
          </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Home2;
