import * as React from 'react';
import { ClassNameMap, StyledComponentProps, withStyles } from '@material-ui/styles';
import {
    AppBar,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
    withWidth,
    isWidthDown,
    withTheme,
    Divider,
    List,
    ListItemText,
    ListItem,
    ListItemIcon,
    WithWidthProps,
    Theme
} from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import HiddenJs from '@material-ui/core/Hidden/HiddenJs';
import MenuStyle from './MenuStyle';
import clsx from 'clsx';
import { AuthServiceProps, withAuthService } from '../../service/AuthService';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

interface MenuProps extends WithWidthProps, StyledComponentProps, AuthServiceProps {
    classes: ClassNameMap;
    theme: Theme;
    width: Breakpoint;
}

interface MenuState {
    open?: boolean;
}

class Menu extends React.Component<MenuProps, MenuState> {

    constructor(props: Readonly<any>) {
        super(props);
        this.state = {};
    }

    private handleDrawerToggle = () => {
        this.setState({ open: !this.state.open })
    };

    public render = () => {
        const { classes, width, theme } = this.props;
        const { open } = this.state;
        const isMobile = isWidthDown('sm', width);
        return (
            <div>
                <AppBar position="fixed" className={clsx(classes.appBar, {
                    [classes.appBarShift]: open && !isMobile
                })}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: open && !isMobile,
                            })}
                            onClick={this.handleDrawerToggle}
                        >
                            <Icons.Menu />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Modulplaner
                        </Typography>
                        <div className={classes.grow} />
                        <HiddenJs smDown>
                            <IconButton
                                edge="end"
                                aria-label="Create New Entry"
                                aria-controls="new-entry"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <Icons.AddCircle fontSize="large"/>
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="Current user"
                                aria-controls="current-user"
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <Icons.AccountCircle fontSize="large"/>
                            </IconButton>
                        </HiddenJs>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open || isMobile,
                        [classes.drawerClose]: !open && !isMobile,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open || isMobile,
                            [classes.drawerClose]: !open && !isMobile,
                        }),
                    }}
                    open={open}
                    onClose={this.handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={this.handleDrawerToggle}>
                            {theme.direction === 'rtl' ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List className={classes.list}>
                        <ListItem button>
                            <ListItemIcon><Icons.Home /></ListItemIcon>
                            <ListItemText primary={"Home"} />
                        </ListItem>
                        <div className={classes.grow} />
                        <ListItem button onClick={() => this.props.authService.logout()}>
                            <ListItemIcon><Icons.ExitToApp /></ListItemIcon>
                            <ListItemText primary={"Logout"} />
                        </ListItem>
                    </List>
                </Drawer>
            </div>
        );
    }
}

export default withAuthService(withWidth()(withStyles(MenuStyle)(withTheme(Menu))));