<?php
	header("Content-type:video/mp4");
	$file = fopen("Champions2017.mp4", "rb"); //rb - binary mode read
	$data = fread($file, filesize("Champions2017.mp4"));
	echo $data;
?>
