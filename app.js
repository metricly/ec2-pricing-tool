let express = require('express');
let app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

let fs = require('fs');
let https = require('https');
let schedule = require('node-schedule')
let data = [];
let dataLength = 0;
let headings = [];

let currentTableData;
let request;
function initPriceList() {
currentTableData = fs.createWriteStream("currentListTable.psv");
request = https.get('https://s3-us-west-2.amazonaws.com/com-netuitive-app-usw2-www/tools/pricing-tool/listprices.psv', response => {
	response.pipe(currentTableData);
});
}

initPriceList();

currentTableData.on('finish', function() {
	console.log('FINISHED')
	fs.readFile(__dirname + '/currentListTable.psv', 'utf8', function (err, contents) {

		let allTextLines = contents.split(/\r\n|\n/);
	
		headings = allTextLines[0].split("|").map(entry => entry.trim());
	
		let rows = new Array(allTextLines.length - 2).fill({});
	
		for (var i = 2; i < allTextLines.length; i++) {
			let row = allTextLines[i];
			let values = row.split("|").map((entry) => entry.trim());
	
			let obj = {};
			let ix = 0;
			headings.forEach(heading => {
				obj[heading] = values[ix++];
			});
			rows[i - 2] = obj;
		}
	
		// Trim blanks
		data = rows.filter((row) => row.rate_code !== '');
	
		// Remove unwanted
		data = rows.filter((row) => row.tenancy !== 'Host');
	
		dataLength = data.length;
	
		console.log(`Parsed ${allTextLines.length} rows`);
	});
});

let j = schedule.scheduleJob('59 59 23 * * 7', function() {
	initPriceList();
	console.log('render new table')
})

let filterNames = ['region', 'platform', 'software', 'license_model', 'tenancy', 'instance_type', 'family', 'license_model', 'network_perf', 'ebs_throughput'];
let rangeFilterNames = ['memory_gb', 'vcpu', 'price', 'ecu', 'storage_gb'];
let checkFilterNames = ['enhanced_network', 'current']; //my

console.log(`Reading data file`);


//let outputFolder = '../../output';

app.use(express.static(__dirname + '/public'));
//app.use(express.static(outputFolder));

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/bootstrap-slider', express.static(__dirname + '/node_modules/bootstrap-slider/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/datatables', express.static(__dirname + '/node_modules/datatables/media/'));
//app.use('/highcharts', express.static(__dirname + '/node_modules/highcharts/'));

app.get('/lookup', (req, res) => {
	const field = req.query.field;
	let values = lookup(field);
	res.send({
		field,
		values: values.sort()
	});
});

let lookup = function (field) {
	let filteredData = data;

	let values = filteredData.reduce((prev, curr) => {
		let entry = curr[field];
		if (entry && !prev.includes(entry)) {
			prev.push(entry);
		}
		return prev;
	}, []);

	values.push("");
	return values;
}

app.get('/headings', (req, res) => {
	res.send(headings);
});

app.get('/count', (req, res) => {
	let filteredData = getFilteredData(req);
	res.send({
		count: filteredData.length
	});
});

app.get('/memrange', (req, res) => {
	let filteredData = getFilteredData(req);
	let range = filteredData.reduce((prev, curr) => {
		// if( parseFloat(curr.memory_gb) === 0) {
		// 	console.log("0");
		// }
		prev[0] = parseFloat(curr.memory_gb) < prev[0] ? parseFloat(curr.memory_gb) : prev[0];
		prev[1] = parseFloat(curr.memory_gb) > prev[1] ? parseFloat(curr.memory_gb) : prev[1];
		return prev;
	}, [99999, 0]);
	res.send(range);
});

app.get('/range', (req, res) => {
	let filteredData = getFilteredData(req);
	let field = req.query.field;
	let range = filteredData.reduce((prev, curr) => {
		prev[0] = parseFloat(curr[field]) < prev[0] ? parseFloat(curr[field]) : prev[0];
		prev[1] = parseFloat(curr[field]) > prev[1] ? parseFloat(curr[field]) : prev[1];
		return prev;
	}, [99999, 0]);
	res.send({
		field,
		min: range[0],
		max: range[1]
	});
});

app.get('/data', (req, res) => {
	let filteredData = getFilteredData(req);
	res.send(filteredData);
});

app.get('/table', (req, res) => {
	let filteredData = getFilteredData(req);

	// Sort
	let orders = req.query.orders;
	if (orders && orders.length > 0) {
		let field = orders[0].column;
		let direction = orders[0].dir === 'asc' ? 1 : -1;
		let type = orders[0].type;
		if (type && type === 'num') {
			filteredData = filteredData.sort((a, b) => direction * (parseFloat(a[field]) - parseFloat(b[field])));
		} else {
			filteredData = filteredData.sort((a, b) => new String(a[field]).localeCompare(new String(b[field])) * direction);
		}
	}
	// Paginate
	let filteredLength = filteredData.length;
	let pageSize = parseInt(req.query.pageSize);
	let page = parseInt(req.query.page);
	filteredData = filteredData.slice(page * pageSize, (page + 1) * pageSize);

	res.send({
		data: filteredData,
		recordsTotal: dataLength,
		recordsFiltered: filteredLength
	});
});

let renameNest = function (entry) {
	if (entry.key) {
		entry.name = entry.key;
		delete entry.key;
	}
	if (entry.values) {
		entry.children = [];
		entry.values.forEach(child => entry.children.push(renameNest(child)));
		delete entry.values;
	}
	if (entry.value) {
		// leaf
		entry.size = entry.value.size;
		delete entry.value;
	}
	return entry;
}

var getFilteredData = function (req) {
	let filters = [];
	let rangeFilters = [];
	let checkFilters = []; //my


	if (req.query.filters) {
		filters = filterNames.map((name) => {
			return {
				name,
				value: req.query.filters[name]
			};
		}).filter((filter) => filter.value ? true : false);
		// console.log(filterNames);

		rangeFilters = rangeFilterNames.map((name) => {
			if (req.query.filters[name + "_max"]) {
				return {
					name,
					min: parseFloat(req.query.filters[name + "_min"]),
					max: parseFloat(req.query.filters[name + "_max"]),
					active: true
				};
			} else {
				return {
					active: false
				};
			}
		}).filter((filter) => filter.active);
		// console.log(rangeFilters)

		checkFilters = checkFilterNames.map((name) => { //my
			return {
				name,
				value: req.query.filters[name]
			};

		}).filter((filter) => filter.value);
		console.log(checkFilters);
	}

	let filteredData = data;
	filters.forEach((filter) => filteredData = filteredData.filter((row) => row[filter.name] === filter.value));

	rangeFilters.forEach((filter) => filteredData = filteredData.filter((row) => row[filter.name] >= filter.min && row[filter.name] <= filter.max));

	checkFilters.forEach((filter) => filteredData = filteredData.filter((row) => row[filter.name] === filter.value)); //my

	return filteredData;
}

app.listen(port);