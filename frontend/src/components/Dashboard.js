import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import GridViewIcon from '@mui/icons-material/GridView';
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import drawerLogo from "../images/drawerLogo.png";
import logoIcon from "../images/logo-icon.png";
import axios from "axios";
import { Avatar } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Home from "./Pages/Home";
import {
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Users from "./Pages/Users";
import Notification from "./DispayComponents/Notification";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

// NAVIGATION
const commonNav = [
  { name: "Dashboard", icon: <GridViewIcon />, path: "/" },
];

const specialNav = [
  { name: "Users", icon: <EngineeringIcon />, path: "/users" },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  backgroundColor: "var(--drawer-bg)",
  paddingLeft: "5px",
  border: 0,
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
  width: `calc(${theme.spacing(7)} + 0px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 0px)`,
  },
  backgroundColor: "var(--drawer-bg)",
  paddingLeft: "5px",
  border: 0,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  backgroundColor: "white",
  color: "black",
  zIndex: 15,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    backgroundColor: "white",
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// FUNCTION
export default function Dashboard() {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [windowName, setWindow] = useState("Dashboard");
  const token = localStorage.getItem("token");

  const setWindowName = (name) => {
    sessionStorage.setItem("window", name);
  };

  useEffect(() => {
    setWindow(sessionStorage.getItem("window"));

    if (sessionStorage.getItem("showmsg") == "1") {
      setNotify({
        isOpen: true,
        message: "Sign In Successful!",
        type: "success",
      });
      sessionStorage.removeItem("showmsg");
    }
  });

  //Get Current logged in user's username
  const [curUname, setCurUname] = useState(" ");
  useEffect(() => {
    axios
      .get(`http://localhost:8070/user/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCurUname(res.data.username);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  const logout = () => {
    window.localStorage.clear();
    window.location.href = "./";
    sessionStorage.setItem("window", "Dashboard");
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* NOTIFICATION */}
      <Notification notify={notify} setNotify={setNotify} />
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        className="topbar"
        style={{
          boxShadow: "none",
          backgroundColor: "var(--dashboard-bg)",
        }}
      >
        {/* top bar */}
        <Toolbar>
          {/* Menu icon button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
            className="iconbtn-waste"
          >
            <MenuIcon />
          </IconButton>
          <Tooltip title={open ? "Collapse" : "Expand"}>
            <IconButton
              onClick={() => {
                setOpen(!open);
              }}
              className="iconbtn"
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          </Tooltip>

          <p className="pageTitle">{windowName}</p> {/* Page title */}

          
          <Box sx={{ flexGrow: 0 }} className="ms-auto d-flex">

            {/* Logout button */}
            <Tooltip title="Logout">
              <IconButton
                sx={{ color: "var(--blue)" }}
                size="medium"
                color="inherit"
                onClick={() => {
                  logout();
                }}
                className="me-4"
              >
                <LogoutRoundedIcon />
              </IconButton>
            </Tooltip>

            {/* profile icon */}
            <Tooltip title="Profile">
              <IconButton
                sx={{ p: 0 }}
                onClick={() => {
                  //navigate("/Profile");
                }}
              >
                <Avatar
                  alt={curUname}
                  src={"/static/images/avatar/1.jpg"}
                  sx={{ width: 36, height: 36 }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>

        {/* page divider */}
        <Divider
          variant="middle"
          sx={{
            height: "1px",
            backgroundColor: "var(--dark)",
          }}
        />
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <div className="drawer">
          <DrawerHeader sx={{ margin: "10px 0px" }}>
            <NavLink
              to="/"
              style={{
                textDecoration: "none",
                display: "flex",
              }}
              onClick={() => setWindowName("Dashboard")}
            >
              
              {/* company logo */}
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  height: "40px",
                  marginRight: open ? "10px" : "0px",
                }}
              >
                <img src={logoIcon} alt="Logo" className="logoIcon" />
              </ListItemIcon>
              <ListItemIcon
                primary="Workspace"
                sx={{
                  height: "40px",
                  opacity: open ? 1 : 0,
                  marginRight: open ? "20px" : "10px",
                  display: open ? "flex" : "none",
                }}
              >
                <img src={drawerLogo} alt="Logo" className="logoIcon" />
              </ListItemIcon>
            </NavLink>
          </DrawerHeader>

          {/* the divider belw the company logo */}
          <Divider
            variant="middle"
            sx={{
              height: "1.2px",
              backgroundColor: "var(--blue)",
              marginBottom: "10px",
            }}
          />

          {/* side bar items */}
          <List sx={{ marginTop: "10px" }}>
            {commonNav.map((item) => (
              <ListItem key={item.name} disablePadding>
                <NavLink
                  to={item.path}
                  key={item._id}
                  style={{
                    textDecoration: "none",
                  }}
                  onClick={() => setWindowName(item.name)}
                  className={({ isActive }) => {
                    return isActive ? "selectOn drawerBtns" : "drawerBtns";
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                  >
                    <p
                      style={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                      className="drawerIcons"
                    >
                      {item.icon}
                    </p>
                    <p
                      style={{
                        display: open ? "flex" : "none",
                      }}
                      className="drawerItems"
                    >
                      {item.name}
                    </p>
                  </ListItemButton>
                </NavLink>
              </ListItem>
            ))}
          </List>

          <Divider
            variant="middle"
            sx={{
              height: "1.2px",
              backgroundColor: "var(--blue)",
              marginBottom: "10px",
            }}
          />

          {/* Special List in side bar */}
            <List sx={{ marginTop: "10px" }}>
              {specialNav.map((item) => (
                <ListItem key={item.name} disablePadding>
                  <NavLink
                    to={item.path}
                    key={item._id}
                    style={{
                      textDecoration: "none",
                    }}
                    onClick={() => setWindowName(item.name)}
                    className={({ isActive }) => {
                      return isActive ? "selectOn drawerBtns" : "drawerBtns";
                    }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                    >
                      <p
                        style={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                        className="drawerIcons"
                      >
                        {item.icon}
                      </p>
                      <p
                        style={{
                          display: open ? "flex" : "none",
                        }}
                        className="drawerItems"
                      >
                        {item.name}
                      </p>
                    </ListItemButton>
                  </NavLink>
                </ListItem>
              ))}
            </List>
        </div>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexWrap: "wrap",
          justifyContent: "flex-start",
          flexGrow: 1,
          p: 3,
          backgroundColor: "var(--dashboard-bg)",
          minHeight: "100vh",
          paddingTop: "30px",
          overflowX: "hidden",
        }}
      >
        <DrawerHeader />
        
        {/* DASHBOARD CONTENT */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/users" element={<Users />} />
        </Routes>
      </Box>
    </Box>
  );
}