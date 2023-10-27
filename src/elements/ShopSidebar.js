import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Accordion} from 'react-bootstrap';

import SlideDragable from './SlideDragable';
import {useCategories} from "../context/CategoryContext";
import {useLoading} from "../context/LoadingContext";
import {getPublishers} from "../services/publisher.service";
import {getAuthors} from "../services/author.servive";
import {getPublishYears} from "../services/product.service";

const ShopSidebar = ({filterCriteria, setFilterCriteria, setShowSidebar}) =>{
    const categories = useCategories();
    const { loadingDispatch } = useLoading();
    const [publishers, setPublishers] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishYears, setPublishYears] = useState([]);

    useEffect(() => {
        fetchPublishers();
        fetchAuthors();
        fetchPublishYears();
    }, [])

    // GET ALL PUBLISHERS
    const fetchPublishers = async () => {
        try {
            loadingDispatch({type : "START-LOADING"});
            const response = await getPublishers();
            console.log(response);
            setPublishers(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type : "STOP-LOADING"});
        }
    }

    // GET ALL AUTHORS
    const fetchAuthors = async () => {
        try {
            loadingDispatch({type : "START-LOADING"});
            const response = await getAuthors();
            console.log(response);
            setAuthors(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type : "STOP-LOADING"});
        }
    }

    //GET ALL YEARS
    const fetchPublishYears = async () => {
        try {
            loadingDispatch({type : "START-LOADING"});
            const response = await getPublishYears();
            console.log(response);
            setPublishYears(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type : "STOP-LOADING"});
        }
    }

    const renderCategoryCheckboxes = (categories, level = 0) => {
        return categories.map((item) => (
            <React.Fragment key={item.id}>
                <div className={`form-check search-content${level > 0 ? ' m-l20' : ''}`} >
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`shopcategoryCheckBox-${item.id}`}
                        checked={filterCriteria.categoryIds.includes(item.id)}
                        onChange={() => handleCategoryToggle(item.id)}
                    />
                    <label className="form-check-label" htmlFor={`shopcategoryCheckBox-${item.id}`}>
                        {item.name}
                    </label>
                </div>
                {item.inverseParent && item.inverseParent.length > 0 && renderCategoryCheckboxes(item.inverseParent, level + 1)}
            </React.Fragment>
        ));
    };

    // HANDLING FUNCTION WHEN CHANGING CATEGORY
    const handleCategoryToggle = (categoryId) => {
        // tao ban sao mang CategoryIds => k anh huong den categoryIds goc
        const updatedSelectedCategoryId = [...filterCriteria.categoryIds];
        if(updatedSelectedCategoryId.includes(categoryId)) {
            // khi minh nhấn vào một Category mà categoryid đã nằm trong mảng updatedSelectedCategoryId thì mình xóa nó khỏi mảng
            const index = updatedSelectedCategoryId.indexOf(categoryId);
            updatedSelectedCategoryId.splice(index, 1);
        } else {
            // ngược lại
            updatedSelectedCategoryId.push(categoryId);
        }

        categories.forEach((category) => {
            // đến đây duyệt các Category trong list categories
            if (category.id === categoryId) {
                if(updatedSelectedCategoryId.includes(category.id)){
                    /*nếu category mà mình nhấn chọn nếu nó vẫn đang tồn tại trong mảng updatedSelectedCategoryId,
                    thì kiểm tra các category con xem đã tồn tại trong mảng updatedSelectedCategoryIdhay chưa , nếu chưa thì thêm vào mảng*/
                    category.inverseParent.forEach((inverseParent) => {
                        if (!updatedSelectedCategoryId.includes(inverseParent.id)) {
                            updatedSelectedCategoryId.push(inverseParent.id);
                        }
                    });
                } else {
                    updatedSelectedCategoryId.splice(updatedSelectedCategoryId.indexOf(category.id), 1);
                    category.inverseParent.forEach((inverseParent) => {
                        const inverseParentIndex = updatedSelectedCategoryId.indexOf(inverseParent.id);
                        if (inverseParentIndex !== -1) {
                            updatedSelectedCategoryId.splice(inverseParentIndex, 1);
                        }
                    });
                }
            }
        });

        setFilterCriteria({
            ...filterCriteria,
            categoryIds: updatedSelectedCategoryId,
        });
    }

    // HANDLING FUNCTION WHEN CHANGING AUTHOR
    const handleAuthorToggle = (authorId) => {
        // Create a copy of the selected publishers array
        const updatedSelectedAuthors = [...filterCriteria.authorIds];

        // If the publisher is already selected, unselect it; otherwise, select it
        if (updatedSelectedAuthors.includes(authorId)) {
            const index = updatedSelectedAuthors.indexOf(authorId);
            updatedSelectedAuthors.splice(index, 1);
        } else {
            updatedSelectedAuthors.push(authorId);
        }

        // Update the filterCriteria with the selected publishers
        setFilterCriteria({
            ...filterCriteria,
            authorIds: updatedSelectedAuthors,
        });
    };

    const handlePublisherToggle = (publisherId) => {
        // Create a copy of the publisher IDs array in filterCriteria
        const updatedPublisherIds = [...filterCriteria.publisherIds];

        if (updatedPublisherIds.includes(publisherId)) {
            const index = updatedPublisherIds.indexOf(publisherId);
            updatedPublisherIds.splice(index, 1);
        } else {
            updatedPublisherIds.push(publisherId);
        }

        // Update the filterCriteria with the updated publisher IDs
        setFilterCriteria({
            ...filterCriteria,
            publisherIds: updatedPublisherIds,
        });
    };

    const handleYearToggle = (year) => {
        // Create a copy of the selected years array in filterCriteria
        const updatedSelectedYears = [...filterCriteria.publishYears];

        // If the year is already selected, unselect it; otherwise, select it
        if (updatedSelectedYears.includes(year)) {
            const index = updatedSelectedYears.indexOf(year);
            updatedSelectedYears.splice(index, 1);
        } else {
            updatedSelectedYears.push(year);
        }

        // Update the filterCriteria with the selected years
        setFilterCriteria({
            ...filterCriteria,
            publishYears: updatedSelectedYears,
        });
    };
    return(
        <>
            <div className="shop-filter">
                <div className="d-flex justify-content-between">
                    <h4 className="title">Filter Option</h4>
                    <Link
                        className="panel-close-btn"
                        onClick={() => setShowSidebar(false)}
                    ><i className="flaticon-close"></i>
                    </Link>
                </div>
                <Accordion className="accordion-filter" defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            Price Range
                        </Accordion.Header>
                        <Accordion.Body >
                            <div className="range-slider style-1">
                                <div id="slider-tooltips">
                                    <SlideDragable filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria}/>
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item  eventKey="1">
                        <Accordion.Header >
                            Shop by Category
                        </Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services d-flex justify-content-between">
                                <div className="">
                                    {renderCategoryCheckboxes(categories)}
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Choose Publisher</Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services">
                                {publishers.map((publisher) => (
                                    <div className="form-check search-content" key={publisher.id}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`publisherCheckBox-${publisher.id}`}
                                            checked={filterCriteria.publisherIds.includes(publisher.id)}
                                            onChange={() => handlePublisherToggle(publisher.id)}
                                        />
                                        <label className="form-check-label" htmlFor={`publisherCheckBox-${publisher.id}`}>
                                            {publisher.name}
                                        </label>
                                    </div>
                                ))}

                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Select Author</Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services">
                                <div className="">
                                    {authors.map((author)=>(
                                        <div className="form-check search-content" key={author.id}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`productCheckBox${author.id}`}
                                                checked={filterCriteria.authorIds.includes(author.id)}
                                                onChange={() => handleAuthorToggle(author.id)}
                                            />
                                            <label className="form-check-label" htmlFor={`productCheckBox${author.id}`}>
                                                {author.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="4">
                        <Accordion.Header>Select Year</Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services col d-flex justify-content-between">
                                <div className="row">
                                    {publishYears.map((year, index) => (
                                        <div className="col-6" key={index}>
                                            <div className="form-check search-content">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`productCheckBox${index}`}
                                                    checked={filterCriteria.publishYears.includes(year)}
                                                    onChange={() => handleYearToggle(year)}
                                                />
                                                <label className="form-check-label" htmlFor={`productCheckBox${index}`}>
                                                    {year}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <div className="row filter-buttons">
                    <div>
                        {/*<Link to={"#"} className="btn btn-secondary btnhover mt-4 d-block">Refine Search</Link>*/}
                        <Link
                            className="btn btn-outline-secondary btnhover mt-3 d-block"
                            onClick={() => setFilterCriteria({
                                page: 1,
                                pageSize: 9,
                                minPrice: null,
                                maxPrice: null,
                                categoryIds: [],
                                authorIds: [],
                                publisherIds: [],
                                publishYears: [],
                                sortBy: "newest",
                                searchQuery: null,
                                status: 1
                            })}
                        >
                            Reset Filter
                        </Link>
                    </div>
                </div>
            </div>

        </>
    )
}
export default ShopSidebar;