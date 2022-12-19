require('dotenv').config();
const express = require('express');
const { env, port } = require("./configs/server.config");

/** @type {import('knex').Knex} */
const knex = require("./database/knex");
const router = require("./app/router");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/app", router);

app.listen(port, (err) => {
	if (err) {
		console.log("Server failed to start ", err);
	}

	knex
		.raw("SELECT 1+1 as result")
		.then(() => {
		console.log("Database connection succeeded.");
	})
		.catch((error) => {
		console.log("Database connection failed.");
		console.log(error);
	})

		console.log(`server started [env, port] = [${env}, ${port}]`);
});