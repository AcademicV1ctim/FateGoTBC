//HEHEHEHAW

//////////////////////////////////////////////////////
// INCLUDES                                         //
//////////////////////////////////////////////////////
const app = require('./src/app');

//////////////////////////////////////////////////////
// SETUP ENVIRONMENT                                //
//////////////////////////////////////////////////////
const PORT = 3000; // can be located in .env file

//////////////////////////////////////////////////////
//START SERVER                                      //
//////////////////////////////////////////////////////
app.listen(PORT,()=> {
    console.log(`App listening to port ${PORT}`);
});
