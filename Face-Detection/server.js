const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

//app.use(express.static('public'));

//console.log(test.arr);
//console.log(facial_exp);

mongoose.connect("mongodb://localhost:27017/ibyDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = {
	account_id: {
		type: String,
		required: true
	},
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}

const User = new mongoose.model("User", userSchema);

let Acc;
let F_name;
let L_name;
let Ema;
let Pass;
let Stat;

app.get('/', (req, res) => {
	res.render("home");
});

app.get('/login', (req, res) => {
	res.render("login");
});

app.get('/register', (req, res) => {
	res.render("register");
});

app.get('/failure', (req, res) => {
	res.render("failure");
});

app.get('/success', (req, res) => {
	res.render("success");
});

app.get('/video', (req, res) => {
	res.render("video", {account_id: Acc, first_name: F_name, last_name: L_name, email: Ema, password: Pass, status: Stat});
})

app.post('/register', async (req, res) => {
	const { account_id, f_name, l_name, email, password } = req.body;

	const user = new User({
		account_id: account_id,
		first_name: f_name,
		last_name: l_name,
		email: email,
		password: password
	});
	try {
		const signUser = await User.findOne({ email: email }).exec();
		if (signUser != null) {
			res.redirect("/failure");
		}
		const newUser = await user.save();
		// res.render("video", {account_id: account_id, first_name: f_name, last_name: l_name, email: email, password: password, status: "register"});
		Acc = account_id;
		F_name = f_name;
		L_name = l_name;
		Ema = email;
		Pass = password;
		Stat = "register";

		res.redirect('/video');
		// console.log(newUser);
		//res.status(201).json(newUser);
	} catch (err) {
		// res.status(500).json({message: err.message});
		res.redirect('/failure');
	}
});

app.post('/login', (req, res) => {
	const { email, password } = req.body;

	User.findOne({email: email}, function(err, foundUser) {
		if(err) {
			console.log(err);
			res.redirect("/failure");
		} else {
			if (foundUser) {
				if (foundUser.password === password) {
					// res.render("video", {account_id: "account_id", first_name: "f_name", last_name: "l_name", email: email, password: password, status: "signin"});
					
					Acc = "account_453ideweiwue";
					F_name = "f_namesewj4303";
					L_name = "sadnl_anamejkf356";
					Ema = email;
					Pass = password;
					Stat = "signin";

					res.redirect('/video');

				} else {
					res.redirect("/failure");
				}
			} else {
				res.redirect("/failure");
			}
		}
	})
})

app.listen(8080, () => {
    console.log('Server has started on port 8080');
});


