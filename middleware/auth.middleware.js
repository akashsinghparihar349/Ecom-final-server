const jwt = require("jsonwebtoken")


function verifyPublic(req, res, next) {
  let token = req.headers.authorization
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY)
    next()
  } catch (error) {
    res.status(401).send({
      result: "Fail",
      reason: "You Are Not Authorized to Access This API"
    })
  }
}

function verifySuperAdmin(req, res, next) {
  let token = req.headers.authorization
  try {
    let decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if (["Super Admin"].includes(decode.data.role))
      next()
    else {
      res.status(401).send({
        result: "Fail",
        reason: "You Are Not Authorized to Access This API"
      })
    }
  } catch (error) {
    res.status(401).send({
      result: "Fail",
      reason: error.message == "invalid signature" || error.message === "jwt must be provided" ? "You Are Not Authorized to Access This API" : "Your Login Sessoin Has Been Expired, Please Login Again"
    })
  }
}


function verifyAdmin(req, res, next) {
  let token = req.headers.authorization
  try {
    let decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if (["Super Admin" , "Admin"].includes(decode.data.role))
      next()
    else {
      res.status(401).send({
        result: "Fail",
        reason: "You Are Not Authorized to Access This API"
      })
    }
  } catch (error) {
    res.status(401).send({
      result: "Fail",
      reason: error.message == "invalid signature" || error.message === "jwt must be provided" ? "You Are Not Authorized to Access This API" : "Your Login Sessoin Has Been Expired, Please Login Again"
    })
  }
}

function verifyBuyer(req, res, next) {
  let token = req.headers.authorization
  try {
    let decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if (["Super Admin" , "Admin" , "Buyer"].includes(decode.data.role))
      next()
    else {
      res.status(401).send({
        result: "Fail",
        reason: "You Are Not Authorized to Access This API"
      })
    }
  } catch (error) {
    res.status(401).send({
      result: "Fail",
      reason: error.message == "invalid signature" || error.message === "jwt must be provided" ? "You Are Not Authorized to Access This API" : "Your Login Sessoin Has Been Expired, Please Login Again"
    })
  }
}


module.exports = {
  verifyPublic,
  verifySuperAdmin,
  verifyAdmin,
  verifyBuyer
}