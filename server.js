
const express = require('express')
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');
const multer = require('multer')
const app = express();
 port = process.env.PORT || 4000;

 
 app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
let users = {
    1: {
        id: '1', 
        email: 'Faladetimilehin@yahoo.com',
        password: 'random'
    }, 
    2: {
        id: '2',
        email: 'TolulopeOdueke@yahoo.com',
        password: 'random'
    },
}
let messages = {
    1: {
      id: '1',
      text: 'Hello World',
      userId: '1',
    },
    2: {
      id: '2',
      text: 'By World',
      userId: '2',
    },
  };

app.use((req,res,next) =>{
    console.log('Time:', Date.now())
    next();
})

// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
 

// serving static files
app.use('/uploads', express.static('uploads'));

// handle storage using multer
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads');
	},
	filename: function (req, file, cb) {
		cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
	}
});
var upload = multer({ storage: storage });

// handle single file upload
app.post('/uploadfile', upload.single('dataFile'), (req, res, next) => {
	const file = req.file;
	if (!file) {
		return res.status(400).send({ message: 'Please upload a file.' });
	}
	return res.send({ message: 'File uploaded successfully.', file });
});

// handle multiple file upload
app.post('/uploadmultifile', upload.array('dataFiles', 10), (req, res, next) => {
	const files = req.files;
	if (!files || (files && files.length === 0)) {
		return res.status(400).send({ message: 'Please upload a file.' });
	}
	return res.send({ message: 'File uploaded successfully.', files });
});

// request handlers
app.get('/', (req,res) => {
    res.send('Welcome to my first Successful response on Node')
})

app.get('/login',(req, res) => {
    res.send('Welcome to login page')
})

  app.post('/messages', (req, res) => {
    const id = uuidv4();
    const message = {
      id,
      text: req.body.text,
      userId: req.me.id,
    };
   
    messages[id] = message;
   
    return res.send(message);
  });
  app.delete('/messages/:messageId', (req, res) => {
    const {
      [req.params.messageId]: message,
      ...otherMessages
    } = messages;
   
    messages = otherMessages;
   
    return res.send(message);
  });

app.get('/users', (req, res) => {
    return res.send(Object.values(users))
})

app.get('/users/:userId', (req, res) =>{
    return res.send(users[req.params.userId])
})
app.post('/users',(req,res) => {
    return res.send('users added POST HTTP method on user resource')
})

app.put('/users/:userId', (req, res) => {
    return res.send(
        `PUT HTTP method on user/${req.params.userId} resource`,
        )
})

app.delete('/users/:userId', (req,res) => {
    return res.send(
        `DELETE HTTP method on user/${req.params.userId} resource`,
        )
})


app.listen(port, () =>console.log(`Example app is listening on: ${port}`))