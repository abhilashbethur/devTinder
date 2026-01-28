const adminAuth = (req, res, next) => {
  console.log("inside authenticator");
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("Unauthorized");
  } else next();
};

module.exports = { adminAuth };
