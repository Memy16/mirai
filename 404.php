<?php
http_response_code(404);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Error 404</title>
  <style>
    html, body {
      margin: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
    }
    a img {
      width: 100vw;
      height: 100vh;
      object-fit: contain;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <a href="index.html">
    <img src="404.gif" alt="404 Not Found">
  </a>
</body>
</html>
