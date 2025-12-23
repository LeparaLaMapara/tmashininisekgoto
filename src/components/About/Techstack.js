import React from "react";
import { Col, Row } from "react-bootstrap";
import { SiNextdotjs, SiSolidity } from "react-icons/si";
import { FaRust } from "react-icons/fa";
import Go from "../../Assets/TechIcons/go.svg";
import C from "../../Assets/TechIcons/C++.svg";
import Javascript from "../../Assets/TechIcons/Javascript.svg";
import Node from "../../Assets/TechIcons/Node.svg";
import ReactIcon from "../../Assets/TechIcons/React.svg";
import HaskellIcon from "../../Assets/TechIcons/Haskell.svg";
import Java from "../../Assets/TechIcons/Java.svg";
import Python from "../../Assets/TechIcons/Python.svg";
import Typescript from "../../Assets/TechIcons/Typescript.svg";
import Git from "../../Assets/TechIcons/Git.svg";
import Firebase from "../../Assets/TechIcons/Firebase.svg";
import Redis from "../../Assets/TechIcons/Redis.svg";
import Docker from "../../Assets/TechIcons/Docker.svg";
import Mongo from "../../Assets/TechIcons/Mongo.svg";
import SQL from "../../Assets/TechIcons/SQL.svg";
import Kubernates from "../../Assets/TechIcons/Kubernates.svg";
import Redux from "../../Assets/TechIcons/Redux.svg";
import Tailwind from "../../Assets/TechIcons/Tailwind.svg";
import MUI from "../../Assets/TechIcons/MUI.svg";
import Postman from "../../Assets/TechIcons/Postman.svg";
import AWS from "../../Assets/TechIcons/AWS.svg";
import Kafka from "../../Assets/TechIcons/Kafka.svg";

import { SiPytorch, SiTensorflow, SiMysql, SiDatabricks, SiMicrosoftsqlserver,
  SiScikitlearn, SiMlflow,SiApachespark,SiLinux,
  SiDask, SiApacheairflow, SiApacheflink } from "react-icons/si";


function Techstack() {
  return (
<Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
    <Col xs={4} md={2} className="tech-icons">
  <SiPytorch size={45} color="#EE4C2C" />
  <div className="tech-icons-text">PyTorch</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <SiTensorflow size={45} color="#FF6F00" />
  <div className="tech-icons-text">TensorFlow</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <SiScikitlearn size={45} color="#F7931E" />
  <div className="tech-icons-text">Scikit-Learn</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <SiDatabricks size={45} color="#FF3621" />
  <div className="tech-icons-text">Databricks</div>
</Col>

<Col xs={4} md={2} className="tech-icons">
  <img src={AWS} alt="Postman" className="tech-icon-images" />
  <div className="tech-icons-text">AWS</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <SiApachespark size={45} color="#E25A1C" />
  <div className="tech-icons-text">Apache Spark</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <SiApacheflink size={45} color="#E6526F" />
  <div className="tech-icons-text">Apache Flink</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <SiDask size={45} color="#F9A03C" />
  <div className="tech-icons-text">Dask</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Firebase} alt="Firebase" />
  <div className="tech-icons-text">Firebase</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Typescript} alt="Typescript" />
  <div className="tech-icons-text">Typescript</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Redis} alt="Redis" />
  <div className="tech-icons-text">Redis</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Node} alt="Node.js" />
  <div className="tech-icons-text">Node.js</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <SiMlflow size={45} color="#0194E2" />
  <div className="tech-icons-text">MLflow</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <SiApacheairflow size={45} color="#007A88" />
  <div className="tech-icons-text">Airflow</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Docker} alt="Docker" />
  <div className="tech-icons-text">Docker</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Kubernates} alt="Kubernetes" />
  <div className="tech-icons-text">Kubernetes</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Python} alt="Python" />
  <div className="tech-icons-text">Python</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Javascript} alt="Javascript" />
  <div className="tech-icons-text">Javascript</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Java} alt="Java" />
  <div className="tech-icons-text">Java</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <FaRust size={45} />
  <div className="tech-icons-text">Rust</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Go} alt="Go" />
  <div className="tech-icons-text">Go</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={C} alt="C++" />
  <div className="tech-icons-text">C++</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={ReactIcon} alt="React" />
  <div className="tech-icons-text">React.js</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <SiNextdotjs size={45} />
  <div className="tech-icons-text">Next.js</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Tailwind} alt="Tailwind" />
  <div className="tech-icons-text">Tailwind CSS</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={MUI} alt="MUI" />
  <div className="tech-icons-text">Material UI</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Mongo} alt="MongoDB" />
  <div className="tech-icons-text">MongoDB</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <SiMysql size={45} />
  <div className="tech-icons-text">MySQL</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <SiMicrosoftsqlserver size={45} />
  <div className="tech-icons-text">SQL Server</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={SQL} alt="PostgreSQL" />
  <div className="tech-icons-text">PostgreSQL</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Git} alt="Git" />
  <div className="tech-icons-text">Git</div>
</Col>
<Col xs={4} md={2} className="tech-icons">
  <img src={Postman} alt="Postman" />
  <div className="tech-icons-text">Postman</div>
</Col>


   <Col xs={4} md={2} className="tech-icons">
        <img src={Kafka} alt="Kafka" className="tech-icon-images" />
        <div className="tech-icons-text">Kafka</div>
      </Col>

<Col xs={4} md={2} className="tech-icons">
  <SiLinux size={45} />
  <div className="tech-icons-text">Linux</div>
</Col>
    </Row>
  );
}

export default Techstack;
