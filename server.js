require('dotenv').config();
const express = require('express')
const path = require('path');
const cors = require('cors')

const bodyParser = require('body-parser');
const multer = require('multer')
const app = express();
 port = process.env.PORT || 4000;

 
 app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// static user details
const userData = {
    userId: "789789",
    password: "123456",
    name: "Timilehin Falade",
    username: "Timilehin",
    isAdmin: true
  };

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
 
//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    if (!token) return next(); //if no token, continue
  
    token = token.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) {
        return res.status(401).json({
          error: true,
          message: "Invalid user."
        });
      } else {
        req.user = user; //set the user to req so other routes can use it
        next();
      }
    });
  });
  
  
  // request handlers
  app.get('/', (req, res) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
    res.send('Welcome to the Node.js Tutorial! - ' + req.user.name);
  });
  
  
  // validate the user credentials
  app.post('/users/signin', function (req, res) {
    const user = req.body.username;
    const pwd = req.body.password;
  
    // return 400 status if username/password is not exist
    if (!user || !pwd) {
      return res.status(400).json({
        error: true,
        message: "Username or Password required."
      });
    }
  
    // return 401 status if the credential is not match.
    if (user !== userData.username || pwd !== userData.password) {
      return res.status(401).json({
        error: true,
        message: "Username or Password is Wrong."
      });
    }
  
    // generate token
    const token = utils.generateToken(userData);
    // get basic user details
    const userObj = utils.getCleanUser(userData);
    // return the token along with user details
    return res.json({ user: userObj, token });
  });
  
  
  // verify the token and return it if it's valid
  app.get('/verifyToken', function (req, res) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token;
    if (!token) {
      return res.status(400).json({
        error: true,
        message: "Token is required."
      });
    }
    // check token that was passed by decoding token using secret
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) return res.status(401).json({
        error: true,
        message: "Invalid token."
      });
  
      // return 401 status if the userId does not match.
      if (user.userId !== userData.userId) {
        return res.status(401).json({
          error: true,
          message: "Invalid user."
        });
      }
      // get basic user details
      var userObj = utils.getCleanUser(userData);
      return res.json({ user: userObj, token });
    });
  });
  
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

//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    if (!token) return next(); //if no token, continue
  
    token = token.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) {
        return res.status(401).json({
          error: true,
          message: "Invalid user."
        });
      } else {
        req.user = user; //set the user to req so other routes can use it
        next();
      }
    });
  });
  
  // request handlers
  app.get('/', (req, res) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
    res.send('Welcome to the Node.js Tutorial! - ' + req.user.name);
  });

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