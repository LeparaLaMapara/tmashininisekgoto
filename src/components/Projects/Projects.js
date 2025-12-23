import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";


import UAIE from "../../Assets/Projects/1.png";
import thabangvision from "../../Assets/Projects/2.png";
import IBMsuites from "../../Assets/Projects/3.png";
import WitsRecommender from "../../Assets/Projects/4.png";
import CovidDashboard from "../../Assets/Projects/5.png";
import KasilamProjects from "../../Assets/Projects/6.png";
import thabangvision2 from "../../Assets/Projects/7.png";
import DSIDE from "../../Assets/Projects/8.png";
import SmartGenerators from "../../Assets/Projects/9.png";
import TFfiltersPy from "../../Assets/Projects/10.png";
import MSC from "../../Assets/Projects/11.png";



function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={UAIE}
              isBlog={false}
              title="Ubunye AI Ecosystems (UAIE)"
              description={`Problem: ABSA lacked consistent ML/ETL standards, reusable engineering patterns, and scalable workflows.\n
              Solution: Built a modular open-source ecosystem providing declarative ETL engines, ML pipelines, feature stores, and YAML-driven orchestration.\n
              Impact: Accelerated model delivery, data improved quality, and uplifted engineering capability across teams.\n
              Skills: Python, Dask, Spark, YAML, Databricks, Docker, CI/CD, Software Engineering.`}
              ghLink="https://github.com/ubunye-ai-ecosystems"
              demoLink="https://github.com/ubunye-ai-ecosystems/ubunye_engine"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={TFfiltersPy}
              isBlog={false}
              title="Tfilterspy — Bayesian Filtering Library"
              description={`Problem: IoT and telematics pipelines required robust filtering for noisy sensor data and real-time state estimation.\n
              Solution: Created an open-source Bayesian filtering library supporting Kalman, Particle, and Ensemble filters with distributed execution.\n
              Impact: Improved reliability of IoT forecasting, telematics scoring, and real-time analytics at scale.\n
              Skills: Python, NumPy, Dask, PyPI, CI/CD, Software Engineering.`}
              ghLink="https://github.com/ubunye-ai-ecosystems/tfilterspy"
              demoLink="hhttps://ubunye-ai-ecosystems.github.io/tfilterspy/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={KasilamProjects}
              isBlog={false}
              title="Kasilam Projects"
              description={`Problem: Township businesses lacked affordable digital presence and branding tools.\n
              Solution: Developed scalable web templates and branding systems deployed on cost-free hosting.\n
              Impact: Enabled SMEs to reach customers online and strengthen brand identity.\n
              Skills: HTML, CSS, JavaScript, React, GitHub Pages.`}
              ghLink="https://github.com/orgs/Kasilam-Projects/repositories"
              // demoLink="https://editor.soumya-jit.tech/"              
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={SmartGenerators}
              isBlog={true}
              title="Vodacom Smart Generators Optimization"
              description={`Problem: Load-shedding caused fuel inefficiency, network downtime, and poor generator deployment decisions.\n
              Solution: Developed a constrained optimisation engine with real-time streaming analytics to prioritise generator dispatch.\n
              Impact: Reduced downtime by 5%, lowered operational costs by 30%, and supported R1B annual savings.\n
              Skills: PyFlink, Kafka, CVXPY, PySpark, Kubernetes, Docker, GitLab CI.`}
              ghLink="https://github.com/soumyajit4419/Plant_AI"
              demoLink="https://www.vodacombusiness.co.za/business/solutions/internet-of-things/smart-generator-monitoring"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={IBMsuites}
              isBlog={false}
              title="IBM GeoSpatial Analytics Suites"
              description={`Problem: Enterprises required scalable geospatial intelligence for environmental, climate, and supply-chain risk.\n
              Solution: Built analytics workflows using IBM PAIRS to process multi-terabyte raster and vector datasets.\n
              Impact: Integrated into IBM’s Environmental Intelligence Suite for global environmental monitoring.\n
              Skills: IBM PAIRS, IBM Cloud, Airflow, Python, Hadoop, GeoPandas, Rasterio, TensorFlow.`}
              // ghLink="https://github.com/soumyajit4419/AI_For_Social_Good"
              demoLink="https://www.ibm.com/products/environmental-intelligence-suite" 
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={CovidDashboard}
              isBlog={false}
              title="IBM Covid Monitoring Dashboard"
              description={`Problem: Public health teams needed real-time visibility of COVID-19 hotspots.\n
              Solution: Built an interactive dashboard with automated heatmaps and case-tracking visualisations.\n
              Impact: Used by Gauteng Department of Health for hotspot identification and rapid response.\n
              Skills: Python, Dash, Plotly, Folium, Leaflet, IBM Cloud.`}
              // ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
              demoLink="https://gpcoronavirus.co.za/"      
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={thabangvision}
              isBlog={false}
              title="Photography Gallery Website"
             description={`Problem: Traditional photography portfolios are expensive to build and maintain, limiting access for upcoming township photographers.\n
              Solution: Designed and developed a fully responsive portfolio website using HTML, CSS, and JavaScript, including dynamic features such as lightbox viewing and interactive galleries.\n
              Impact: Enabled photographers to present their work professionally, improving brand identity and client engagement within the Kasilam digital ecosystem.\n
              Skills: HTML, CSS, JavaScript, GitHub Pages, CD/CI.`}
              ghLink="https://github.com/orgs/Kasilam-Projects/repositories"
              demoLink="https://thabanglukhetho.github.io/Photography/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={thabangvision2}
              isBlog={false}
              title="Photography Portfolio Website"
             
                description={`Problem: Many township creatives and small businesses struggle to showcase their visual work online due to high hosting costs and lack of technical skill.\n
              Solution: Built a responsive photography gallery using React.js, enabling high-quality image rendering, grid layouts, and fast client-side navigation.\n
              Impact: Provided an accessible platform for township creatives to display their work professionally and attract clients online.\n
              Skills: React.js, JavaScript, CSS, GitHub Pages, CI/CD.`}
              ghLink="https://github.com/orgs/Kasilam-Projects/repositories"
              demoLink="https://realthabanglukhetho.github.io/photography/index.html"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={DSIDE}
              isBlog={false}
              title="Smart Municipality Analytics Dashboard (CSIR DSIDE)"
              description={`Problem: Municipal managers lacked predictive tools for service delivery optimisation.\n
              Solution: Developed ML models (SVM, Random Forest, PCA) and delivered insights via a Django dashboard.\n
              Impact: Improved municipal planning and youth unemployment analytics for the City of Cape Town.\n
              Skills: Python, Django, PostgreSQL, HTML/CSS, PCA, SVM, Random Forest.`}
              ghLink="https://github.com/LeparaLaMapara/DSIDE"
              demoLink="https://prezi.com/view/DltmNuhuwJH3mcKxkPEH/"
            />
          </Col>

            <Col md={4} className="project-card">
            <ProjectCard
              imgPath={WitsRecommender}
              isBlog={false}
              title="Smart Wits Course Recommender System"
              description={`Problem: First-year students struggled to choose optimal courses, leading to poor completion rates.\n
              Solution: Built a K-modes clustering recommendation engine deployed via an interactive dashboard.\n
              Impact: Achieved 90% silhouette score and enabled more informed decision-making for students and advisors.\n
              Skills: Python, Scikit-Learn, Pandas, PowerBI.`}
              ghLink="https://github.com/LeparaLaMapara/Wits-Recommendation-System"
              // demoLink="https://chatify-49.web.app/"
            />
          </Col>

         <Col md={4} className="project-card">
            <ProjectCard
              imgPath={MSC}
              isBlog={false}
              title="Echo State Network for Iterative Image Segmentation"
              description={`Problem: Iterative segmentation using RNNs was computationally expensive.\n
              Solution: Designed an Echo State Network architecture enabling efficient segmentation with reduced training overhead.\n
              Impact: Published research demonstrating competitive performance at a fraction of compute cost.\n
              Skills: Python, NumPy, SciPy, Pytorch, Image Processing, Deep Learning.`}
              ghLink="https://github.com/LeparaLaMapara/ESNIterativeSegmentation/tree/master"
              demoLink="https://wiredspace.wits.ac.za/items/2c23f3d9-05fd-410e-ad52-31ecffbbf643"
            />
          </Col>

        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
