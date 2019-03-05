
<?php

	//获取宝贝推荐（数量）
	function recommend($con, $num, $baby_id=0)
	{
		//获取多个在ID内的随机数
		$result = mysqli_query($con, "SELECT MAX(baby_id) FROM baby;");
		$maxId = mysqli_fetch_array($result, MYSQLI_ASSOC)['MAX(baby_id)'];
		$numbers = range(1, $maxId);
		$numbers = array_diff($numbers, [$baby_id]);  //去掉当前页面的baby_id
		shuffle($numbers); 
		$randomNum = array_slice($numbers, 0, $num);

		//获取数据
		$result = mysqli_query($con, "SELECT * FROM baby WHERE baby_id IN (".implode(',', $randomNum).");");
		while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) 
			$resultArray[] = $row;

		//若获取到ID已删除的空白数据
		$i = 0;
		while (count($resultArray) < $num)
		{
			$temp = null;
			while (empty($temp))
			{
				$result = mysqli_query($con, "SELECT * FROM baby WHERE baby_id = ".$numbers[$num+$i].";");
				$temp = mysqli_fetch_array($result, MYSQLI_ASSOC);
				$i++;
			}
			$resultArray[] = $temp;
		}

		shuffle($resultArray);  //随机顺序
		return $resultArray;
	}

?>