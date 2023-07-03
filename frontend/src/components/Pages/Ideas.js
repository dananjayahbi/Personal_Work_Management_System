import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/dashboard.css";
import AddIdea from '../PageComponents/AddIdea';
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import DeleteIdea from "../PageComponents/DeleteIdea";
import UpdateIdea from "../PageComponents/UpdateIdea";

export default function Ideas() {
  const [fetIdeas, setFetchedIdeas] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [openPopup4, setOpenPopup4] = useState(false);
  const [openPopup5, setOpenPopup5] = useState(false);
  const [selectedIdeaID, setSelectedIdeaID] = useState(null);
  const [filteringTags, setFilteringTags] = useState("");
  const [storedTags, setStoredTags] = useState([]);

  // Get all ideas
  useEffect(() => {
    setTimeout(() => {
      axios
        .get("http://localhost:8070/ideas/getAllIdeas")
        .then((res) => {
          setFetchedIdeas(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);

    // Fetch stored tags from the server
    fetchStoredTags();
  }, [openPopup3, openPopup4, openPopup5]);

  const fetchStoredTags = () => {
    axios
      .get("http://localhost:8070/tags/getTags")
      .then((res) => {
        setStoredTags(res.data.tags);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // To display ideas as cards
  const IdeaList = ({ ideas }) => {
    const filteredIdeas = selectedTags.length > 0
      ? ideas.filter((idea) => selectedTags.every(tag => idea.tags.includes(tag)))
      : ideas;

    const handleDelete = (ideaID) => {
      setSelectedIdeaID(ideaID);
      setOpenPopup4(true);
    };

    const handleUpdate = (ideaID) => {
      setSelectedIdeaID(ideaID);
      setOpenPopup5(true);
    };

    return (
      <Grid container spacing={2}>
        {filteredIdeas.map((idea, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{idea.idea}</Typography>
                <Typography variant="body2">Tags:</Typography>
                <Grid container spacing={1}>
                  {idea.tags.map((tag, tagIndex) => (
                    <Grid item key={tagIndex}>
                      <Chip label={tag} variant="outlined" />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleUpdate(idea._id)}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(idea._id)}
              >
                Delete
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const handleTagChange = (event) => {
    setFilteringTags(event.target.value);
  };

  const addTags = () => {
    const tagsArray = filteringTags.split(",").map(tag => tag.trim());
    const uniqueTags = tagsArray.filter(tag => !selectedTags.includes(tag));
  
    if (uniqueTags.length > 0) {
      // Save the tags to the server
      axios
        .post("http://localhost:8070/tags/addTags", { tags: uniqueTags })
        .then(() => {
          fetchStoredTags(); // Fetch the updated tags from the server
          setSelectedTags([...selectedTags, ...uniqueTags]);
          setFilteringTags("");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };  

  const handleRemoveTag = (tag) => {
    const updatedTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(updatedTags);
  };


  return (
    <>
      <div className="d-flex justify-content-center">
        {/* Add Idea button */}
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          sx={{
            border: "1px solid #1e6907",
            color: "#1e6907",
            "&:last-child td, &:last-child th": { border: 0 },
            "&:hover": {
              backgroundColor: "#1e6907",
              color: "white",
            },
          }}
          onClick={() => setOpenPopup3(true)}
        >
          Add Idea
        </Button>
        <AddIdea openPopup3={openPopup3} setOpenPopup3={setOpenPopup3}></AddIdea>
      </div>

      {/* Tags List */}
      <div className="container">
        <Grid container spacing={2} marginTop={"10px"}>
          <Grid container spacing={2} marginTop={"10px"}>
            <Grid item>
              <input type="text" placeholder="Enter tags separated by comma" value={filteringTags} onChange={handleTagChange} />
              <Button variant="contained" onClick={addTags}>Add Tags</Button>
            </Grid>
          </Grid>

          {/* Stored Tags */}
          <Typography variant="h6">Stored Tags:</Typography>
          <Grid container spacing={1} marginTop={"10px"}>
            {storedTags.map((tag, index) => (
              <Grid item key={index}>
                <Button
                  variant={selectedTags.includes(tag) ? "contained" : "outlined"}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Selected Tags */}
          <Typography variant="h6">Selected Tags:</Typography>
          <Grid container spacing={1} marginTop={"10px"}>
            {selectedTags.map((tag, index) => (
              <Grid item key={index}>
                <Button
                  variant="contained"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Idea List */}
          <Typography variant="h4">Idea List</Typography>
          <Grid container spacing={2} marginTop={"10px"}>
            <IdeaList ideas={fetIdeas} />
          </Grid>
        </Grid>
      </div>

      {/* Delete Idea Popup */}
      {selectedIdeaID && (
        <DeleteIdea
          ideaID={selectedIdeaID}
          openPopup4={openPopup4}
          setOpenPopup4={setOpenPopup4}
        />
      )}

      {/* Update Idea Popup */}
      {selectedIdeaID && (
        <UpdateIdea
          ideaID={selectedIdeaID}
          openPopup={openPopup5}
          setOpenPopup={setOpenPopup5}
        />
      )}
    </>
  );
}
