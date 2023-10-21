import React,{useState} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import SimpleReactValidator from "simple-react-validator";

//Components 
import PageTitle from './../layouts/PageTitle';
import {useAuth} from "../context/AuthContext";
import {loginUser} from "../services/auth.service";
import {toast} from "react-toastify";
import {useLoading} from "../context/LoadingContext";

function Login(props){

    const location = useLocation(); // Get the current location
    const previousPath = location.state?.from || "/";
    const [forgotPass, setForgotPass] = useState();

    const { loadingDispatch} = useLoading();

    const {authState, authDispatch} = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const changeHandler = (e)=>{
        setFormData({...formData, [e.target.name]: e.target.value});
        validator.showMessages();
    }
    const [validator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13'
    }));

    const submitForm = async (e)=>{
        e.preventDefault();
        if (validator.allValid()) {
            try {
                loadingDispatch({type: 'START_LOADING'});
                const loginData = await loginUser(formData);
                authDispatch({ type: 'SET_TOKEN', payload: loginData.token });
                authDispatch({ type: 'SET_USER', payload: loginData.user });
                console.log(loginData);
                toast.success('You successfully Login!');
                props.history.push(previousPath);
            } catch (error) {
                toast.error('Wrong email or password!');
            } finally {
                loadingDispatch({type: 'STOP_LOADING'});
            }
        } else {
            validator.showMessages();
            toast.error('Empty field is not allowed!');
        }
    }
    return(
        <>
            <div className="page-content">
                <PageTitle  parentPage="Shop" childPage="Login" />               
                <section className="content-inner shop-account">                    
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="login-area">
                                    <div className="tab-content">
                                        <h4>NEW CUSTOMER</h4>
                                        <p>By creating an account with our store, you will be able to move through the checkout process faster, store multiple shipping addresses, view and track your orders in your account and more.</p>
                                        <Link to={"shop-registration"} className="btn btn-primary btnhover m-r5 button-lg radius-no">CREATE AN ACCOUNT</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 mb-4">
                                <div className="login-area">
                                    <div className="tab-content nav">
                                        <form onSubmit={submitForm} className={` col-12 ${forgotPass ? 'd-none' : ''}`}>
                                            <h4 className="text-secondary">LOGIN</h4>
                                            <p className="font-weight-600">If you have an account with us, please log in.</p>
                                            <div className="mb-4">
                                                <label className="label-title">E-MAIL *</label>
                                                <input
                                                    name="email"
                                                    className="form-control"
                                                    placeholder="Your Email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => changeHandler(e)}
                                                />
                                                {validator.message('email', formData.email, 'required|email')}
                                            </div>
                                            <div className="mb-4">
                                                <label className="label-title">PASSWORD *</label>
                                                <input
                                                    name="password"
                                                    className="form-control "
                                                    placeholder="Type Password"
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={e => changeHandler(e)}
                                                />
                                                {validator.message('password', formData.password, 'required|min:6')}
                                            </div>
                                            <div className="text-left">
                                                <button type="submit" className="btn btn-primary btnhover me-2">login</button>
                                                <Link to={"#"}  className="m-l5"
                                                    onClick={()=>setForgotPass(!forgotPass)}
                                                >
                                                    <i className="fas fa-unlock-alt"></i> Forgot Password
                                                </Link> 
                                            </div>
                                        </form>
                                        <form  onSubmit={(e) => e.preventDefault()} className={`  col-12 ${forgotPass ? '' : 'd-none'}`} >
                                            <h4 className="text-secondary">FORGET PASSWORD ?</h4>
                                            <p className="font-weight-600">We will send you an email to reset your password. </p>
                                            <div className="mb-3">
                                                <label className="label-title">E-MAIL *</label>
                                                <input name="dzName" required="" className="form-control" placeholder="Your Email Id" type="email" />
                                            </div>
                                            <div className="text-left"> 
                                                <Link to={"#"} className="btn btn-outline-secondary btnhover m-r10 active"
                                                    onClick={()=>setForgotPass(!forgotPass)}
                                                >Back</Link>
                                                <button type="submit" className="btn btn-primary btnhover">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </section>
            </div>
        </>
    )
}
export default Login;