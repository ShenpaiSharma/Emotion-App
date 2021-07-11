const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/emotionDB', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));


const userSchema = new mongoose.Schema({
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
  },
  start_time: {
  	type: Date,
  	required: true,
  	default: Date.now
  },
  expression_arr: []
})


const UserEmotion = mongoose.model("UserEmotion", userSchema);


app.get('/', async function(req, res) {
	
	try {
		const user = await UserEmotion.find();
		res.json(user);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
});

app.post('/expression', async function(req, res) {
	const { account_id, first_name, last_name, email, password, start_time, end_time, expression_array } = req.body;

	// bcrypt.hash(password, null, null, function(err, hash) {
	//     console.log(hash);
	// });

	const user = new UserEmotion({
		account_id: account_id,
		first_name: first_name,
		last_name: last_name,
		email: email,
		password: password,
		start_time: start_time,
		end_time: end_time,
		expression_arr: expression_array
	});
	try {
		const signUser = await UserEmotion.findOne({ email: email }).exec();
		if (signUser != null) {
			return res.status(400).json({message: 'User already exists'});
		}
		const newUser = await user.save();
		res.status(201).json(newUser);
	} catch (err) {
		res.status(500).json({message: err.message});
	}
});

app.put('/update/expression', async function(req, res) {
	
	const { user_id, first_name, email, expression_array } = req.body;

	try {
		const updateUser = await UserEmotion.findOneAndUpdate(
			{ email: email },
			{ $push: { expression_arr:  expression_array } }
		);
		if (updateUser == null) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json("Successfully updated the user's emotion");
	} catch (err) {
		res.status(500).json({message: err.message});
	}
});

app.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await UserEmotion.findOne({email: email, password: password}).exec();
		if (user == null ) {
			return res.status(404).json('error logging in');
		}
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

app.delete('/delete_user/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const user = await UserEmotion.findOneAndDelete({ _id: id });
		if (user == null) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json({ message: 'User Successfully deleted' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

app.get('/expression/average_day/:id', async (req, res) => {

	const id = req.params.id;

	// const user = database.users[0];

	let avg_exp = [];

	try {
		const user = await UserEmotion.findById(id);
		if (user == null) {
			res.status(404).json({ message: 'User not found' });
		}

		avg_exp = averageUserEmotion(user);
		//console.log(user.expression_arr);
		//console.log(avg_exp);
		let initial = parseInt(req.query.from) || 1;
		let final = parseInt(req.query.to) || user.expression_arr.length;
		
		initial = Math.max(initial, 1);
		final = Math.min(final, user.expression_arr.length);

		const result = avg_exp.filter(emotion => (emotion.Day >= initial && emotion.Day <= final));
		// console.log(initial);
		// console.log(final);
		//console.log(result);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}

});



app.get('/expression/average_time/:id', async (req, res) => {
	const id = req.params.id;


	let avg_exp = [];
	try {
		const user = await UserEmotion.findById(id);
		if (user == null) {
			return res.status(404).json({ message: 'User not found' });
		}
		const day = user.expression_arr[user.expression_arr.length - 1];
		const arr = day.emotion_arr;

		let fill = parseInt(req.query.filter) || arr.length;
		avg_exp = averageUserEmotionTime(arr, fill);
		res.status(200).json(avg_exp);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
 });



app.get('/valence/average_day/:id', async (req, res) => {
	const id = req.params.id;

	//const user = database.users[0];

	let avg_exp = [];

	try {
		const user = await UserEmotion.findById(id);
		if (user == null) {
			res.status(404).json({ message: 'User not found' });
		}

		avg_exp = averageUserValence(user);
		let initial = parseInt(req.query.from) || 1;
		let final = parseInt(req.query.to) || user.expression_arr.length;
		
		initial = Math.max(initial, 1);
		final = Math.min(final, user.expression_arr.length);

		const result = avg_exp.filter(emotion => (emotion.Day >= initial && emotion.Day <= final));
		// console.log(initial);
		// console.log(final);
		// console.log(result);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

//////////////////////////////////////////////////////////////////////////////////////////////////

// Helper functions

function averageUserValence(user) {
	const avg_exp = [];

	for(let i=0;i<user.expression_arr.length;i++) {
		let arr = user.expression_arr[i].emotion_arr;
		let size = arr.length;
		let n = 0, h = 0, s = 0, a = 0, f = 0, d = 0, sur = 0;
		for(let j=0;j<arr.length;j++) {
			let emotions = arr[j].emotions;
			n += emotions.neutral;
			h += emotions.happy;
			s += emotions.sad;
			a += emotions.angry;
			f += emotions.fearful;
			d += emotions.disgusted;
			sur += emotions.surprised;
		}
		let obj = 
		{
			Day: i+1,
			avg_emotion: 
			{
				positive: h/size,
				negative: (h - (s + a + f + d + sur))/size
			}
		}
		avg_exp.push(obj);
	}
	return avg_exp;
}

function averageUserEmotionTime(arr, fill) {
	let avg_exp = [];

	let n = 0, h = 0, s = 0, a = 0, f = 0, d = 0, sur = 0;	
	for(let i=0;i<arr.length;i++) {
		n += arr[i].emotions.neutral;
		h += arr[i].emotions.happy;
		s += arr[i].emotions.sad;
		a += arr[i].emotions.angry;
		f += arr[i].emotions.fearful;
		d += arr[i].emotions.disgusted;
		sur += arr[i].emotions.surprised;
		if((i+1)%fill === 0) {
			let obj = 
			{
				avg_emotion: 
				{
					neutral: n/fill,
					happy: h/fill,
					sad: s/fill,
					angry: a/fill,
					fearful: f/fill,
					disgusted: d/fill,
					surprsed: sur/fill
				}
			}
			avg_exp.push(obj);
			n = 0, h = 0, s = 0, a = 0, f = 0, d = 0, sur = 0;
		}
	}
	return avg_exp;
}

function averageUserEmotion(user) {
	const avg_exp = [];

	for(let i=0;i<user.expression_arr.length;i++) {
		let arr = user.expression_arr[i].emotion_arr;
		let size = arr.length;
		//console.log(arr);
		let n = 0, h = 0, s = 0, a = 0, f = 0, d = 0, sur = 0;
		for(let j=0;j<arr.length;j++) {
			let emotions = arr[j].emotions;
			n += emotions.neutral;
			h += emotions.happy;
			s += emotions.sad;
			a += emotions.angry;
			f += emotions.fearful;
			d += emotions.disgusted;
			sur += emotions.surprised;
		}
		let obj = 
		{
			Day: i+1,
			avg_emotion: 
			{
				neutral: n/size,
				happy: h/size,
				sad: s/size,
				angry: a/size,
				fearful: f/size,
				disgusted: d/size,
				surprsed: sur/size
			}
		}
		avg_exp.push(obj);
	}
	//console.log(avg_exp);
	return avg_exp;
}

app.listen(5050, () => {
	console.log('Server started on port 5050');
});

