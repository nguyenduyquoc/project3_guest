import React, {useEffect, useState} from 'react';

import {useLoading} from "../context/LoadingContext";
import {useUser} from "../context/UserContext";
import ProfileSidebar from "../elements/ProfileSidebar";
import SimpleReactValidator from "simple-react-validator";
import {toast} from "react-toastify";
import {updateUserProfile} from "../services/user.service";
import {resetPassword} from "../services/auth.service";

function MyProfile(){

    const { loadingDispatch } = useLoading();
    const { user, getUserFromToken } = useUser();

    const [ formData, setFormData ] = useState({
        fname: '',
        lname: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (user != null) {
            setFormData ({
                ...formData,
                fname : user.fname || '',
                lname : user.lname || '',
                email : user.email || '',
                phone : user.phone || '',
            })
        }
    }, [user])


    const changeHandler = (e) => {
        setFormData( {
            ...formData,
            [e.target.name] : e.target.value
        });
        validator.showMessages();
    }

    const [validator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13'
    }));

    const submitUpdateProfileForm = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {
            try {
                loadingDispatch({type: 'START_LOADING'});

                // update user profile:
                await updateUserProfile({
                    fname: formData.fname,
                    lname: formData.lname,
                    email: formData.email,
                    phone: formData.phone,
                    avatar: ''
                });
                getUserFromToken();
                toast.success('Update profile success!');
            } catch (error) {
                toast.error('Fail updating profile!');
            } finally {
                loadingDispatch({type: 'STOP_LOADING'});
            }
        } else {
            toast.error('Input validation fail!');
        }
    };


    // RESET PASSWORD
    const [ resetPwFormData, setResetPwFormData ] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [passwordValidator] = React.useState(new SimpleReactValidator({
        className: 'text-danger font-13',
        messages: {
            in: 'The confirm password field does not match'
        },
    }));

    const passwordChangeHandler = (e) => {
        setResetPwFormData({...resetPwFormData, [e.target.name]: e.target.value});
        passwordValidator.showMessages();
    };

    const submitResetPasswordForm = async (e) => {
        e.preventDefault();
        if (passwordValidator.allValid()) {
            try {
                loadingDispatch({type: 'START_LOADING'});
                // Then update user profile:
                await resetPassword({
                    oldPassword: resetPwFormData.oldPassword,
                    newPassword: resetPwFormData.newPassword
                });
                toast.success('Reset password successfully!');
                setResetPwFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            } catch (error) {
                toast.error('Fail to reset password!');
            } finally {
                loadingDispatch({type: 'STOP_LOADING'});
            }
        } else {
            toast.error('Input validation fail!');
        }
    };
    return(
        <>
            {user != null &&
                <div className="page-content bg-white">
                    <div className="content-block">
                        <section className="content-inner bg-white">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xl-3 col-lg-4 m-b30">
                                        <ProfileSidebar user={user} />
                                    </div>
                                    <div className="col-xl-9 col-lg-8 m-b30">
                                        <div className="shop-bx shop-profile">
                                            <div className="shop-bx-title clearfix">
                                                <h5 className="text-uppercase">User Information</h5>
                                            </div>
                                            <form id="profile-update-form" onSubmit={submitUpdateProfileForm}>
                                                <div className="row m-b30">
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-label">First Name</label>
                                                            <input
                                                                type="text"
                                                                name="fname"
                                                                className="form-control"
                                                                value={formData.fname}
                                                                onChange={(e) => changeHandler(e)}
                                                            />
                                                            {validator.message('firstName', formData.fname, 'required')}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-label">Last Name</label>
                                                            <input
                                                                type="text"
                                                                name="lname"
                                                                className="form-control"
                                                                value={formData.lname}
                                                                onChange={(e) => changeHandler(e)}
                                                            />
                                                            {validator.message('lastName', formData.lname, 'required')}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-label">Email</label>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                className="form-control"
                                                                value={formData.email}
                                                                onChange={(e) => changeHandler(e)}
                                                            />
                                                            {validator.message('email', formData.email, 'required|email')}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-label">Phone Number</label>
                                                            <input
                                                                type="text"
                                                                name="phone"
                                                                className="form-control"
                                                                value={formData.phone}
                                                                onChange={(e) => changeHandler(e)}
                                                            />
                                                            {validator.message('phone', formData.phone, 'phone')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="btn btn-primary btnhover mt-2" type="submit">Save Setting</button>
                                            </form>

                                            <div className="shop-bx-title clearfix mt-5">
                                                <h5 className="text-uppercase">Reset Password</h5>
                                            </div>
                                            <form onSubmit={submitResetPasswordForm}>
                                                <div className="row">
                                                    <div className="col-lg-6 col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-label">Old Password</label>
                                                            <input
                                                                type="password"
                                                                name="oldPassword"
                                                                className="form-control"
                                                                value={resetPwFormData.oldPassword}
                                                                onChange={(e) => passwordChangeHandler(e)}
                                                            />
                                                            {passwordValidator.message('oldPassword', resetPwFormData.oldPassword, 'required|min:6')}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">New Password</label>
                                                            <input
                                                                type="password"
                                                                name="newPassword"
                                                                className="form-control"
                                                                value={resetPwFormData.newPassword}
                                                                onChange={(e) => passwordChangeHandler(e)}
                                                            />
                                                            {passwordValidator.message('newPassword', resetPwFormData.newPassword, 'required|min:6')}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Confirm New Password</label>
                                                            <input
                                                                type="password"
                                                                name="confirmPassword"
                                                                className="form-control"
                                                                value={resetPwFormData.confirmPassword}
                                                                onChange={(e) => passwordChangeHandler(e)}
                                                            />
                                                            {passwordValidator.message('confirmPassword', resetPwFormData.confirmPassword, `required|min:6|in:${resetPwFormData.newPassword}`)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn btn-primary btnhover mt-3"
                                                    type="submit"
                                                >
                                                    Submit
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            }
        </>
    )
}
export default MyProfile;