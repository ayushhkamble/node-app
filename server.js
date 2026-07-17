const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>CloudBlitz DevOps CI/CD Pipeline</title>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
font-family:'Poppins',sans-serif;
}

body{

display:flex;
justify-content:center;
align-items:center;

min-height:100vh;

background:linear-gradient(-45deg,#0f172a,#1d4ed8,#2563eb,#06b6d4);
background-size:400% 400%;
animation:bg 12s ease infinite;

overflow:hidden;

color:white;

}

@keyframes bg{

0%{background-position:0% 50%;}
50%{background-position:100% 50%;}
100%{background-position:0% 50%;}

}

.card{

width:900px;
max-width:92%;

padding:50px;

background:rgba(255,255,255,.12);

backdrop-filter:blur(15px);

border:1px solid rgba(255,255,255,.2);

border-radius:25px;

box-shadow:0 15px 45px rgba(0,0,0,.4);

text-align:center;

animation:fade .8s ease;

}

@keyframes fade{

from{

opacity:0;
transform:translateY(30px);

}

to{

opacity:1;
transform:translateY(0);

}

}

.logo{

font-size:70px;

margin-bottom:15px;

animation:float 3s ease-in-out infinite;

}

@keyframes float{

0%,100%{

transform:translateY(0);

}

50%{

transform:translateY(-10px);

}

}

h1{

font-size:42px;

color:#38bdf8;

margin-bottom:10px;

}

h2{

font-size:28px;

font-weight:500;

color:#fde047;

margin-bottom:30px;

}

.description{

font-size:18px;

line-height:1.8;

margin-bottom:20px;

}

.pipeline{

display:flex;

justify-content:center;

flex-wrap:wrap;

gap:15px;

margin:35px 0;

}

.step{

background:#1e293b;

padding:12px 22px;

border-radius:30px;

font-weight:bold;

transition:.3s;

box-shadow:0 5px 15px rgba(0,0,0,.3);

}

.step:hover{

background:#2563eb;

transform:translateY(-6px);

}

.arrow{

display:flex;

align-items:center;

font-size:24px;

color:#38bdf8;

}

.status{

display:inline-block;

margin-top:25px;

padding:15px 35px;

background:#16a34a;

border-radius:40px;

font-size:20px;

font-weight:bold;

box-shadow:0 0 25px rgba(34,197,94,.5);

animation:pulse 2s infinite;

}

@keyframes pulse{

0%{transform:scale(1);}
50%{transform:scale(1.05);}
100%{transform:scale(1);}

}

.tech{

display:flex;

justify-content:center;

gap:12px;

flex-wrap:wrap;

margin-top:35px;

}

.tech span{

background:#0f172a;

padding:10px 20px;

border-radius:25px;

font-size:15px;

transition:.3s;

}

.tech span:hover{

background:#0284c7;

transform:scale(1.05);

}

.info{

margin-top:35px;

font-size:16px;

line-height:1.8;

color:#d1d5db;

}

footer{

margin-top:40px;

padding-top:20px;

border-top:1px solid rgba(255,255,255,.2);

font-size:15px;

color:#cbd5e1;

}

.highlight{

color:#38bdf8;
font-weight:bold;

}

</style>

</head>

<body>

<div class="card">

<div class="logo">🚀</div>

<h1>CloudBlitz DevOps CI/CD Pipeline with GitHub Integration</h1>

<h2>GitHub Webhook Triggered Deployment Successfully</h2>

<p class="description">
This application has been automatically built, containerized,
published, and deployed using a complete
<strong>CI/CD pipeline</strong>.
</p>

<div class="pipeline">

<div class="step">GitHub</div>

<div class="arrow">➡</div>

<div class="step">Webhook</div>

<div class="arrow">➡</div>

<div class="step">Jenkins</div>

<div class="arrow">➡</div>

<div class="step">Docker</div>

<div class="arrow">➡</div>

<div class="step">Docker Hub</div>

<div class="arrow">➡</div>

<div class="step">Amazon EKS</div>

</div>

<div class="status">
✅ Latest Build Successfully Deployed
</div>

<div class="tech">

<span>⚙️ Jenkins</span>

<span>🐳 Docker</span>

<span>☸ Kubernetes</span>

<span>☁ AWS EKS</span>

<span>📦 Docker Hub</span>

<span>🟢 Node.js</span>

<span>🚀 Express</span>

</div>

<div class="info">

<p><strong>Deployment Time:</strong> ${new Date().toLocaleString()}</p>

<p><strong>Environment:</strong> Production</p>

<p><strong>Status:</strong> Healthy ✔</p>

<p><strong>Health Endpoint:</strong> /health</p>

</div>

<footer>

<p>
Made with ❤️ by
<span class="highlight">Ayush Kamble</span>
</p>

<p>
CloudBlitz DevOps Internship Project
</p>

</footer>

</div>

</body>

</html>
`);
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        application: "CloudBlitz DevOps CI/CD Demo",
        environment: "Production",
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("=====================================");
    console.log("🚀 CloudBlitz DevOps Application");
    console.log("=====================================");
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
    console.log("=====================================");
});

module.exports = app;