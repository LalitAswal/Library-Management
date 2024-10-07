export const registration = async(req, res) =>{
    try {
        const {userName, password, emailAccount} = req.body;
    if(!userName || !password || !emailAccount){
        throw new Error('incorrect  Details')
    }
       await userRegistration(userName, password, emailAccount);
       res.send(200).json({
        message:'user Register Successfully'
       })
    
    } catch (error) {
            res.send(500).json({
                message:"Something went wrong"
            })
    }
    

}


export const login = async(req, res) =>{

    try {
        const {userName, password} = req.body;

        if(!userName || !password){
            throw new Error('Incorrect userName and password')
        }

        const result = await loginUser(userName, password);
    } catch (error) {
        
    }
   
}