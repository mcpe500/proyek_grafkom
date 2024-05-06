<?php
$dir = isset($_GET['dir']) ? $_GET['dir'] : '.';
if (substr($dir, 0, 1) == '/') {
    $dir = '.' . $dir;
}
$files = scandir($dir);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Simple File Manager</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto Mono', monospace;
            background-color: #f4f4f4;
            color: #333;
            padding: 20px;
        }
        h1 {
            color: #444;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            margin-bottom: 10px;
        }
        a {
            color: #0066cc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
<h1>Simple File Manager</h1>
<h2>Directory: <?php echo $dir; ?></h2>
<ul>
    <?php
    foreach ($files as $file) {
        if ($file == '.') {
            continue;
        }
        if ($file == '..') {
            $parent = dirname($dir);
            echo "<li><a href=\"?dir=$parent\">..</a></li>";
        } else {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                echo "<li><a href=\"?dir=$path\">$file/</a></li>";
            } else {
                echo "<li><a href=\"$path\" target=\"_blank\">$file</a></li>";
            }
        }
    }
    ?>
</ul>
</body>
</html>
