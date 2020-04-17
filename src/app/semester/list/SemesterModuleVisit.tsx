import * as React from 'react';
import { Chip, isWidthDown, StyledComponentProps, withStyles, withWidth, WithWidthProps } from '@material-ui/core';
import SemesterModuleVisitStyle from './SemesterModuleVisitStyle';
import clsx from 'clsx';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ModuleVisit from '../../../model/ModuleVisit';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

interface SemesterModuleProps extends StyledComponentProps, WithWidthProps {
    moduleVisit: ModuleVisit;
    onClick?: () => void;
    onDelete?: () => void;
    width: Breakpoint;
    classes: ClassNameMap;
    isDetailed: Boolean;
}

class SemesterModuleVisit extends React.Component<SemesterModuleProps, any> {

    constructor(props: Readonly<any>) {
        super(props);
        this.state = {};
    }

    private onMouseEnter = () => {
        this.setState({ isMouseOver: true });
    };

    private onMouseLeave = () => {
        this.setState({ isMouseOver: false });
    };

    private onClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.blur();
        event.preventDefault();
        event.stopPropagation();
        const { onClick } = this.props;
        if (onClick) {
            onClick();
        }
    };

    private onDelete = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget.blur();
        event.preventDefault();
        event.stopPropagation();
        const { onDelete } = this.props;
        if (onDelete) {
            onDelete();
        }
    };

    public render() {
        const { isMouseOver } = this.state;
        const { classes, onClick, onDelete, width, moduleVisit, isDetailed } = this.props;

        const planned = moduleVisit.state === 'planned';
        const active = moduleVisit.state === 'ongoing';
        const passed = moduleVisit.state === 'passed';
        const failed = moduleVisit.state === 'failed';

        const labelPreview = moduleVisit.module.code + (moduleVisit.grade ? ` (${moduleVisit.grade})` : '');
        const labelView = <div>
            <div className={classes.moduleCode}>
                {moduleVisit.module.code}
            </div>
            <div className={classes.label}>{moduleVisit.module.credits} ETCS
                {moduleVisit.module.msp !== 'NONE' ? ', MSP' : ''}
            </div>
            <div className={classes.label}>
                {moduleVisit.grade ? `(${moduleVisit.grade})` : ''}
            </div>
        </div>;

        const isMobile = isWidthDown('sm', width);
        const chipWidth = (isMobile ? 40 : 112) * (moduleVisit.module.credits / 2);

        return (
            <Chip
                tabIndex={-1}
                label={isDetailed ? labelView : labelPreview}
                onDelete={(!isMobile && onDelete) ? this.onDelete : undefined}
                onClick={onClick && this.onClick}
                onMouseEnter={this.onMouseEnter}
                onMouseOver={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                color="primary"
                classes={{
                    root: clsx(classes.root, {
                        [classes.planned]: planned,
                        [classes.ongoing]: active,
                        [classes.passed]: passed,
                        [classes.failed]: failed,
                        [classes.mobile]: !isDetailed && isMobile,
                    }),
                    deleteIcon: clsx(classes.button, {
                        [classes.hidden]: !isMouseOver
                    }),
                    label: classes.label,
                }}
                style={{
                    width: isDetailed ? (!isMobile ? '135px' : '110px') : (isMobile ? '' : `${chipWidth}px`),
                    height: isDetailed ? '70px' : (!isMobile ? '' : `${chipWidth}px`)
                }}
            />
        )

    }

}

export default withWidth()(withStyles(SemesterModuleVisitStyle)(SemesterModuleVisit));
