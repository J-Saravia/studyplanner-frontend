import * as React from 'react';
import { Chip, isWidthDown, StyledComponentProps, withStyles, withWidth, WithWidthProps } from '@material-ui/core';
import SemesterModuleVisitStyle from './SemesterModuleVisitStyle';
import clsx from 'clsx';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ModuleVisit from '../../model/ModuleVisit';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

interface SemesterModuleProps extends WithWidthProps, StyledComponentProps, WithWidthProps {
    moduleVisit: ModuleVisit;
    onClick?: () => void;
    onDelete?: () => void;
    width: Breakpoint;
    classes: ClassNameMap;
}

class SemesterModuleVisit extends React.Component<SemesterModuleProps, any> {

    constructor(props: Readonly<any>) {
        super(props);
        this.state = {};
    }

    private onMouseEnter = () => {
        this.setState({isMouseOver: true});
    };

    private onMouseLeave = () => {
        this.setState({isMouseOver: false});
    };

    private onClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.blur();
        const { onClick } = this.props;
        if (onClick) {
            onClick();
        }
    };

    private onDelete = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.blur();
        const { onDelete } = this.props;
        if (onDelete) {
            onDelete();
        }
    };

    public render() {
        const { isMouseOver } = this.state;
        const { classes, onClick, onDelete, width, moduleVisit } = this.props;

        const planned = moduleVisit.state === 'planned';
        const active = moduleVisit.state === 'ongoing';
        const passed = moduleVisit.state === 'passed';
        const failed = moduleVisit.state === 'failed';

        const label = moduleVisit.module.code + (moduleVisit.grade ? ` (${moduleVisit.grade})` : '');

        const isMobile = isWidthDown('sm', width);
        const chipWidth = (isMobile ? 40 : 112) * (moduleVisit.module.credits / 2);

        return (
            <Chip
                draggable
                tabIndex={-1}
                label={label}
                onDelete={(!isMobile && onDelete) ? this.onDelete : undefined}
                onClick={onClick && this.onClick}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                color="primary"
                classes={{
                    root: clsx(classes.root, {
                        [classes.planned]: planned,
                        [classes.ongoing]: active,
                        [classes.passed]: passed,
                        [classes.failed]: failed,
                        [classes.mobile]: isMobile,
                    }),
                    deleteIcon: clsx(classes.button, {
                        [classes.hidden]: !isMouseOver
                    }),
                    label: classes.label,
                }}
                style={{
                    width: isMobile ? '' : `${chipWidth}px`,
                    height: !isMobile ? '' : `${chipWidth}px`
                }}
            />
        )
    }

}

export default withWidth()(withStyles(SemesterModuleVisitStyle)(SemesterModuleVisit));
