import React from 'react';

const Pagination = ({ FeedbacksPerPage, totalFeedbacks, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalFeedbacks / FeedbacksPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination" style={{ marginBottom: '20px' }}>
                {pageNumbers.map((number, index) => (
                    <li key={number} className="page-item" style={{ marginRight: index < pageNumbers.length - 1 ? '10px' : '0' }}>
                        <a onClick={() => paginate(number)} href="#" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
