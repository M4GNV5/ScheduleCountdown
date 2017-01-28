<?php
	error_reporting(E_ERROR | E_WARNING | E_PARSE);

	if(!isset($_GET["s"]) || !preg_match("/^[a-zA-Z0-9]+$/", $_GET["s"]))
	{
		die("error");
		header("Location: create");
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
		 <link rel="stylesheet" type="text/css" href="css/styles.css" />
	</head>
	<body style="background-color: "<?= $config["color"] ?>";">
		<div id="output" class="display-output">
			<noscript>Please enable Javascript</noscript>
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
		<script type="text/javascript" src="js/moment.js"></script>
		<script type="text/javascript" src="js/main.js"></script>
	</body>
</html>
