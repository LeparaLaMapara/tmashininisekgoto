import React from "react";
import { Container, Row, Col, Card, Button, Ratio } from "react-bootstrap";
import Particle from "../Particle"; 
import { TALKS_DATA, WRITINGS_DATA } from "../../constants"; 
import { AiOutlineDownload, AiOutlineRead } from "react-icons/ai"; 

function Talks() {
  // 1. Sort Talks: Create a shallow copy [...] so we don't mutate the original, then sort
  const sortedTalks = [...TALKS_DATA].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // 2. Sort Writings: Create a shallow copy and sort
  const sortedWritings = [...WRITINGS_DATA].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        
        {/* SECTION 1: TALKS & INTERVIEWS */}
        <h1 className="project-heading">
          My <strong className="purple">Talks & Interviews </strong>
        </h1>
        <p style={{ color: "white" }}>
          Sharing knowledge and experiences with the community.
        </p>
        
        <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
          {/* Use sortedTalks here instead of TALKS_DATA */}
          {sortedTalks.map((talk) => (
            <Col md={6} lg={4} className="project-card" key={talk.id}>
              <Card className="project-card-view">
                <div style={{ padding: "10px" }}>
                  <Ratio aspectRatio="16x9">
                    <iframe
                      src={talk.videoUrl}
                      title={talk.title}
                      allowFullScreen
                      style={{ borderRadius: "5px", border: "none" }}
                    />
                  </Ratio>
                </div>
                <Card.Body>
                  <Card.Title>{talk.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
                    {talk.event} | {talk.date}
                  </Card.Subtitle>
                  <Card.Text style={{ textAlign: "justify" }}>
                    {talk.description}
                  </Card.Text>
                  {talk.slidesUrl && (
                    <Button 
                      variant="primary" 
                      href={talk.slidesUrl} 
                      target="_blank"
                      style={{ marginTop: "10px" }}
                    >
                      <AiOutlineDownload /> &nbsp;Download Slides
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* SECTION 2: FEATURED WRITINGS */}
        <h1 className="project-heading" style={{ paddingTop: "20px" }}>
          Featured <strong className="purple">Writings</strong>
        </h1>
        <p style={{ color: "white" }}>
          Technical articles and thoughts on software development.
        </p>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {/* Use sortedWritings here instead of WRITINGS_DATA */}
          {sortedWritings.map((post) => (
            <Col md={4} className="project-card" key={post.id}>
              <Card className="project-card-view" style={{ textAlign: "center" }}>
                {post.image && (
                   <Card.Img 
                     variant="top" 
                     src={post.image} 
                     alt="card-img" 
                     style={{ maxHeight: "200px", objectFit: "cover", opacity: 0.9 }}
                   />
                )}
                
                <Card.Body>
                  <Card.Title style={{ fontWeight: "700" }}>{post.title}</Card.Title>
                  <p style={{ color: "gray", fontSize: "0.9em" }}>{post.date}</p>
                  
                  <Card.Text style={{ textAlign: "justify" }}>
                    {post.description}
                  </Card.Text>
                  
                  <Button variant="primary" href={post.link} target="_blank">
                    <AiOutlineRead /> &nbsp;Read Article
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

      </Container>
    </Container>
  );
}

export default Talks;