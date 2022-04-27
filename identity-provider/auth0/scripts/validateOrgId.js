exports.onExecutePreUserRegistration = async (event, api) => {
    const axios = require('axios');
    const orgId = event.user.user_metadata.orgId;
    const url = 'https://enterprise.resources.dev.rocketlawyer.com/groups/5000003d-b3c2-441d-85ee-2d9d71726cc7/configs/orgazation-metadata/$.'+orgId;
    try {
        const res = await axios.get(url);
        const data = res.data;
    } catch (err) {
        api.access.deny('Invalid Org Id','Invalid OrgId')
    }
};
