<html>
<head>
<title>signUp</title>
<link rel="stylesheet" type="text/css" href="iccSignup.css"/>

</head>
<body class="signUp">
<div class = "signUp">
<h1 align = "center"> Sign Up </h1>
<form method = "get" action = "signUp_insert.php">
<label style = "font-size:72 px">First Name :<input type="text" id = "Fname" name = "fname" placeholder = "First Name" required/></label><br/><br/>

<label>Last Name :<input type = "text" id = "Lname" name = "lname" placeholder = "Last Name" required/></label><br/><br/>
<label>Username :<input type="text"  id = "username" name = "uname" placeholder = "username" required/></label><br/><br/>

<label>Gender :<select name = "gender">
<option value = "Male" name = "Male">Male</option>
<option value = "Female" name = "Female">Female</option>
</select></label><br/><br/>
<label>Date Of Birth:<input type="date" name="bday" ></label>
<br/><br/>
<label>Favourite Team :<select name = "branch">
<option value = "IND" name = "IND">India</option>
<option value = "AUS" name = "AUS">Australia</option>
<option value = "ENG" name = "ENG">England</option>
<option value = "SA" name = "SA">South Africa</option>
<option value = "NZ" name = "NZ">New Zealand</option>
<option value = "BAN" name = "BAN">Bangladesh</option>
<option value = "SL" name = "SL">Sri Lanka</option>
<option value = "PAK" name = "PAK">Pakistan</option>
</select></label><br/><br/>

<label>Email :<input type = "email" id = "email" name = "email" placeholder = "Email" required/></label><br/><br/>
<label>Password : <input type="password" id = "pass" name="password" placeholder="password" required/></label><br/><br/>
<label>Mobile :<input type = "number" name = "phone" id = "mobile" placeholder = "Mobile" min="1000000000" max = "9999999999" size = "8ex" required/></label><br/><br/>
<div align="center"><input type = "submit" name = "submit" value = "Submit" /></div>
</form>
</div>
</body>
</html>

