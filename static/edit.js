var twitchNameEl = document.getElementById("twitchName");
var timeFormatEl = document.getElementById("timeFormat");
var timezoneEl = document.getElementById("timezone");
var bgcolorEl = document.getElementById("bgcolor");
var onlineMessageEl = document.getElementById("onlineMessage");
var offlineMessageEl = document.getElementById("offlineMessage");
var sortedTimesEl = document.getElementById("sortedTimes");

var streamTimes = sortedTimes[0].concat(sortedTimes[1], sortedTimes[2], sortedTimes[3], sortedTimes[4], sortedTimes[5], sortedTimes[6]);
(function()
{
	timeFormatEl.value = timeFormat;
	timezoneEl.value = streamerOffset;
	onlineMessageEl.value = onlineMessage;
	offlineMessageEl.value = offlineMessage;
	bgcolorEl.value = bgcolor;

	var btn = document.getElementById("addStreamTimeBtn").parentNode.parentNode;
	var parent = btn.parentNode;
	var first = parent.children[0];

	for(var i = 1; i < streamTimes.length; i++)
	{
		var el = first.cloneNode(true);
		parent.insertBefore(el, btn);

		el.children[0].children[0].value = streamTimes[0].day;
		el.children[1].children[0].value = streamTimes[0].hour;
		el.children[2].children[0].value = streamTimes[0].minute;
	}
})();

function updatePreview()
{
	twitchName = twitchNameEl.value;
	timeFormat = timeFormatEl.value;
	streamerOffset = timezoneEl.value;
	onlineMessage = onlineMessageEl.value;
	offlineMessage = offlineMessageEl.value;
	document.body.style = "background-color: " + bgcolorEl.value + ";";

	updateTime();
}

function updateStreamTime(el)
{
	var stream = streamTimes[[].slice.call(el.parentNode.children).indexOf(el)];
	var day = parseInt(el.children[0].children[0].value);
	stream.hour = parseInt(el.children[1].children[0].value);
	stream.minute = parseInt(el.children[2].children[0].value);

	if(day != stream.day)
	{
		sortedTimes[stream.day].splice(sortedTimes[stream.day].indexOf(stream), 1);
		sortedTimes[day].push(stream);
		stream.day = day;
	}

	sortedTimesEl.value = JSON.stringify(sortedTimes);
	updateTime();
}
function addStreamTime(btn)
{
	var el = btn.parentNode.children[0].cloneNode(true);
	btn.parentNode.insertBefore(el, btn);

	var stream = {
		day: parseInt(el.children[0].children[0].value),
		hour: parseInt(el.children[1].children[0].value),
		minute: parseInt(el.children[2].children[0].value)
	};
	streamTimes.push(stream);
	sortedTimes[stream.day].push(stream);

	sortedTimesEl.value = JSON.stringify(sortedTimes);
}
function delStreamTime(el)
{
	if(streamTimes.length == 1)
		return;

	var stream = streamTimes[[].slice.call(el.parentNode.children).indexOf(el)];
	var dayStreams = sortedTimes[stream.day];

	dayStreams.splice(dayStreams.indexOf(stream), 1);
	streamTimes.splice(streamTimes.indexOf(stream), 1);
	el.parentNode.removeChild(el);

	sortedTimesEl.value = JSON.stringify(sortedTimes);
}
