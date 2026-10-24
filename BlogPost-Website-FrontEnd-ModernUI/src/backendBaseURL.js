const localBackendBaseURL = process.env.REACT_APP_BACKEND_LOCAL_BASEURL;

const productionBackendBaseURL = process.env.REACT_APP_BACKEND_PRODUCTION_BASEURL;

const backendBaseURL = process.env.NODE_ENV === "development" ? localBackendBaseURL : productionBackendBaseURL;

export default backendBaseURL;