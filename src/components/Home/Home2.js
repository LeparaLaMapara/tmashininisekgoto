import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";
import { ImPointRight } from "react-icons/im";

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
              I build{" "}
              <span className="purple">AI systems</span>{" "}
              that actually work in the real world — not just models, but the
              data, infrastructure, and decisions around them. I'm especially
              interested in what happens when machine learning meets reality:
              noisy data, changing environments, limited resources, and human
              behaviour.
              <br />
              <br />
              My work sits at the intersection of{" "}
              <span className="purple">distributed systems</span>,{" "}
              <span className="purple">probabilistic modeling</span> and{" "}
              <span className="purple">applied machine learning</span>. I enjoy
              taking ideas from research and turning them into{" "}
              <span className="purple">ML-driven solutions</span> that serve
              people and organisations — data pipelines, analytic services,
              optimisation engines, and platforms that others use.
              <br />
              <br />
              Over time, I've found myself less interested in tools and more
              interested in <span className="purple">systems</span>:
            </p>

            <ul>
              <li className="about-activity">
                <ImPointRight /> How do you build AI systems that are robust,
                reliable, and maintainable in the real world under constrained
                environments?
              </li>
              <br />
              <li className="about-activity">
                <ImPointRight /> How do you create engineering cultures that
                balance innovation with discipline, experimentation with rigor,
                and speed with quality?
              </li>
              <br />
              <li className="about-activity">
                <ImPointRight /> How do you build teams that can work
                effectively with AI systems?
              </li>
            </ul>

            <p className="home-about-body">
              This site is where I think in public. I write about what I'm
              building, what I'm learning, and the patterns I see while working
              on real problems in industry and research. Some posts are
              technical, some are reflective, but all of them come from
              practice — not theory alone.
              <br />
              <br />
              Long-term, I'm interested in building foundational AI and data
              platforms, contributing to open systems, and helping shape how
              machine learning is actually used — especially in environments
              that don't look like Silicon Valley.
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
