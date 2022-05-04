function (user, context, callback) {
    const namespace = 'https://redocly-namespace/';
    context.idToken[namespace + 'orgUuId'] = user.user_metadata.orgUuid;
    return callback(null, user, context);
}