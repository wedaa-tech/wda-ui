const setFieldErrors = (fields, errors) => {
    fields.forEach(field => {
        switch (field.key) {
            case 'applicationName':
                field.error = errors.duplicateApplicationNameError
                    ? 'Application name already exists. Please choose a unique name.'
                    : errors.appNameCheck
                    ? 'Application Name should not contain -, _ or numbers.'
                    : '';
                break;
            case 'theme':
                field.error = errors.themeError ? 'Select a Theme.' : '';
                break;
            case 'serverPort':
                field.error = errors.portValidationError ? errors.portValidationError.message : '';
                break;
            case 'packageName':
                field.error = errors.packageNameCheck ? 'Enter a valid package name' : '';
                break;
            case 'description':
                field.error = errors.descriptionError ? 'Service description should contain at least 5 words.' : '';
                break;
            default:
                field.error = '';
                break;
        }
    });
};

export default setFieldErrors;
