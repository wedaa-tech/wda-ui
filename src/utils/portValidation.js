const validatePortNumber = (port, uniquePortNumbers, currentPort) => {
    const portValidationError = {};

    if (port) {
        const isDuplicatePort = uniquePortNumbers.includes(port) && port !== currentPort;
        const reservedPorts = ['5601', '9200', '15021', '20001', '3000', '8080'];
        const serverPortCheck = reservedPorts.includes(port);
        const portNumberRangeCheck = Number(port) < 1024 || Number(port) > 65535;

        if (isDuplicatePort) {
            portValidationError.message = 'Port Number already exists. Please choose a unique Port Number.';
        }

        if (serverPortCheck) {
            portValidationError.message = 'The input cannot contain a reserved port number.';
        }

        if (portNumberRangeCheck) {
            portValidationError.message = 'Port Number is out of the valid range.';
        }
    } else {
        portValidationError.message = 'Port number is required.';
    }

    return portValidationError;
};

export default validatePortNumber;