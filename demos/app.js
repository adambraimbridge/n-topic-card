'use strict';

const conceptHelper = require('../handlebars-helpers/concept');
const express = require('@financial-times/n-internal-tool');
const handlebars = require('handlebars');
const fixtures = require('./fixtures.json');
const chalk = require('chalk');
const errorHighlight = chalk.bold.red;
const highlight = chalk.bold.green;

handlebars.registerHelper('concept', conceptHelper);

const app = module.exports = express({
	name: 'public',
	systemCode: 'n-topic-card-demo',
	withFlags: false,
	withHandlebars: true,
	withNavigation: false,
	withAnonMiddleware: false,
	hasHeadCss: false,
	demo: true,
	s3o: false,
	viewsDirectory: '/demos',
	layoutsDir: 'demos',
	partialsDirectory: process.cwd(),
	directory: process.cwd()
});

app.get('/', (req, res) => {
	res.render('demo', Object.assign({
		title: 'Test App',
		layout: 'demo-layout',
	}, fixtures));
});

function runPa11yTests () {
	const spawn = require('child_process').spawn;
	const pa11y = spawn('pa11y-ci');

	pa11y.stdout.on('data', (data) => {
		console.log(highlight(`${data}`)); //eslint-disable-line
	});

	pa11y.stderr.on('data', (error) => {
		console.log(errorHighlight(`${error}`)); //eslint-disable-line
	});

	pa11y.on('close', (code) => {
		process.exit(code);
	});
}

const listen = app.listen(5005);

if (process.env.PA11Y === 'true') {
	listen.then(runPa11yTests);
}
