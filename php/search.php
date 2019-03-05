
<?php
	//引入数据库连接
	include('db_login.php');
	include('same.php');

	$keyWord = $_GET['keyWord'];  //分类
	$pageNum = $_GET['pageNum'];  //每页宝贝数量
	$pageNow = $_GET['pageNow'];  //当前页数
	$indexStart = $pageNum * ($pageNow - 1);  //起始s下标

	//获取数据
	$returnData = babySearch($con, $keyWord, $pageNum, $indexStart);
	//输出
	echo json_encode($returnData);

	//搜索宝贝
	function babySearch($con, $keyWord, $pageNum, $indexStart)
	{
		$result = mysqli_query($con, "SELECT * FROM baby WHERE name LIKE '%$keyWord%' ORDER BY baby_id DESC LIMIT $indexStart, $pageNum;");
		$resultArray = array();
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$resultArray[] = $row;

		//总宝贝数
		$result = mysqli_query($con, "SELECT COUNT(*) FROM baby WHERE name LIKE '%$keyWord%'");
		$resultSum = mysqli_fetch_array($result, MYSQLI_ASSOC)['COUNT(*)'];

		$returnData = array(
			'babyAll' => $resultArray,
			'babySum' => $resultSum
		);
		return $returnData;
	}

	mysqli_close($con);
?>
