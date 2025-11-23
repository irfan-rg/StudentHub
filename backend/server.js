import app from './src/app.js'
import connectDB from './src/config/db.js'
const PORT = process.env.PORT || 5000

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is live in \nhttp://localhost:${PORT} \nhttp://127.0.0.1:${PORT}`)
        })
    })
    .catch((err) => {
        console.error("!!!===MongoDB connection Error", err)
    })