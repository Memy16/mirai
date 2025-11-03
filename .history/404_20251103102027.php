<?php
http_response_code(404);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Error 404</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
    }
    img {
      cursor: pointer;
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <a href="index.html">
    <img src="404.gif" alt="404 Not Found">
  </a>
</body>
</html>
