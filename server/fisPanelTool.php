<?php

@error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);


function gatherResource($pathArray, $target) {
  if(is_array($pathArray)) {
    foreach ($pathArray as $path) {
      # code...
      shell_exec('mv ' . $path . ' ' . $target);
    }
  }
}

# 目录名称: folderName/...
function getTargz($folderName) {
  $tarName = $folderName . 'tar.gz';
  shell_exec('tar -zcvf ' . $tarName. ' ' . $folderName);
  return '/static/' . $tarName;
}

if($_POST['method']) {
  switch ($_POST['method']) {
    case 'pkg':
      $pathArray = $_POST['pathArray'];
      gatherResource($pathArray, '/static');

      break;
    default:
      # code...
      break;
  }
} else {
  echo 'fis panel is ready!';
}