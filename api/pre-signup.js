module.exports.handler = (event, context, callback) => {
  console.log('PreSignUp', JSON.stringify(event))
  
  event.response.autoConfirmUser = true
  event.response.autoVerifyEmail = true

  callback(null, event)
}