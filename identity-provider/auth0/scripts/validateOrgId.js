exports.onExecutePreUserRegistration = async (event, api) => {
    const axios = require('axios');
    const companyId = event.user.user_metadata.companyId;
    const url = 'https://enterprise.resources.dev.rocketlawyer.com/groups/5000003d-b3c2-441d-85ee-2d9d71726cc7/configs/developer-organizations/$.'+companyId;
    try {
        const response = await axios.get(url);
        const uuid = response.data.uuid;
        api.user.setUserMetadata("orgUuid",uuid);
    } catch (err) {
        console.log(err.response);
        api.access.deny('Invalid Org Id','Invalid OrgId')
    }
};