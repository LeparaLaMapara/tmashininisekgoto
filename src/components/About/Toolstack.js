import React from "react";
import { Col, Row } from "react-bootstrap";
import macOs from "../../Assets/TechIcons/Apple MacOSX.svg";
import chrome from "../../Assets/TechIcons/Google Chrome.svg";
import vsCode from "../../Assets/TechIcons/vscode.svg";
import intelliJ from "../../Assets/TechIcons/intellij-idea.svg";

import { 
  SiAdobephotoshop, 
  SiAdobelightroom, 
  SiBlender, 
} from "react-icons/si";



function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <img src={macOs} alt="macOs" className="tech-icon-images" />
        <div className="tech-icons-text">Mac Os</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons ">
        <img src={chrome} alt="Chrome" className="tech-icon-images" />
        <div className="tech-icons-text">Google Chrome</div>
      </Col>
      <Col xs={4} md={2} className="tech-icons ">
        <img src={vsCode} alt="vsCode" className="tech-icon-images" />
        <div className="tech-icons-text">Vs Code</div>
      </Col>

      <Col xs={4} md={2} className="tech-icons ">
        <img src={intelliJ} alt="go" className="tech-icon-images" />
        <div className="tech-icons-text">IntelliJ</div>
      </Col>

        {/* CREATIVE TOOLS */}
    <Col xs={2} md={2} className="tech-icons">
    <SiAdobephotoshop size={45} color="#31A8FF" />
    <div className="tech-icons-text">Adobe Photoshop</div>
    </Col>

    <Col xs={4} md={2} className="tech-icons">
    <SiAdobelightroom size={45} color="#31A8FF" />
    <div className="tech-icons-text">Adobe Lightroom</div>
    </Col>

    {/* <Col xs={4} md={2} className="tech-icons">
    <SiDavinciresolve size={45} color="#233A5E" />
    <div className="tech-icons-text">DaVinci Resolve</div>
    </Col> */}

    <Col xs={4} md={2} className="tech-icons">
    <SiBlender size={45} color="#F5792A" />
    <div className="tech-icons-text">Blender</div>
    </Col>

    {/* <Col xs={4} md={2} className="tech-icons">
    <img src={flStudio} alt="FL Studio" className="tech-icon-images" />
    <div className="tech-icons-text">FL Studio</div>
    </Col> */}

    </Row>
  );
}

export default Toolstack;
