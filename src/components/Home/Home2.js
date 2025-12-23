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
              I’m a{" "}
              <span className="purple">
                Computer Science AI Researcher and Systems Engineer
              </span>{" "}
              working at the intersection of applied distributed machine learning, probabilistic
              modelling, and large-scale data engineering.

              I design and operationalise real-world AI systems — from data pipelines and
              streaming architectures to ML models, optimisation engines, production scoring
              services, and decision-focused interfaces.
              <br />
              <br />

              Over the years, I’ve led and delivered <span className="purple">ML/AI-driven, mission-critical platforms</span> across{" "}
              <span className="purple">
                telecoms, banking, education, and research
              </span>{" "}
              — spanning national-scale network optimisation at <span className="purple">Vodacom</span>, 
              global geospatial and climate risk intelligence platforms at <span className="purple">IBM</span>, 
              strategic modernisation of data science and engineering capabilities at <span className="purple">Wits BIS</span>,
              and enterprise-wide Databricks-based ML transformations at <span className="purple">ABSA</span>.

          <h2 className="purple" style={{ marginTop: "2rem" }}>
          WORK WITH ME
          </h2>

            I work with founders, start-ups,leadership teams, and technical organisations to design,
            modernise, and scale real-world AI and data science and engineering platforms.

          <ul >
            <li>
            <span className="purple">AI & data science consulting</span> — strategy, system design, and hands-on execution
            </li>
            <li>
              <span className="purple">Enterprise ML & cloud transformation</span> — Databricks, streaming, and production ML platforms
            </li>
            <li>
              <span className="purple">Advanced analytics & decision systems</span> — turning complex data into operational insights
            </li>
            <li>
              <span className="purple">Technical leadership</span> — consulting and senior/principal engagements
            </li>
            <li>
              <span className="purple">Capability enablement</span> — Datascience/engineering training, mentoring, and workshops
            </li>
          </ul>

          If you’re tackling complex AI, data, or platform challenges and need a
            technically deep partner who can operate across research, engineering, and
            execution, I’m open to an initial conversation.
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
