<?php
	error_reporting(E_ERROR | E_WARNING | E_PARSE);

	if(!isset($_GET["s"]) || !preg_match("/^[a-zA-Z0-9]+$/", $_GET["s"]))
	{
		header("Location: edit.php");
		exit();
	}

	require 'Predis/Autoloader.php';
	Predis\Autoloader::register();

	$redis = new Predis\Client();
	$stream = "streamcd_" . $_GET["s"];

	if(!$redis->exists($stream))
		die("Unknown stream " . $_GET["s"]);

	$config = json_decode($redis->get($stream), true);
?>
<html>
	<head>
		 <link rel="stylesheet" type="text/css" href="static/styles.css" />
	</head>
	<body style="background-color: <?= $config["bgcolor"] ?>;">
		<div id="output" class="display-output">
			<noscript>Please enable Javascript</noscript>
		</div>

		<div id="footer">
			<a href="login.php?s=<?= $_GET["s"] ?>">edit</a>
		</div>

		<script>
			var streamOnline = false;
			var twitchName = "<?= $config["name"] ?>";
			var timeFormat = "<?= $config["timeFormat"] ?>";
			var streamerOffset = <?= $config["timezone"] ?>;
			var offlineMessage = <?= json_encode($config["offlineMessage"] ); ?>;
			var onlineMessage = <?= json_encode($config["onlineMessage"] ); ?>;
			var sortedTimes = <?= $config["sortedTimes"] ?>;
		</script>
		<script type="text/javascript" src="static/moment.js"></script>
		<script type="text/javascript" src="static/main.js"></script>
	</body>
</html>
