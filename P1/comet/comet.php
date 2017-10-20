<!DOCTYPE html>
<html>
<head>
	<title>Comet Response</title>
</head>
<body>
<?php
	//Data format in number of seconds
	//date function to convert it to required format
	//date gives warning to use date_default_timezone_set()
	ob_start();
	date_default_timezone_set('Asia/Kolkata');
	//File modification time is given by...
	$file=fopen("data.txt");
	
	$oldtime = filemtime("data.txt"); //gives modification time of file
	while(true){
	$x=1;
		echo '<script type="text/javascript">';
		clearstatcache(); // update 1
		$newtime = filemtime("data.txt");
		
		if($newtime > $oldtime)
		{
/*			$modtime = date('d M Y H:i:s', $newtime);
			echo "parent.obj.showUptTime('$modtime');";
			//Update the oldtime*/
			echo "parent.obj.showUptTime('score')";
//			echo "parent.obj.showUptTime($line)";
			$x=0;
			$oldtime = $newtime;

		}
		else
		{
			//Send a heartbeat to let the client know that no update occured, but the server is alive
			echo "parent.obj.heartbeat();";
//			echo "parent.obj.showUptTime('heartbeat sent');";
		}
		echo '</script>';
		if($x==0)
		{
			echo fgets($file);
		}
		ob_flush();
		flush();
		//Monitor every 5s		
		sleep(2);
		
	}
	
?>
</body>
</html>
