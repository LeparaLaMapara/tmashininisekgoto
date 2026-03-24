import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";

import UAIE from "../../Assets/Projects/1.png";
import IBMsuites from "../../Assets/Projects/3.png";

import KasilamProjects from "../../Assets/Projects/6.png";
import SmartGenerators from "../../Assets/Projects/9.png";
import TFfiltersPy from "../../Assets/Projects/10.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>

        {/* SECTION 1: OPEN SOURCE */}
        <h1 className="project-heading">
          Open <strong className="purple">Source</strong>
        </h1>
        <p style={{ color: "white" }}>
          Frameworks, libraries, and tools I built, own, and maintain publicly.
        </p>

        <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={UAIE}
              title="Ubunye AI Ecosystems (UAIE)"
              description={`Problem: ABSA lacked consistent ML/ETL standards, reusable engineering patterns, and scalable workflows.\n
              Solution: Built a modular open-source ecosystem providing declarative ETL engines, ML pipelines, feature stores, and YAML-driven orchestration.\n
              Impact: Accelerated model delivery, improved data quality, and uplifted engineering capability across teams.\n
              Skills: Python, Dask, Spark, YAML, Databricks, Docker, CI/CD, Software Engineering.`}
              ghLink="https://github.com/ubunye-ai-ecosystems"
              productLink="https://ubunye-ai-ecosystems.github.io/ubunye_engine/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={TFfiltersPy}
              title="Tfilterspy — Bayesian Filtering Library"
              description={`Problem: IoT and telematics pipelines required robust filtering for noisy sensor data and real-time state estimation.\n
              Solution: Created an open-source Bayesian filtering library supporting Kalman, Particle, and Ensemble filters with distributed execution.\n
              Impact: Improved reliability of IoT forecasting, telematics scoring, and real-time analytics at scale.\n
              Skills: Python, NumPy, Dask, PyPI, CI/CD, Software Engineering.`}
              ghLink="https://github.com/ubunye-ai-ecosystems/tfilterspy"
              productLink="https://ubunye-ai-ecosystems.github.io/tfilterspy"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={KasilamProjects}
              title="Kasilam Digital Platforms"
              description={`Problem: Township businesses lacked affordable digital presence and branding tools.\n
              Solution: Developed scalable web templates and branding systems deployed on cost-free hosting.\n
              Impact: Enabled SMEs to reach customers online and strengthen brand identity.\n
              Skills: HTML, CSS, JavaScript, React, GitHub Pages.`}
              ghLink="https://github.com/orgs/Kasilam-Projects/repositories"
              productLink="https://kasilamdigitialplatforms.vercel.app/"
            />
          </Col>
        </Row>

        {/* SECTION 2: PROFESSIONAL & RESEARCH */}
        <h1 className="project-heading">
          Professional & <strong className="purple">Research Work</strong>
        </h1>
        <p style={{ color: "white" }}>
          Delivered at scale in industry and academic institutions — with real stakes, real data, and real impact.
        </p>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={SmartGenerators}
              title="Vodacom Smart Generators Optimization"
              description={`Problem: Load-shedding caused fuel inefficiency, network downtime, and poor generator deployment decisions.\n
              Solution: Developed a constrained optimisation engine with real-time streaming analytics to prioritise generator dispatch.\n
              Impact: Reduced downtime by 5%, lowered operational costs by 30%, and supported R1B annual savings.\n
              Skills: PyFlink, Kafka, CVXPY, PySpark, Kubernetes, Docker, GitLab CI.`}
              productLink="https://www.vodacombusiness.co.za/business/solutions/internet-of-things/smart-generator-monitoring"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={IBMsuites}
              title="IBM GeoSpatial Analytics Suites"
              description={`Problem: Enterprises required scalable geospatial intelligence for environmental, climate, and supply-chain risk.\n
              Solution: Built analytics workflows using IBM PAIRS to process multi-terabyte raster and vector datasets.\n
              Impact: Integrated into IBM's Environmental Intelligence Suite for global environmental monitoring.\n
              Skills: IBM PAIRS, IBM Cloud, Airflow, Python, Hadoop, GeoPandas, Rasterio, TensorFlow.`}
              productLink="https://www.ibm.com/products/environmental-intelligence-suite"
            />
          </Col>


        </Row>

      </Container>
    </Container>
  );
}

export default Projects;
