/*------------------------------------*\
  Utility function to get URL params
   and update elements accordingly
\*------------------------------------*/

// Get URL
const queryString = window.location.search;
console.log(queryString);

// Get URL params
const urlParams = new URLSearchParams(queryString);
const inputCode = urlParams.get('c');  // code param (?c=nnn)
const isError = urlParams.get('wrong');  // error param (?wrong=1/0)
const isSuccess = urlParams.get('success');  // success param (?success=1/0)


/* Code */
try{  // Auto-fill code input
    document.getElementById("code").value = inputCode;
    if(inputCode >= 10000){  // if code is a valid code (normally scanned from QR-code), make the input readonly
        console.log("ok")
        document.getElementById("code").disabled = true;
    }
} catch(err){  // the code input is not present on the page
    console.log(err)
}


/* Alerts */
if (isError === '1'){ // show alert and fade it after 3 seconds
    document.getElementById("codeAlert").className = "alert alert-danger mb-0 alert-dismissible alert-absolute fade show";
    setTimeout(function(){
        document.getElementById("codeAlert").className = "alert alert-danger mb-0 alert-dismissible alert-absolute fade";
    }, 3000);
}

if (isSuccess === '1'){ // show alert and fade it after 3 seconds
    document.getElementById("okAlert").className = "alert alert-success mb-0 alert-dismissible alert-absolute fade show";
    setTimeout(function(){
        document.getElementById("okAlert").className = "alert alert-success mb-0 alert-dismissible alert-absolute fade";
    }, 3000);
}