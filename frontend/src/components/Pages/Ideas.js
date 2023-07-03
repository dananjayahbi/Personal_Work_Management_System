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
  const [selectedTag, setSelectedTag] = useState(null);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [openPopup4, setOpenPopup4] = useState(false);
  const [openPopup5, setOpenPopup5] = useState(false);
  const [selectedIdeaID, setSelectedIdeaID] = useState(null);

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
  }, []);

  // To display ideas as cards
  const IdeaList = ({ ideas }) => {
    const filteredIdeas = selectedTag
      ? ideas.filter((idea) => idea.tags.includes(selectedTag))
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

  const tagList = Array.from(new Set(fetIdeas.flatMap((idea) => idea.tags))); // Get unique tag list from fetched ideas

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

      {/* Idea List */}
      <div className="container">
        <Grid container spacing={2} marginTop={"10px"}>
          <Grid container spacing={2} marginTop={"10px"}>
            {tagList.map((tag, index) => (
              <Grid item key={index}>
                <Button
                  variant={selectedTag === tag ? "contained" : "outlined"}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              </Grid>
            ))}
          </Grid>

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
