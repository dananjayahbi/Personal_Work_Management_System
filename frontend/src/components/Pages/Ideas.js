import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/dashboard.css";
import AddIdea from '../PageComponents/AddIdea';
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import DeleteIdea from "../PageComponents/DeleteIdea";
import UpdateIdea from "../PageComponents/UpdateIdea";
import ButtonWrapper from "../FormsUI/Button";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import IconButton from '@mui/material/IconButton';

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
          console.log(res.data);
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

  //handle update functions (reset bookmark status)
  const handleUpdates = (id, bookmarkStatus, updatedTags) => {
    axios
      .put(`http://localhost:8070/ideas/updateIdea/${id}`, {
        bookmark: bookmarkStatus,
        tags: updatedTags,
      })
      .then((response) => {
        // Handle the successful update if needed
        console.log("Idea update successful:", response.data);
      })
      .catch((error) => {
        console.error("Error updating idea:", error);
        // Handle any error during idea update
      });
  };

  // To display ideas as cards...
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

    const handleBookmark = (id) => {
      setFetchedIdeas((prevIdeas) => {
        return prevIdeas.map((idea) => {
          if (idea._id === id) {
            const bookmarkStatus = !idea.bookmark ? "true" : "false";
            const updatedTags = bookmarkStatus === "true" ? [...idea.tags, "bookmarked"] : idea.tags.filter(tag => tag !== "bookmarked");
            handleUpdates(id, bookmarkStatus, updatedTags);
            
            return {
              ...idea,
              bookmark: !idea.bookmark,
              tags: updatedTags,
            };
          }
          return idea;
        });
      });
    };
    

    return (
      <Grid container spacing={1.5}>
      {filteredIdeas.map((idea, index) => (
        <Grid item xs={12} sm={6} md={6} key={index}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardContent sx={{ flexGrow: 1 }}>

            {/* the bookmark icon */}
            <IconButton
                sx={{ float: "right" }}
                onClick={() => handleBookmark(idea._id)}
              >
                {idea.bookmark ? (
                  <BookmarkIcon color="primary" />
                ) : (
                  <BookmarkBorderIcon color="primary" />
                )}
              </IconButton>

              <Typography sx={{ marginBottom: '15px', marginTop: '50px' }}>{idea.idea}</Typography>
              <Typography fontWeight={600} sx={{ marginBottom: '5px' }}>Tags:</Typography>
              <Grid container spacing={1}>
                {idea.tags.map((tag, tagIndex) => (
                  <Grid item key={tagIndex}>
                    <Chip label={tag} variant="outlined" />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px', // Adjust the margin as needed
              }}
            >
              <Button
                variant="outlined"
                color="success"
                sx={{ width: '25%', marginRight: '4px' }}
                onClick={() => handleUpdate(idea._id)}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ width: '25%', marginLeft: '4px' }}
                onClick={() => handleDelete(idea._id,idea.bookmark)}
              >
                Delete
              </Button>
            </div>
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
    const uniqueTags = tagsArray.filter(tag => tag !== "" && !selectedTags.includes(tag));
  
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
    if (tag.trim() !== '' && tag.trim().length > 0 && !selectedTags.includes(tag)) {
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
      {/* Adding Tags */}
      <div className="container">
        <Grid container spacing={2} marginTop={"10px"}>
        <Grid container spacing={2} style={{ marginTop: "10px", marginLeft: "-30px"}}>
            <Grid item>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Enter tags separated by comma"
                  style={{
                    marginRight: "10px",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    width: "300px",
                    outline: "none",
                    fontSize: "14px",
                  }}
                  value={filteringTags}
                  onChange={handleTagChange}
                />
                <ButtonWrapper
                  variant="contained"
                  style={{
                    background: "rgba(30, 105, 7, 0.8)",
                    color: "white",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.3s ease-in-out", // Add transition for smooth effect
                  }}
                  onMouseOver={(e) => e.target.style.background = "rgba(30, 105, 7, 1)"} // Full opacity on hover
                  onMouseLeave={(e) => e.target.style.background = "rgba(30, 105, 7, 0.8)"} // Fade effect on mouse leave
                  onClick={addTags}
                >
                  Add Tags
                </ButtonWrapper>

              </div>
            </Grid>
        </Grid>


          {/* Filtering Tags */}
          <Grid container spacing={1} marginTop={"10px"} marginLeft={"-15px"}>
          <Typography variant="h6" paddingTop={"10px"} color={"#28395a"}>Filtering Tags:</Typography>

            {storedTags.map((tag, index) => (
              <Grid item key={index}>
                <Button
                  variant={selectedTags.includes(tag) ? "contained" : "outlined"}
                  onClick={() => handleTagClick(tag)}
                  style={{
                    background: selectedTags.includes(tag) ? "#1e6907" : "transparent",
                    color: selectedTags.includes(tag) ? "#fff" : "#1e6907",
                    borderRadius: "4px",
                    padding: "2px 16px",
                    fontWeight: "bold",
                    border: selectedTags.includes(tag) ? "none" : "1px solid rgba(30, 105, 7, 0.5)",
                    cursor: "pointer",
                    transition: "background 0.3s ease-in-out",
                  }}
                  onMouseOver={(e) => {
                    if (!selectedTags.includes(tag)) {
                      e.target.style.background = "rgba(30, 105, 7, 0.2)";
                      e.target.style.color = "#1e6907";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedTags.includes(tag)) {
                      e.target.style.background = "transparent";
                      e.target.style.color = "#1e6907";
                    }
                  }}
                >
                  {tag}
                </Button>

              </Grid>
            ))}
          </Grid>

          {/* Selected Filters */}
          {selectedTags.length > 0 && (
            <Grid container spacing={1} marginTop={"10px"} marginLeft={"-15px"}>
              <Typography variant="h6" paddingTop={"10px"} color={"#28395a"}>
                Selected Filters:
              </Typography>
              {selectedTags.map((tag, index) => (
                <Grid item key={index}>
                  <Button
                    variant="contained"
                    onClick={() => handleRemoveTag(tag)}
                    style={{
                      background: "#1e6907",
                      color: "#fff",
                      borderRadius: "4px",
                      padding: "2px 16px",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.3s ease-in-out",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "rgba(30, 105, 7, 0.2)";
                      e.target.style.color = "#1e6907";
                      e.target.style.border = "1px solid rgba(30, 105, 7, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#1e6907";
                      e.target.style.color = "#ffffff";
                    }}
                  >
                    {tag}
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}


          {/* Idea List */}
          <Typography variant="h4" marginTop={"30px"} marginLeft={"-15px"} textAlign="center" color={"#28395a"}>Idea List</Typography>
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
