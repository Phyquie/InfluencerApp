import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './route/auth.route.js';
import connectMongoDb from './connectMongoDb/connectMongoDb.js'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
app.use(express.json({limit:"500kb"}));
app.use(express.json());//to parse req.body
app.use(express.urlencoded({extended:true}));//to parse form data'
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDb();
});
