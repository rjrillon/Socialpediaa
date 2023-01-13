import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

// Yup Validation Schema: 
// Will determine the shape of how the form library is going to be saving this information
const registerSchema = yup.object().shape({
    //gives errors for invalid inputs
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
});

const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picture: "",
};

const initialValuesLogin = {
    email: "",
    password: "",
};

const Form = () => {
    const [pageType, setPageType] = useState("login");
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    //values come from (see comment on handleFormSubmit)
    const register = async (values, onSubmitProps) => {
        // normally we can just use values and pass it to a normal request body itself,
        // but because we have a picture image, we must use formData.
        // this allows us to send form info with image
        const formData = new FormData();

        // loop through every key, value in values object and append to formData 
        // unconventional, but when u have an img this is one way to send the image through the request body
        for (let value in values) {
            formData.append(value, values[value])
        }
        formData.append("picturePath", values.picture.name);

        const savedUserResponse = await fetch(
            "http://localhost:3001/auth/register",
            {
                method: "POST",
                body: formData,
            }
        );
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if (savedUser) {
            setPageType("login");
        }
    };

    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
                method: "POST",
                headers: { "Content-Type": "applications/json" },
                body: JSON.stringify(values),
        });
        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();
        if (loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,

                })
            );
            navigate("/home");
        }
    };

    //values === every value prop created inside text field (values.firstName, values.lastName, etc)
    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
    };

    return (
        // What Formik is doing:
        // Grabbing the handleFormSubmit and passing it in our Formik so it can pass it on to our onSubmit func
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {({
                //this syntax allows you to use these values in your form and components
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display="grid"
                        gap="30px"
                        gridTemplateColumns="repeat(4px, minmax(0, 1fr))" //split our grid into 4 sections, min(0) otherwise split into equal fractions of 4
                        sx={{ // below will target any div tags and apply the following after :
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4"},
                        }}
                    >
                        {isRegister && (
                            <>
                                <TextField
                                    label="First Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstName}
                                    name="firstName"
                                    //check if touched or if there's an error. then it will show that there's an error for this text field
                                    error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                                    //if it has been touched but there is an error, then show the error using helper text
                                    helperText={touched.firstName && errors.firstName}
                                    //in larger screens, span 2. in smaller screens, override the below with span 4 from aboveee
                                    sx={{ gridColumn: "span 2"}}
                                />
                                <TextField
                                    label="Last Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lastName}
                                    name="lastName"
                                    //check if touched or if there's an error. then it will show that there's an error for this text field
                                    error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                                    //if it has been touched but there is an error, then show the error using helper text
                                    helperText={touched.lastName && errors.lastName}
                                    //in larger screens, span 2. in smaller screens, override the below with span 4 from aboveee
                                    sx={{ gridColumn: "span 2"}}
                                />
                                <TextField
                                    label="Location"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.location}
                                    name="location"
                                    //check if touched or if there's an error. then it will show that there's an error for this text field
                                    error={Boolean(touched.location) && Boolean(errors.location)}
                                    //if it has been touched but there is an error, then show the error using helper text
                                    helperText={touched.location && errors.location}
                                    //in larger screens, span 2. in smaller screens, override the below with span 4 from aboveee
                                    sx={{ gridColumn: "span 4"}}
                                />
                                <TextField
                                    label="Occupation"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.occupation}
                                    name="occupation"
                                    //check if touched or if there's an error. then it will show that there's an error for this text field
                                    error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                                    //if it has been touched but there is an error, then show the error using helper text
                                    helperText={touched.occupation && errors.occupation}
                                    //in larger screens, span 2. in smaller screens, override the below with span 4 from aboveee
                                    sx={{ gridColumn: "span 4"}}
                                />

                                <Box
                                    gridColumn="span 4"
                                    border={`1px solid ${palette.neutral.medium}`}
                                    borderRadius="5px"
                                    p="1.5rem"
                                >
                                    <Dropzone
                                        acceptedFiles=".jpg,.jpeg,.png"
                                        multiple={false}
                                        onDrop={(acceptedFiles) => 
                                            setFieldValue("picture", acceptedFiles[0])
                                        }
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <Box
                                                {...getRootProps()}
                                                border={`2px dashed ${palette.primary.main}`}
                                                p="1rem"
                                                //target hover and change it to cursor
                                                sx={{ "&:hover": { cursor: "pointer"} }}
                                            >
                                                <input {...getInputProps()} />
                                                {!values.picture ? (
                                                    <p>Add Picture Here</p>
                                                ) : (
                                                    <FlexBetween>
                                                        <Typography>{values.picture.name}</Typography>
                                                        <EditOutlinedIcon/>
                                                    </FlexBetween>
                                                )}
                                            </Box>
                                        )}
                                    </Dropzone>
                                </Box>
                            </>
                        )}

                        <TextField
                            label="Email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                            //check if touched or if there's an error. then it will show that there's an error for this text field
                            error={Boolean(touched.email) && Boolean(errors.email)}
                            //if it has been touched but there is an error, then show the error using helper text
                            helperText={touched.email && errors.email}
                            //in larger screens, span 2. in smaller screens, override the below with span 4 from aboveee
                            sx={{ gridColumn: "span 4"}}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                            //check if touched or if there's an error. then it will show that there's an error for this text field
                            error={Boolean(touched.password) && Boolean(errors.password)}
                            //if it has been touched but there is an error, then show the error using helper text
                            helperText={touched.password && errors.password}
                            //in larger screens, span 2. in smaller screens, override the below with span 4 from aboveee
                            sx={{ gridColumn: "span 4"}}
                        />
                    </Box>


                    {/* BUTTONS */}
                    <Box>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                m:"2rem 0",
                                p:"1rem",
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                "&:hover": { color: palette.primary.main },
                            }}
                        >
                            {isLogin ? "LOGIN": "REGISTER"}
                        </Button>
                        <Typography
                            onClick={() => {
                                setPageType(isLogin ? "register" : "login");
                                resetForm();
                            }}
                            sx={{
                                textDecoration: "underline",
                                color: palette.primary.main,
                                "&:hover": {
                                    cursor: "pointer",
                                    color: palette.primary.light,
                                },
                            }}
                        >
                            {isLogin 
                                ? "Don't have an accont? Sign Up here."
                                : "Already have an account? Login here."}
                        </Typography>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default Form;