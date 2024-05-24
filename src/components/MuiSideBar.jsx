import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from '@mui/icons-material/Home'; // For "Home"
import ShowChartIcon from '@mui/icons-material/ShowChart'; // For "Analysis"
import TextFieldsIcon from '@mui/icons-material/TextFields'; // For "Text Input"
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // For "Log Out"
import { NavLink, useNavigate } from 'react-router-dom';
import UploadIcon from '@mui/icons-material/Upload';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TableBarIcon from '@mui/icons-material/TableBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // Adjusted for spacing
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
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



export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  
 

  return (
    <ThemeProvider theme={darkTheme}>
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <DrawerHeader>
            <IconButton onClick={handleDrawerToggle}>
              {open ? (
                theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )
              ) : (
                <MenuIcon />
              )}
            </IconButton>
            {/* Conditional rendering of "Dashboard" text when drawer is open */}
            {open && (
              <Typography variant="h6" noWrap>
                Dashboard
              </Typography>
            )}
            <div /> {/* Placeholder to maintain space-between alignment */}
          </DrawerHeader>
        </DrawerHeader>
        <Divider />
        <List alignItems="flex-start">
          {/* Adapted list items */}
          <ListItem component={NavLink} to="/welcome" disablePadding  >
            <ListItemButton >
              <ListItemIcon>
                <UploadIcon />
              </ListItemIcon>
              <ListItemText primary="Upload" />
            </ListItemButton>
          </ListItem>
          <ListItem component={NavLink} to="/analysis" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AnalyticsIcon />
              </ListItemIcon>
              <ListItemText primary="Analytics" />
            </ListItemButton>
          </ListItem>
          <ListItem component={NavLink} to="/tablebar" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <TableBarIcon />
              </ListItemIcon>
              <ListItemText primary="Table & Bar" />
            </ListItemButton>
          </ListItem>
          <ListItem component={NavLink} to="/textinput" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <TextFieldsIcon />
              </ListItemIcon>
              <ListItemText primary="Text" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ mt: 'auto'}} />
        <List alignItems="flex-start">
          {/* Logout button adapted as a list item */}
          <ListItem component={NavLink} to="/"  disablePadding>
            <ListItemButton >
              <ListItemIcon >
                <ExitToAppIcon />
              </ListItemIcon>
              {/*<ListItemText primary="Log Out" />*/}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
    </ThemeProvider>
  );
}
