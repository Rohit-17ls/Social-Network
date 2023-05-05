const express = require('express')
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes.js');
const postCreationRoutes = require('./routes/postCreationRoutes.js');
const postViewRoutes = require('./routes/postViewRoutes.js')

app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

app.use(cors({origin : 'http://localhost:5173', credentials : true}))

app.use(authRoutes);
app.use(postCreationRoutes);
app.use(postViewRoutes);

app.listen('3000', () => {
    console.log('Listening at port 3000');
})