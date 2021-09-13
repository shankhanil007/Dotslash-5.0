const express = require("express");
const hbs = require("hbs");
const compression = require("compression");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require("dotenv")
const Email = require("./models/emailModel");

dotenv.config();
async function mongoConnect(){
	await mongoose.connect(process.env.MONGOURI)
		.then(() => {
			console.log("Connected to database");
		})
}

mongoConnect();

// compress all responses
app.use(compression());

// express middleware setup
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());

// partial setup
hbs.registerPartials(__dirname + "/views/partials");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/coc", (req, res) => {
  res.render("coc");
});

app.post("/api/email", async (req, res) => {
	const emailExsist = await Email.findOne({email : req.body.email});
	if(emailExsist) return res.status(400).json({error : "Email already exsists"})

	const newEmail = new Email({
		email : req.body.email
	})

	try{
		const savedEmail = await newEmail.save();
		return res.json({email : "New email added"});
	}catch(err){
		return res.status(400).send(err);
	}

})

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
