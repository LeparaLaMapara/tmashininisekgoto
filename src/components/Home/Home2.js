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
              I build {" "}
              <span className="purple">
              AI systems </span>
              that actually work in the real world not just models, but the data, infrastructure, and decisions around them. 
              I’m especially interested in what happens when machine learning meets reality: noisy data, 
              changing environments, limited resources, and human behaviour.
              <br />
              <br />
              My work sits at the intersection of <span className="purple">distributed systems</span>, <span className="purple">probabilistic </span> 
               and <span className="purple">applied machine learning (ML)</span>.
              I enjoy taking ideas from research and turning them into <span className="purple">ML-driven solutions </span> 
              that serve people and organisations such as data pipelines, analytic services, optimisation engines, and platforms that others use.
              <br />
              <br />

             Over time, I’ve found myself less interested in tools and more interested in <span className="purple">systems</span>:
             <br/>
            <br />
            <ul > 
              <li className="about-activity">
              <ImPointRight /> How do you build AI systems that are robust, reliable, and maintainable in real-world under constrainted environments?
              </li>
              <br/>
              <li className="about-activity">
              <ImPointRight /> How do you create engineering cultures that balance innovation with discipline, experimentation with rigor, and speed with quality?
              </li>
              <br/>
              <li className="about-activity">
              <ImPointRight /> How do you build teams that can work effectively with AI systems?
              </li>
           </ul>

            This site is where I think in public.
            I write about what I’m building, what I’m learning, and the patterns I see while working on real problems in industry and research. 
            Some posts are technical, some are reflective, but all of them come from practice not theory alone.

            <br/>
            <br/>

            Long-term, I’m interested in building foundational AI and data platforms, contributing to open systems,
             and helping shape how machine learning is actually used, especially in environments that don’t look like Silicon Valley.

            <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              WORK <span className="purple"> WITH </span> ME
            </h1>
            </Col>

          If you’re curious about AI beyond the demos and hype — how it’s actually
          designed, deployed, and kept running in the real world — you’ll probably
          feel at home here.
          <br />
          <br />


          I spend most of my time helping people turn complex ideas into systems that
          actually work. Sometimes that’s a start-up trying to build something new.
          Other times it’s a large organisation trying to fix or modernise what they
          already have.
          <br />
          <br />

          In practice, that usually means things like:
          <br />
          <br />
    
          <ul >
            <li className="about-activity">
              <ImPointRight /> <span className="purple">Making sense of messy data</span> — helping teams
              understand what data they have, what they can trust, and how to turn it
              into something useful for decisions.
            </li>
            <br />

            <li className="about-activity">
              <ImPointRight /> <span className="purple">Designing AI systems that don’t fall apart</span> —
              not just models, but the data pipelines, infrastructure, and processes around
              them so they work reliably at scale.
            </li>
            <br />

            <li className="about-activity">
                <ImPointRight /> <span className="purple">Modernising existing platforms</span> — helping
                organisations move from slow, fragile systems to faster, more flexible
                setups using modern cloud and data tools.
            </li>
            <br />

            <li className="about-activity">
              <ImPointRight /> <span className="purple">Bringing clarity to complex problems</span> —
                especially where data is large, uncertain, or changing.
            </li>
            <br />

            <li className="about-activity">
              <ImPointRight />  <span className="purple">Helping people/organisations grow</span> — mentoring engineers
              and data scientists, and helping teams build confidence working with
              modern AI and data systems.
            </li>
          </ul>
                If you’re dealing with a tricky AI or data problem or you just want to
                talk things through and see if there’s a fit  I’m always open to a
                conversation. {" "}
                <a
                  href="https://calendar.app.google/JzUn4JQ2pnzmmjLx5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="coffee-button"
                >
                   ☕ LET’S HAVE COFFEE & TALK
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
