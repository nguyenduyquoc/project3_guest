import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';

//Components 
import PageTitle from './../layouts/PageTitle';
import {useAuth} from "../context/AuthContext";
import {toast} from "react-toastify";
import SimpleReactValidator from "simple-react-validator";
import {registerUser} from "../services/auth.service";
import {useLoading} from "../context/LoadingContext";

function Registration(){
    const {authState, authDispatch} = useAuth();
    const {loadingDispatch} = useLoading();

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        confirm_password: ''
    })

    const changeHandler = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        validator.showMessages();
    };
    const [validator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13',
        messages: {
            in: 'The confirm password field does not match'
        },
    }));
    const history = useHistory();
    const submitForm = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            try {
                loadingDispatch({type: 'START_LOADING'});
                const userData = {
                    fname: formData.fname,
                    lname: formData.lname,
                    email: formData.email,
                    password: formData.password
                };
                const registerData = await registerUser(userData);
                authDispatch({ type: 'SET_TOKEN', payload: registerData.token });
                authDispatch({ type: 'SET_USER', payload: registerData.user });
                console.log(registerData);
                toast.success('Registration Complete successfully!');
                history.push('/');
            } catch (error) {
                toast.error('An error occurred. Please try again!');
            } finally {
                loadingDispatch({type: 'STOP_LOADING'});
            }
        } else {
            validator.showMessages();
            toast.error('Empty field is not allowed!');
        }
    };
    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Shop" childPage="Registration" />               
                <section className="content-inner shop-account">
				
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="login-area">
                                    <form onSubmit={submitForm}>
                                        <h4 className="text-secondary">Registration</h4>
                                        <p className="font-weight-600">If you don't have an account with us, please Registration.</p>
                                        <div className="mb-4">
                                            <label className="label-title">First name *</label>
                                            <input
                                                name="fname"
                                                className="form-control"
                                                placeholder="Your First name"
                                                type="text"
                                                value={formData.fname}
                                                onChange={(e) => changeHandler(e)}
                                            />
                                            {validator.message('fname', formData.fname, 'required')}
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Last name *</label>
                                            <input
                                                name="lname"
                                                className="form-control"
                                                placeholder="Your Last name"
                                                type="text"
                                                value={formData.lname}
                                                onChange={(e) => changeHandler(e)}
                                            />
                                            {validator.message('lname', formData.lname, 'required')}
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Email address *</label>
                                            <input
                                                name="email"
                                                className="form-control"
                                                placeholder="Your Email address"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => changeHandler(e)}
                                            />
                                            {validator.message('email', formData.email, 'required|email')}
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Password *</label>
                                            <input
                                                name="password"
                                                className="form-control "
                                                placeholder="Type Password"
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => changeHandler(e)}
                                            />
                                            {validator.message('password', formData.password, 'required|min:6')}
                                        </div>
                                        <div className="mb-4">
                                            <label className="label-title">Confirm Password *</label>
                                            <input
                                                name="confirm_password"
                                                className="form-control"
                                                placeholder="Type Password"
                                                type="password"
                                                value={formData.confirm_password}
                                                onChange={(e) => changeHandler(e)}
                                            />
                                            {validator.message('confirm_password', formData.confirm_password, `required|min:6|in:${formData.password}`)}
                                        </div>
                                        <div className="mb-5">
                                            <small>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <Link to={"privacy-policy"}>privacy policy</Link>.</small>
                                        </div>
                                        <div className="text-left">
                                            <button type="submit" className="btn btn-primary btnhover w-100 me-2">Register</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
            </div>
        </>
    )
}
export default Registration;