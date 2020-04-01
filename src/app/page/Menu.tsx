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
import MenuStyle from './MenuStyle';
import clsx from 'clsx';
import { AuthServiceProps, withAuthService } from '../../service/AuthService';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import ConfirmationDialog from '../dialog/ConfirmationDialog';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import LanguageSelector from '../dialog/LanguageSelectionDialog';

interface MenuProps extends WithWidthProps, StyledComponentProps, AuthServiceProps, WithTranslation {
    classes: ClassNameMap;
    theme: Theme;
    width: Breakpoint;
}

interface MenuState {
    open?: boolean;
    hasUserRequestedLogout?: boolean;
}

class Menu extends React.Component<MenuProps, MenuState> {

    constructor(props: Readonly<any>) {
        super(props);
        this.state = {};
    }

    private handleDrawerToggle = () => {
        this.setState({ open: !this.state.open });
    };

    private handleLogout = () => {
        this.setState({ hasUserRequestedLogout: true });
    };

    private handleLogoutConfirmation = () => {
        this.setState({ hasUserRequestedLogout: false });
        this.props.authService.logout();
    };

    private handleLogoutCancel = () => {
        this.setState({ hasUserRequestedLogout: false });
    };

    public render = () => {
        const { classes, width, theme } = this.props;
        const { open, hasUserRequestedLogout } = this.state;
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
                            <Icons.Menu/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Modulplaner
                        </Typography>
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
                            {theme.direction === 'rtl' ? <Icons.ChevronRight/> : <Icons.ChevronLeft/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    <List className={classes.list}>
                        <ListItem button>
                            <ListItemIcon><Icons.Home/></ListItemIcon>
                            <ListItemText primary={'Home'}/>
                        </ListItem>
                        <div className={classes.grow}/>
                        <LanguageSelector>
                            <ListItem button>
                                <ListItemIcon><Icons.Language/></ListItemIcon>
                                <ListItemText primary={<Trans>translation:language</Trans>}/>
                            </ListItem>
                        </LanguageSelector>
                        <ListItem button onClick={this.handleLogout}>
                            <ListItemIcon><Icons.ExitToApp/></ListItemIcon>
                            <ListItemText primary={<Trans>translation:messages.logout.title</Trans>}/>
                        </ListItem>
                    </List>
                </Drawer>
                <ConfirmationDialog
                    title={'translation:messages.logout.title'}
                    content={'translation:messages.logout.content'}
                    confirmLabel={'translation:messages.logout.confirm'}
                    onConfirm={this.handleLogoutConfirmation}
                    onCancel={this.handleLogoutCancel}
                    open={hasUserRequestedLogout}
                />
            </div>
        );
    }
}

export default withTranslation()(withAuthService(withWidth()(withStyles(MenuStyle)(withTheme(Menu)))));