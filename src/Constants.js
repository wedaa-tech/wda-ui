const codeGenerationStatus = {
    SUBMITTED: 'SUBMITTED',
    IN_PROGRESS: 'IN-PROGRESS',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    DRAFT: 'DRAFT',
};

const transactionStatus = {
    REQUESTED: 'REQUESTED',
    CREDITED: 'CREDITED',
    DEBITED: 'DEBITED',
    FAILED: 'FAILED',
    PENDING: 'PENDING',
};

const defaultCredits = {
    CREDITS : 20
}

export default {
    codeGenerationStatus,
    transactionStatus,
    defaultCredits
};