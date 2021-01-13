const AWS = require('aws-sdk')
AWS.config.region = 'eu-west-1'

const chance  = require('chance').Chance()

// needs number, special char, upper and lower case
const random_password = () => `${chance.string({ length: 8})}B!gM0uth`

const an_authenticated_user = async () => {
  const cognito = new AWS.CognitoIdentityServiceProvider()

  const userpoolId = 'eu-west-1_nToedfLLW'
  const clientId = '5vq9t6qsuthc9mm9vrop5qjn3c'

  const firstName = chance.first({ nationality: "en" })
  const lastName  = chance.last({ nationality: "en" })
  const suffix    = chance.string({length: 8, pool: "abcdefghijklmnopqrstuvwxyz"})
  // const username  = `test-${firstName}-${lastName}-${suffix}@gmail.com`
  
  const password  = random_password()
  const email     = `${firstName}-${lastName}@big-mouth.com`
  const username = email

  const createReq = {
    UserPoolId        : userpoolId,
    Username          : username,
    MessageAction     : 'SUPPRESS',
    TemporaryPassword : password,
    UserAttributes    : [
      { Name: "given_name",  Value: firstName },
      { Name: "family_name", Value: lastName },
      { Name: "email",       Value: email }
    ]
  }
  await cognito.adminCreateUser(createReq).promise()

  console.log(`[${username}] - user is created`)
  
  const req = {
    AuthFlow        : 'ADMIN_NO_SRP_AUTH',
    UserPoolId      : userpoolId,
    ClientId        : clientId,
    AuthParameters  : {
      USERNAME: username,
      PASSWORD: password
    }
  }
  const resp = await cognito.adminInitiateAuth(req).promise()

  console.log(`[${username}] - initialised auth flow`)

  const challengeReq = {
    UserPoolId          : userpoolId,
    ClientId            : clientId,
    ChallengeName       : resp.ChallengeName,
    Session             : resp.Session,
    ChallengeResponses  : {
      USERNAME: username,
      NEW_PASSWORD: random_password()
    }
  }
  const challengeResp = await cognito.adminRespondToAuthChallenge(challengeReq).promise()
  
  console.log(`[${username}] - responded to auth challenge`)

  return {
    username,
    firstName,
    lastName,
    idToken: challengeResp.AuthenticationResult.IdToken
  }
};

// module.exports = {
//   an_authenticated_user
// }

(async function() {
  console.log('Create an user in AWS Cognito')
  
  const user = await an_authenticated_user()
  
  console.log(JSON.stringify(user))
}())