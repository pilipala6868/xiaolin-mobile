
<?php
	//引入数据库连接
	include('db_login.php');

	$type = $_POST['type'];  //登录&注册

	if ($type == 'login')
		$returnData = login($con);
	else if ($type == 'register')
		$returnData = register($con);

	//输出
	echo json_encode($returnData);

	//登录检测
	function login($con)
	{
		$username = $_POST['username'];
		$password = $_POST['password'];
		$result = mysqli_query($con, "SELECT * FROM user WHERE username = '$username';");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$userData = $row;
		if (!isset($userData))
			return 'undefinded';
		else if ($userData['password'] != md5(md5($password)))
			return 'wrongPassword';
		else
			return array('user_id' => $userData['user_id'], 'name' => $userData['name']);
	}

	//注册
	function register($con)
	{
		$name = $_POST['name'];
		$username = $_POST['username'];
		$password = md5(md5($_POST['password']));
		$email = $_POST['email'];
		$result = mysqli_query($con, "SELECT * FROM user WHERE username = '$username';");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$userData = $row;
		if (isset($userData))
			return 'usernameExist';
		else
		{
			$result = mysqli_query($con, "INSERT INTO user VALUES (user_id, '$name', '$username', '$password', '$email');");
			if ($result)
				return array('user_id' => mysqli_insert_id($con), 'name' => $name);
			else 
				return false;
		}
	}

	mysqli_close($con);
?>