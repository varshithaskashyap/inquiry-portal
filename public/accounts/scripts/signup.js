console.log('hello world!')

function CheckUsername(callBack) {

     $.get('/api/checkusername/', { username: $('#username').val() },
	 function (data) {
            var username = $.trim($('#username').val());
            if (username.length < 5) {
                $('#availabality').css({ "color": "red" })
				$('#availabality').html("Username too short!");
				$('#submitButton').html(`<button type="button" class="btn btn-primary" disabled>Submit</button>`);
                callBack(false);
            } else {
                if (data === false) {
                  $('#availabality').css({ "color": "red" })
				  $('#availabality').html("Username not available");
				  $('#submitButton').html(`<button type="button" class="btn btn-primary" disabled>Submit</button>`);
				callBack(false);
				} else {
                    $('#availabality').css({ "color": "green" })
					$('#availabality').html("Username available");
					$('#submitButton').html(`<button type="submit" class="btn btn-primary">Submit</button>`);
				callBack(true);
                }
            }
		});

		return self.isValidUsername
}


function checkPassword() {
  var password = $.trim($('#password').val());
  if (password.length < 5) {
    $('#valid-password').css({ "color": "red" })
    $('#valid-password').html("password too short!");
    return false
  }else{
    $('#valid-password').css({ "color": "green" })
    $('#valid-password').html("passwords valid!");
    return true
  }
}

function comparePassword() {
  var password = $.trim($('#password').val());
  var repassword = $.trim($('#repassword').val());

  if (password !== repassword) {
    $('#valid-repassword').css({ "color": "red" })
    $('#valid-repassword').html("passwords do not match!");
    return false

  }else{
    $('#valid-repassword').css({ "color": "green" })
    $('#valid-repassword').html("passwords valid!");
    return true
  }
}
function onChange() {
    var isValidUsername=false;
    var isValidPassword=false;
    var isValidRepassword=false;
	var isFormValid=false;
	
	let isformValid = ()=> {
		console.log("username="+isValidUsername)
		console.log("password="+isValidPassword)
		console.log("repassword="+isValidRepassword)
		if(isValidPassword===true && isValidRepassword===true){
			isFormValid=true;
		}
		$("form").submit(function(e){
			if(isFormValid === false){
				e.preventDefault();
			}
		  });
	}

    $("#username").change(function () { isValidUsername = CheckUsername(function(isValidUsername){}); isformValid() });
    $("#password").change(function () { isValidPassword=checkPassword(); isformValid() });
    $("#repassword").change(function () {isValidRepassword=comparePassword(); isformValid() });
	
	
}
$(document).ready(onChange);
