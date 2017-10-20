<?php
extract($_GET);
$servername = "localhost";
$username = "root";
$dbpassword = "";
$dbname='Champions';
$conn = mysqli_connect($servername, $username, $dbpassword,$dbname);
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
$sql="select uname,password from fantasy";
$result=mysqli_query($conn,$sql);
while($row = mysqli_fetch_assoc($result))
{
	$name=$row["uname"];
	$pass=$row["password"];

	if($name==$uname && $pass==$password)
		{header("Refresh:0; url=Fantasy.php"); mysqli_close($conn); die("correct Format");}
	
}
header("Refresh:0; url=Fantasy_League_login.php"); 
mysqli_close($conn);
?>

