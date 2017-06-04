var output = document.getElementById("output");
var streamOnline = false;

updateTime();
setInterval(updateTime, 1000);
setInterval(checkStream, 30 * 1000);

function getNextTime(day, hour, minute)
{
	for(var j = day; j < sortedTimes.length;)
	{
		var times = sortedTimes[j];
		for(var i = 0; i < times.length; i++)
		{
			if(times[i].hour < hour)
				continue;
			else if(times[i].hour == hour && times[i].minute < minute)
				continue;
			else
				return times[i];
		}

		j++;
		hour = -1;
		minute = -1;

		if(j > 6)
			j = 0;

		if(j == day)
			throw "Could not find next stream"
	}
}

function checkStream(cb)
{
	/*TODO
	$.ajax({
		type: "GET",
		url: "https://api.twitch.tv/kraken/streams/" + twitchName,
		dataType: "json",
		headers: {"Client-ID": "ynjagsx1srdtw2vpzomuj74ptrz8u2"},
		success: function(data) { streamOnline = !!data.stream; },
		error: function() {console.error("failed to receive stream status");}
	});*/
}

function updateTime()
{
	var now = moment();
  	var offset = -(new Date()).getTimezoneOffset();

	var next = moment(now);
	var dayNow = now.day();
	var nextStream = getNextTime(dayNow, now.hours(), now.minutes());

	next.hours(nextStream.hour);
	next.minutes(nextStream.minute);
	next.seconds(0);

	if(nextStream.day < dayNow)
		next.add(7 - dayNow + nextStream.day, "days");
	else if(nextStream.day > dayNow)
		next.add(nextStream.day - dayNow, "days");

	var streamersNext = moment(next);
	//convert back to own time
	next.subtract(streamerOffset, "minutes");
	next.add(offset, "minutes");
	now = moment();

	var seconds = next.diff(now, 'seconds') % 60;
	var minutes = next.diff(now, 'minutes') % 60;
	var hours = next.diff(now, 'hours');

	var replacements = {
		hours: hours,
		minutes: minutes,
		seconds: seconds,
		currentTime: now.format(timeFormat),
		viewersTime: next.format(timeFormat),
		streamersTime: streamersNext.format(timeFormat),
		twitchName: twitchName,
		hr: "<hr />"
	};

	for(var i = 1; i <= 4; i++)
	{
		replacements["h" + i] = "<h" + i + ">";
		replacements["/h" + i] = "</h" + i + ">";
	}

	var message = streamOnline ? onlineMessage : offlineMessage;
	message = message.replace(/</g, "&lt;").replace(/\n/g, "<br />");
	message = formatMessage(message, replacements);

	output.innerHTML = message;
}

function formatMessage(message, replacements)
{
	for(var key in replacements)
	{
		var regexp = new RegExp(escapeRegExp("{" + key + "}"), "g");
		message = message.replace(regexp, replacements[key]);
	}
	return message;
}
function escapeRegExp(str)
{
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
