import {Link} from "react-router-dom";
import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const renderPages = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li
                    key={i}
                    onClick={() => onPageChange(i)}
                    className="page-item"
                >
                    <Link to="" className={currentPage === i ? 'page-link active' : 'page-link'}>{i}</Link>
                </li>
            )
        }

        return pages;
    };

    return (
        <nav aria-label="Blog Pagination">
            <ul className="pagination style-1 p-t20">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <Link to="" className="page-link prev" onClick={() => onPageChange(currentPage - 1)}>Prev</Link>
                </li>
                {renderPages()}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <Link to="" className="page-link next" onClick={() => onPageChange(currentPage + 1)}>Next</Link>
                </li>
            </ul>
        </nav>
    )
};

export default Pagination;