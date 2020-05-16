module.exports={
    async getVendorID(email) {
        console.log(admin);
        
        let result = await admin.auth().getUserByEmail(email)
        return result.uid
    }

}





