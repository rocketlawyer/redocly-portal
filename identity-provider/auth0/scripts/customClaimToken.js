function (user, context, callback) {
    const namespace = 'https://redocly-namespace/';
    context.idToken[namespace + 'orgId'] = user.user_metadata.orgId;
    return callback(null, user, context);
}