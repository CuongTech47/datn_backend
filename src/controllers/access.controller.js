"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    /* 
    201 CREATED
     */

    new CREATED({
        message : 'Registed OK!',
        metadata : await AccessService.signUp(req.body)
    }).send(res)
   
  }

  login = async ( req , res , next) => {
     /* 
    200 OK
     */
    new SuccessResponse({
        metadata : await AccessService.login(req.body)
    }).send(res)
  }
}

module.exports = new AccessController();
