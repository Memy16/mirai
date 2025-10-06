<?php
require("loadenv.php");
header("Content-Type: application/json");
echo json_encode(["sitekey" => $_ENV["HCAPTCHA_SITEKEY"] ?? ""]);
