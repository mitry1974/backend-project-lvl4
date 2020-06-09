import AuthorizationError from '../errors/AuthorizationError';

export async function verifyAdmin(request) {
  request.log.info(`verifydmin: current user: ${JSON.stringify(request.currentUser)}`);
  if (request.currentUser.role !== 'admin') {
    request.log.info('verifyAdmin failed, throwing error');
    throw new AuthorizationError({ message: `Authorization failed. User ${request.currentUser.email} hasn't admin privileges` });
  }
}

export async function verifyUserSelf(request) {
  const { email } = request.params;
  request.log.info(`verifyUserSelf, current user: ${JSON.stringify(request.currentUser)}, email to check: ${email} `);
  if (request.currentUser.role !== 'user' || request.currentUser.email !== email) {
    request.log.info('verifyUserSelf failed, throwing error');
    throw new AuthorizationError(
      {
        message: `Authorization failed. User ${request.currentUser.email} try to perform operation on foreign account`,
      },
    );
  }
  request.log.info('strange, strange, strange');
}
