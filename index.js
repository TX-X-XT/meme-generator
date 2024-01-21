import axios from "axios";
import express from "express";
import ejs from "ejs";
const app = express();
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
    try {
        const subreddit = req.query.subreddit;
        let result;

        if (!subreddit) {
            result = await axios.get("https://meme-api.com/gimme/wholesomememes");
        } else {
            do {
                result = await axios.get(`https://meme-api.com/gimme/${subreddit}`);
            } while (typeof result.data.preview[3] === 'undefined');
        }

        // Checks if the meme has the necessary data before rendering
        if (result.data && result.data.preview && result.data.preview[3]) {
            res.render("index.ejs", {
                img: result.data.preview[3],
                postLink: result.data.postLink,
                subreddit: result.data.subreddit,
            });
        } else {
            // Handles the case where the meme data isn't in the expected format
            res.status(404).send("Meme not found");
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(418); // I'm a teapot)
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
