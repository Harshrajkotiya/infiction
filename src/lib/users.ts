const processGetuser = async (user_id) => {
    try {
        let url = "";
        if(process.env.CLIENT_URL){
            url = `${process.env.CLIENT_URL}/api/stripeUser?user_id=${user_id}`
        }else{
            url = `/api/stripeUser?user_id=${user_id}`
        }
        const response = await fetch(url)
        const data = await response.json();
        
        return data;
    } catch (err) {
        return err;
    }

}

const processCreateUser = async (data) => {
    
    try {
        let url = "";
        const formDataString = JSON.stringify(data);
        if(process.env.CLIENT_URL){
            url = `${process.env.CLIENT_URL}/api/stripeUser`
        }else{
            url = `/api/stripeUser`
        }
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: formDataString,
        });
        const responseData = await response.json();
        // console.log("responseData", responseData);
        
        return responseData;
    } catch (err) {
        return err;
    }
}

const processUpdateUser = async (stripeId, data) => {
    try {
        let url = "";
        const filteredFormData = Object.fromEntries(
            Object.entries(data).filter(
                ([key, value]) => value !== null && value !== ""
            )
        );

        const formDataString = JSON.stringify({
            id: stripeId,
            ...filteredFormData,
        });

        if(process.env.CLIENT_URL){
            url = `${process.env.CLIENT_URL}/api/stripeUser`
        }else{
            url = `/api/stripeUser`
        }
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: formDataString,
        })
        const responseData = await response.json();
        return responseData;
    } catch (err) {
        return err;
    }
}

export { processGetuser, processCreateUser, processUpdateUser }
