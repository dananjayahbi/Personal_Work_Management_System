const express = require('express');
const router = express.Router();
const fs = require('fs');

const TAGS_FILE_PATH = './local-server-files/tags.json';

// Create the tags JSON file if it doesn't exist
if (!fs.existsSync(TAGS_FILE_PATH)) {
  fs.writeFileSync(TAGS_FILE_PATH, JSON.stringify({ tags: [] }), 'utf8');
}

// Get stored tags
router.get('/getTags', (req, res) => {
  fs.readFile(TAGS_FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      const tagsData = JSON.parse(data);
      const tags = tagsData.tags; // Access the 'tags' property of the object

      if (Array.isArray(tags)) {
        res.json({ tags });
      } else {
        throw new Error('Invalid tags data');
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});



// Add tags
router.post('/addTags', (req, res) => {
  const { tags } = req.body;

  fs.readFile(TAGS_FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const storedTags = JSON.parse(data);

    const updatedTagsSet = new Set([...storedTags.tags, ...tags]); // Use a Set to remove duplicates
    const updatedTags = Array.from(updatedTagsSet);

    fs.writeFile(TAGS_FILE_PATH, JSON.stringify({ tags: updatedTags }), 'utf8', (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ message: 'Tags added successfully' });
    });
  });
});

module.exports = router;
