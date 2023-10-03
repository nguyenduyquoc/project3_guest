import React,{useState} from 'react';
//import {Link} from 'react-router-dom';
import { Collapse, Form } from 'react-bootstrap';

//Components 
import PageTitle from './../layouts/PageTitle';

//images
import book1 from './../assets/images/books/grid/book1.jpg';
import book2 from './../assets/images/books/grid/book2.jpg';
import book3 from './../assets/images/books/grid/book3.jpg';
import book4 from './../assets/images/books/grid/book4.jpg';
import book5 from './../assets/images/books/grid/book5.jpg';


const orderItem = [
    { image:book3 , title:'	Prduct Item 5', price:'28.00'},
    { image:book2 , title:'	Prduct Item 4', price:'26.00'},
    { image:book4 , title:'	Prduct Item 3', price:'30.00'},
    { image:book5 , title:'	Prduct Item 2', price:'36.00'},
    { image:book1 , title:'	Prduct Item 1', price:'27.00'}
];

const inputData = [
    {name1: 'Apartment, suite, unit etc.', name2:'Town / City'},
    {name1: 'State / County', name2:'Postcode / Zip'},
    {name1: 'Email', name2:'Phone'},
];

const SingleInput = ({title, ChangeClass}) =>{
    return(
        <>
            <div className={`form-group ${ChangeClass}`}>
                <input type="text" className="form-control" placeholder={title} />
            </div>
        </>
    )
}

