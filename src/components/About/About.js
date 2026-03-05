import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/about.png";
import Toolstack from "./Toolstack";
import { ImPointRight } from "react-icons/im";

function About() {
  return (
    <>
      {" "}
      <Particle />
      <Container fluid className="about-section">
        <Container>
          <Row style={{ justifyContent: "center", padding: "10px" }}>
            <Col
              md={7}
              style={{
                justifyContent: "center",
                paddingTop: "30px",
                paddingBottom: "50px",
              }}
            >
              <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
                Know Who <strong className="purple">I'M</strong>
              </h1>
              <Aboutcard />
            </Col>
            <Col
              md={5}
              style={{ paddingTop: "120px", paddingBottom: "50px" }}
              className="about-img"
            >
              <img src={laptopImg} alt="about" className="img-fluid" />
            </Col>
          </Row>
          {/* WORK WITH ME */}
          <Row style={{ paddingTop: "60px", paddingBottom: "60px" }}>
            <Col md={12}>
              <h1 className="project-heading">
                Work <strong className="purple">With Me</strong>
              </h1>
              <p style={{ color: "white", marginBottom: "16px" }}>
                If you're curious about AI beyond the demos and hype — how it's
                actually designed, deployed, and kept running in the real world
                — you'll probably feel at home here.
              </p>
              <p style={{ color: "white", marginBottom: "16px" }}>
                I spend most of my time helping people turn complex ideas into
                systems that actually work. Sometimes that's a start-up trying
                to build something new. Other times it's a large organisation
                trying to fix or modernise what they already have.
              </p>
              <p style={{ color: "white", marginBottom: "12px" }}>
                In practice, that usually means:
              </p>
              <ul>
                <li className="about-activity" style={{ marginBottom: "12px" }}>
                  <ImPointRight />{" "}
                  <span className="purple">Making sense of messy data</span> —
                  helping teams understand what data they have, what they can
                  trust, and how to turn it into something useful for decisions.
                </li>
                <li className="about-activity" style={{ marginBottom: "12px" }}>
                  <ImPointRight />{" "}
                  <span className="purple">
                    Designing AI systems that don't fall apart
                  </span>{" "}
                  — not just models, but the data pipelines, infrastructure, and
                  processes around them so they work reliably at scale.
                </li>
                <li className="about-activity" style={{ marginBottom: "12px" }}>
                  <ImPointRight />{" "}
                  <span className="purple">Modernising existing platforms</span>{" "}
                  — helping organisations move from slow, fragile systems to
                  faster, more flexible setups using modern cloud and data tools.
                </li>
                <li className="about-activity" style={{ marginBottom: "12px" }}>
                  <ImPointRight />{" "}
                  <span className="purple">
                    Bringing clarity to complex problems
                  </span>{" "}
                  — especially where data is large, uncertain, or changing.
                </li>
                <li className="about-activity" style={{ marginBottom: "12px" }}>
                  <ImPointRight />{" "}
                  <span className="purple">
                    Helping people and organisations grow
                  </span>{" "}
                  — mentoring engineers and data scientists, and helping teams
                  build confidence working with modern AI and data systems.
                </li>
              </ul>
              <p style={{ color: "white", margin: "20px 0" }}>
                If you're dealing with a tricky AI or data problem — or you
                just want to talk things through and see if there's a fit — I'm
                always open to a conversation.
              </p>
              <a
                href="https://calendar.app.google/JzUn4JQ2pnzmmjLx5"
                target="_blank"
                rel="noopener noreferrer"
                className="coffee-button"
              >
                ☕ LET'S HAVE COFFEE & TALK
              </a>
            </Col>
          </Row>

          <h1 className="project-heading">
            Professional <strong className="purple">Skillset </strong>
          </h1>

          <Techstack />

          <h1 className="project-heading">
            <strong className="purple">Tools</strong> I use
          </h1>
          <Toolstack />

          <Github />
        </Container>
      </Container>
    </>
  );
}

export default About;
