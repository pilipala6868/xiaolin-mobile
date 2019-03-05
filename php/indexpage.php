
<?php
	//引入数据库连接
	include('db_login.php');
	include('same.php');

	$num = isset($_GET['num']) ? $_GET['num'] : 8;  //各板块宝贝数

	//输出
	$returnData = array(
		'slider' => slider($con),
		'newest' => newest($con, $num),
		'recommend' => recommend($con, $num)
	);
	echo json_encode($returnData);

	//获取轮播图
	function slider($con)
	{
		$result = mysqli_query($con, "SELECT * FROM slider ORDER BY slide_id DESC;");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$resultArray[] = $row;
		return $resultArray;
	}

	//获取最近更新（数量）
	function newest($con, $num)
	{
		$result = mysqli_query($con, "SELECT * FROM baby ORDER BY post DESC, baby_id DESC LIMIT 0, $num;");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$resultArray[] = $row;
		return $resultArray;
	}

	mysqli_close($con);
?>