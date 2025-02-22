const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const { makePostRequest, createBlogPost } = require('./util')
const port = process.env.PORT || 3000; // Use environment port or 3000

app.use(cors());

// More restrictive CORS configuration (recommended for production):
// const allowedOrigins = ['http://example.com', 'http://localhost:3001']; // Add your allowed origins
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) { // Allow requests without origin (like Postman)
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));


app.use(express.json());

app.post('/api/data', async (req, res) => {
    try {
        const data = req.body;

        if (!data) {
            return res.status(400).json({ error: 'Request body is missing' });
        }
        console.log('Received data:', data);
        // let response = await makePostRequest(data)
        let response = await createBlogPost(data.title, data.content, data.categories, data.tags, data.status)
        res.status(200).json({ message: 'Post successfull', data: response }); 

    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});