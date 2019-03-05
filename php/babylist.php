
<?php
	//引入数据库连接
	include('db_login.php');
	include('same.php');

	$pageType = $_GET['type'];  //分类
	if (strstr($pageType, '_'))
	{
		$pageType = explode('_', $pageType);
		$pageType = $pageType[0].'_'.$pageType[1];
	}
	$pageNum = $_GET['pageNum'];  //每页宝贝数量
	$pageNow = $_GET['pageNow'];  //当前页数
	$pageSort = $_GET['sortWay'];  //排序方式
	$pageOrder = 'DESC';  //升序降序
	if ($pageSort == 'priceUp')
	{
		$pageSort = 'price';
		$pageOrder = 'ASC';
	}
	$indexStart = $pageNum * ($pageNow - 1);  //起始s下标

	//获取数据
	if ($pageType == 'all')
	{
		$returnData = babyAll($con, $pageNum, $indexStart, $pageSort, $pageOrder);
	}
	else
	{
		$returnData = babyClassify($con, $pageType, $pageNum, $indexStart, $pageSort, $pageOrder);
	}
	//输出
	echo json_encode($returnData);

	//获取全部宝贝
	function babyAll($con, $pageNum, $indexStart, $pageSort, $pageOrder)
	{
		$result = mysqli_query($con, "SELECT * FROM baby ORDER BY $pageSort $pageOrder, baby_id DESC LIMIT $indexStart, $pageNum;");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$resultArray[] = $row;

		//总宝贝数
		$result = mysqli_query($con, "SELECT COUNT(*) FROM baby;");
		$resultSum = mysqli_fetch_array($result, MYSQLI_ASSOC)['COUNT(*)'];

		$returnData = array(
			'babyAll' => $resultArray,
			'babySum' => $resultSum
		);
		return $returnData;
	}

	//获取某个分类的宝贝
	function babyClassify($con, $pageType, $pageNum, $indexStart, $pageSort, $pageOrder)
	{
		//父分类
		$fatherCategory = ['monthlyupdate', 'saxophone', 'quartet'];
		//获取该分类所有宝贝id
		if (in_array($pageType, $fatherCategory))
		{
			//是父分类，先找到所有子分类id再查询
			$sql = "SELECT DISTINCT baby_id FROM classify WHERE category_id IN (
				SELECT category_id FROM category WHERE father_id = (
				SELECT category_id FROM category WHERE name_en = '$pageType'
			));";
		}
		else
		{
			//直接查找该分类所有宝贝id
			$sql = "SELECT baby_id FROM classify WHERE category_id = (
				SELECT category_id FROM category WHERE name_en = '$pageType'
			);";
		}
		$result = mysqli_query($con, $sql);
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$allBabyId[] = $row['baby_id'];
		$resultSum = count($allBabyId);  //该分类宝贝总数
		$allBabyIdStr = "(".join(", ", $allBabyId).")";  //该分类所有宝贝id的字符串形式

		//查询所有宝贝信息
		$result = mysqli_query($con, "SELECT * FROM baby WHERE baby_id IN $allBabyIdStr ORDER BY $pageSort $pageOrder, baby_id DESC LIMIT $indexStart, $pageNum;;");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
			$resultArray[] = $row;

		$returnData = array(
			'babyAll' => $resultArray,
			'babySum' => $resultSum
		);
		return $returnData;
	}

	mysqli_close($con);
?>
