import * as React from 'react';
import { MenuItem } from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import SelectionDialog from './SelectionDialog';

interface LanguageSelectorProps extends WithTranslation {
}

interface LanguageSelectorState {
    open?: boolean;
    selectedLanguage?: string;
    isLoading?: boolean;
    error?: string;
}

class LanguageSelectionDialog extends React.Component<LanguageSelectorProps, LanguageSelectorState> {

    constructor(props: Readonly<LanguageSelectorProps>) {
        super(props);
        this.state = {};
    }

    private handleClick = () => {
        this.setState({ open: true });
    };

    private handleChange = (value: unknown) => {
        this.setState({ selectedLanguage: value as string })
    };

    private handleSelect = () => {
        const { i18n } = this.props;
        const { selectedLanguage } = this.state;
        if (selectedLanguage && selectedLanguage !== i18n.language) {
            this.setState({isLoading: true});
            i18n.changeLanguage(selectedLanguage)
                .then(_ => this.setState({ open: false, isLoading: false, error: undefined }))
                .catch(reason => this.setState({isLoading: false, error: reason}));
        }
    };

    private handleCancel = () => {
        this.setState({ open: false });
    };

    private renderLoading = () => {
        return (
            <div>

            </div>
        );
    };

    public render() {
        const { children, i18n } = this.props;
        const { open, isLoading, error } = this.state;
        return (
            <>
                <div onClick={this.handleClick}>
                    {children}
                </div>
                <SelectionDialog
                    open={open}
                    onChange={this.handleChange}
                    onCancel={this.handleCancel}
                    onSelect={this.handleSelect}
                    defaultValue={i18n.language}
                    error={error}
                    status={isLoading && this.renderLoading()}
                >
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                </SelectionDialog>
            </>
        );
    }
}

export default withTranslation()(LanguageSelectionDialog);
