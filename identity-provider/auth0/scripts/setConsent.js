exports.onExecutePreUserRegistration = async (event, api) => {
    api.user.setUserMetadata("consentGiven", true);
    api.user.setUserMetadata("consentTimestamp", Date.now());
    return;
  };