function ShopCheckout(){
    const [accordBtn, setAccordBtn] = useState();
    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Shop" childPage="Checkout" />               
                <section className="content-inner-1">
				{/* <!-- Product --> */}
                    <div className="container">
                        <form className="shop-form">
                            <div className="row">
                                <div className="col-lg-6 col-md-6">
                                    <div className="widget">
                                        <h4 className="widget-title">Billing & Shipping Address</h4>
                                        <div className="form-group">
                                            <Form.Select aria-label="Åland Islands">
                                                <option>Åland Islands</option>
                                                <option value="1">Afghanistan</option>
                                                <option value="2">Albania</option>
                                                <option value="3">Algeria</option>
                                                <option value="4">Andorra</option>
                                                <option value="5">Angola</option>
                                                <option value="6">Anguilla</option>
                                                <option value="7">Antarctica</option>
                                                <option value="8">Antigua and Barbuda</option>
                                                <option value="9">Argentina</option>
                                                <option value="10">Armenia</option>
                                                <option value="11">Aruba</option>
                                                <option value="12">Australia</option>
                                            </Form.Select>	
                                        </div>
                                        <div className="row">
                                            <SingleInput ChangeclassName="col-md-6" title="First Name" />
                                            <SingleInput ChangeclassName="col-md-6" title="Last Name" />
                                        </div>
                                        <SingleInput title="Company Name" />
                                        <SingleInput title="Address" />
                                        {inputData.map((data, index)=>(
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <input type="text" className="form-control" placeholder={data.name1} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <input type="text" className="form-control" placeholder={data.name2} />
                                                </div>
                                            </div>
                                        ))}                                        
                                        <button className="btn btn-primary btnhover mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#create-an-account">Create an account <i className="fa fa-arrow-circle-o-down"></i></button>
                                        <div id="create-an-account" className="collapse">
                                            <p>Create an account by entering the information below. If you are a returning customer please login at the top of the page.</p>
                                            <div className="form-group">
                                                <input type="password" className="form-control" placeholder="Password" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <button className="btn btn-primary btnhover mb-3" type="button" 
                                        onClick={() => setAccordBtn(!accordBtn)}>Ship to a different address <i className="fa fa-arrow-circle-o-down"></i>
                                    </button>
                                    <Collapse in={accordBtn} >
                                        <div>
                                            <p>If you have shopped with us before, please enter your details in the boxes below. If you are a new customer please proceed to the Billing & Shipping section.</p>
                                            <div className="form-group">
                                                {/* <select className="default-select">
                                                    <option value="">Åland Islands</option>
                                                    <option value="">Afghanistan</option>
                                                    <option value="">Albania</option>
                                                    <option value="">Algeria</option>
                                                    <option value="">Andorra</option>
                                                    <option value="">Angola</option>
                                                    <option value="">Anguilla</option>
                                                    <option value="">Antarctica</option>
                                                    <option value="">Antigua and Barbuda</option>
                                                    <option value="">Argentina</option>
                                                    <option value="">Armenia</option>
                                                    <option value="">Aruba</option>
                                                    <option value="">Australia</option>
                                                </select>	 */}
                                                <Form.Select aria-label="Åland Islands">
                                                    <option>Åland Islands</option>
                                                    <option value="1">Afghanistan</option>
                                                    <option value="2">Albania</option>
                                                    <option value="3">Algeria</option>
                                                    <option value="4">Andorra</option>
                                                    <option value="5">Angola</option>
                                                    <option value="6">Anguilla</option>
                                                    <option value="7">Antarctica</option>
                                                    <option value="8">Antigua and Barbuda</option>
                                                    <option value="9">Argentina</option>
                                                    <option value="10">Armenia</option>
                                                    <option value="11">Aruba</option>
                                                    <option value="12">Australia</option>
                                                </Form.Select>
                                            </div>
                                            <div className="row">
                                                <SingleInput ChangeclassName="col-md-6" title="First Name" />
                                                <SingleInput ChangeclassName="col-md-6" title="Last Name" />
                                            </div>
                                            <SingleInput title="Company Name" />
                                            <SingleInput title="Address" />
                                            {inputData.map((data, index)=>(
                                                <div className="row">
                                                    <div className="form-group col-md-6">
                                                        <input type="text" className="form-control" placeholder={data.name1} />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <input type="text" className="form-control" placeholder={data.name2} />
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <p>Create an account by entering the information below. If you are a returning customer please login at the top of the page.</p>
                                        </div>    
                                    </Collapse>
                                    <div className="form-group">
                                        <textarea className="form-control" placeholder="Notes about your order, e.g. special notes for delivery"></textarea>
                                    </div>
                                
                                </div>
                            </div>
                        </form>
                        <div className="dz-divider bg-gray-dark text-gray-dark icon-center  my-5"><i className="fa fa-circle bg-white text-gray-dark"></i></div>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="widget">
                                    <h4 className="widget-title">Your Order</h4>
                                    <table className="table-bordered check-tbl">
                                        <thead className="text-center">
                                            <tr>
                                                <th>IMAGE</th>
                                                <th>PRODUCT NAME</th>
                                                <th>TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderItem.map((item, ind)=>(
                                                <tr key={ind}>
                                                    <td className="product-item-img"><img src={item.image} alt="" /></td>
                                                    <td className="product-item-name">{item.title}</td>
                                                    <td className="product-price">${item.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <form className="shop-form widget">
                                    <h4 className="widget-title">Order Total</h4>
                                    <table className="table-bordered check-tbl mb-4">
                                        <tbody>
                                            <tr>
                                                <td>Order Subtotal</td>
                                                <td className="product-price">$125.96</td>
                                            </tr>
                                            <tr>
                                                <td>Shipping</td>
                                                <td>Free Shipping</td>
                                            </tr>
                                            <tr>
                                                <td>Coupon</td>
                                                <td className="product-price">$28.00</td>
                                            </tr>
                                            <tr>
                                                <td>Total</td>
                                                <td className="product-price-total">$506.00</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h4 className="widget-title">Payment Method</h4>
                                    <SingleInput title="Name on Card" />
                                    <div className="form-group">
                                        <Form.Select aria-label="Credit Card Type">
                                            <option>Credit Card Type</option>
                                            <option value="1">Cashback credit cards</option>
                                            <option value="2">Travel credit cards.</option>
                                            <option value="3">Business credit cards</option>
                                        </Form.Select>
                                    </div>
                                    <SingleInput title="Credit Card Number" />
                                    <SingleInput title="Card Verification Number" />
                                    <div className="form-group">
                                        <button className="btn btn-primary btnhover" type="button">Place Order Now </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Product END --> */}
                </section>
                
            </div>
        </>
    )
}
export default ShopCheckout;